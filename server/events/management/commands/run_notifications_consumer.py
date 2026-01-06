from django.core.management.base import BaseCommand
from events.consumers.order_notifications import consume_order_events

class Command(BaseCommand):
    help = "Run notifications RabbitMQ consumer"

    def handle(self, *args, **options):
        consume_order_events()

# python manage.py run_notifications_consumer