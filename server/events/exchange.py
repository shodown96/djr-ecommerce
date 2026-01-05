from kombu import Exchange

EVENTS_EXCHANGE = Exchange(
    "events",
    type="topic",
    durable=True,
)
