# messaging/publisher.py
from kombu import Connection, Producer
from django.conf import settings
from events.exchange import EVENTS_EXCHANGE

def publish_event(event_name: str, payload: dict):
    with Connection(settings.RABBITMQ_URL) as conn:
        producer = Producer(conn)
        producer.publish(
            payload,
            exchange=EVENTS_EXCHANGE,
            routing_key=event_name,
            serializer="json",
            retry=True,
        )
