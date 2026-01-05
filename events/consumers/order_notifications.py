# from kombu import Connection, Queue, Consumer
# from django.conf import settings
# from events.exchange import EVENTS_EXCHANGE
# from workers.tasks import send_order_email

# queue = Queue(
#     "notifications",
#     exchange=EVENTS_EXCHANGE,
#     routing_key="order.*",
#     durable=True,
# )

# def handle_message(body, message):
#     send_order_email.delay(body["order_id"])
#     message.ack()
    
    
# def run():
#     with Connection(settings.RABBITMQ_URL) as conn:
#         with Consumer(conn, queues=[queue], callbacks=[handle_message]):
#             while True:
#                 conn.drain_events()

