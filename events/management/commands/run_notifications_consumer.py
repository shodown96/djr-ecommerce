from django.core.management.base import BaseCommand
from events.consumers.order_notifications import run

class Command(BaseCommand):
    help = "Run notifications RabbitMQ consumer"

    def handle(self, *args, **options):
        run()

# python manage.py run_notifications_consumer