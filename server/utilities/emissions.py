from space.models import Activity
from ecommerce.models import Order
from vauth.models import Account
from events.publisher import publish_event


def emit_order_completed(order: Order, user: Account):
    activity = Activity.objects.create(
        kind=Activity.Kind.EVENT,
        type="order.completed",
        actor_id=user.id,
        payload={
            "order_id": str(order.id),
            "user_id": str(order.user_id),
            "total": order.get_total(),
        },
        idempotency_key=f"order.completed:{order.id}",
    )

    publish_event(
        event_name=activity.type,
        payload={
            "activity_id": str(activity.id),
            "order_id": str(order.id),
            "user_id": str(order.user_id),
            "total": order.get_total(),
        },
    )

    return activity
