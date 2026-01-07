# messaging/publisher.py
from kombu import Connection, Producer
from django.conf import settings
from events.exchange import EVENTS_EXCHANGE


def publish_event(event_name: str, payload: dict):
    """
    Publish a domain event to RabbitMQ.

    - event_name: the routing key (e.g. "order.completed")
    - payload: the event data (must be JSON-serializable)

    This function:
    - Opens a connection to RabbitMQ
    - Publishes the event to the shared events exchange
    - Does not wait for or care about consumers
    """
    # Establish a connection to RabbitMQ using the configured URL
    with Connection(settings.RABBITMQ_URL) as conn:
        # Ensure the events exchange exists before publishing
        EVENTS_EXCHANGE(conn).declare()

        # Create a producer for publishing messages
        producer = Producer(conn)

        # Publish the event payload to the events exchange
        producer.publish(
            payload,
            exchange=EVENTS_EXCHANGE,
            routing_key=event_name,
            serializer="json",
            retry=True,
        )
