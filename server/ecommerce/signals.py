# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from ecommerce.models import Item
from workers.tasks import resize_item_image

@receiver(post_save, sender=Item)
def trigger_resize(sender, instance, created, **kwargs):
    resize_item_image.delay(instance.id)