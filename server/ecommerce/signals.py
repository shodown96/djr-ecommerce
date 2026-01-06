# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from ecommerce.models import Item, Profile
from workers.tasks import resize_item_image


@receiver(post_save, sender=Item)
def trigger_resize(sender, instance, created, **kwargs):
    resize_item_image.delay(instance.id)


def user_profile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.create(user=instance)


post_save.connect(user_profile_receiver, sender=settings.AUTH_USER_MODEL)
