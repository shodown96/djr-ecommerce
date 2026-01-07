from kombu import Connection, Queue, Consumer
from django.conf import settings
from events.exchange import EVENTS_EXCHANGE
from workers.tasks import send_order_completed_email
from space.models import Activity


# Define a queue that will receive order-related events.
# - "notifications" is the queue name in RabbitMQ
# - EVENTS_EXCHANGE is the shared domain events exchange
# - routing_key="order.*" means this queue will receive
#   any event that starts with "order."
# - durable=True ensures the queue survives broker restarts
queue = Queue(
    "notifications",
    exchange=EVENTS_EXCHANGE,
    routing_key="order.*",
    durable=True,
)


def handle_message(body, message):
    """
    Callback executed whenever an event is received.

    - body: the deserialized event payload (dict)
    - message: the raw Kombu message object
    """
    activity_id = body.get("activity_id")

    if not activity_id:
        # Malformed message with no activity reference.
        # Acknowledge to avoid poison-message loops.
        message.ack()
        return

    try:
        # Always re-fetch the Activity from the database.
        # The database is the source of truth, not the message payload.
        activity = Activity.objects.get(id=activity_id)
    except Activity.DoesNotExist:
        # The referenced activity no longer exists.
        # Safely acknowledge and discard the message.
        message.ack()
        return

    # Idempotency guard.
    # If this activity was already processed, do nothing.
    if activity.status == Activity.Status.PROCESSED:
        message.ack()
        return

    try:
        # Trigger a background task to send the order completion email.
        # This keeps email sending async and retry-safe.
        send_order_completed_email.delay(
            activity.payload.get("order_id")
        )

        # Mark the activity as processed only after the side effect
        # has been successfully triggered.
        activity.mark_processed()

        # Acknowledge the message so RabbitMQ knows it was handled.
        # If this is not called, the message will be redelivered.
        message.ack()

    except Exception:
        # If anything goes wrong, mark the activity as failed.
        # This allows inspection or replay later.
        activity.mark_failed()

        # Reject the message without requeueing to avoid infinite retries.
        message.reject(requeue=False)
    
    
def consume_order_events():
    """
    Long-running consumer process that listens for order events.

    - Opens a connection to RabbitMQ
    - Subscribes to the notifications queue
    - Blocks and waits for events indefinitely
    """
    with Connection(settings.RABBITMQ_URL) as conn:
        # Ensure the shared events exchange exists
        EVENTS_EXCHANGE(conn).declare()

        # Ensure the notifications queue exists and is bound
        queue(conn).declare()

        with Consumer(conn, queues=[queue], callbacks=[handle_message]):
            # Continuously wait for and process incoming events
            while True:
                conn.drain_events()
