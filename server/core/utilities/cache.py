from django.core.cache import cache
from django.conf import settings
from ecommerce.models import Item
from ecommerce.api.serializers import ItemDetailSerializer


def get_product(slug):
    key = f"product:{slug}"
    data = cache.get(key)

    if not data:
        item = Item.objects.get(slug=slug)
        data = ItemDetailSerializer(item).data
        cache.set(key, data, 300)

    return data



def acquire_idempotency_lock(key: str, ttl: int = settings.DEFAULT_TTL) -> bool:
    """
    Returns True if the operation should proceed.
    Returns False if it has already been processed.
    """
    # cache.add is atomic: it only sets if key does not exist
    return cache.add(key, "done", timeout=ttl)
