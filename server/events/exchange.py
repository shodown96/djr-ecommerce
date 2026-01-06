from kombu import Exchange


# Define the shared exchange used for all domain events.
# - "events" is the exchange name in RabbitMQ
# - type="topic" allows routing based on patterns (e.g. "order.*")
# - durable=True ensures the exchange survives broker restarts
EVENTS_EXCHANGE = Exchange(
    "events",
    type="topic",
    durable=True,
)
