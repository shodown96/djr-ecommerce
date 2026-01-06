from celery import shared_task
from ecommerce.api.serializers import Item, Order
from core.utilities.files import image_resize
from core.utilities.cache import acquire_idempotency_lock
from integrations.mailjet import send_email


@shared_task
def ping():
    return "pong"


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=5)
def resize_item_image(self, item_id):
    item = Item.objects.get(id=item_id)
    image_resize(item.image, 1000, 1000)


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=10)
def send_order_completed_email(self, order_id):
    key = f"email:order_completed:{order_id}"

    if not acquire_idempotency_lock(key):
        # Already sent or being processed
        return "duplicate_skipped"

    order = Order.objects.get(id=order_id)

    send_email(
        to_email=order.user.email,
        subject="Your order is complete",
        template_name="emails/order_completed.html",
        context={
            "user_name": order.user.first_name,
            "order_id": order.id,
            "total": order.get_total(),
        },
    )
    # send_email(order_id)
    return "email_sent"
