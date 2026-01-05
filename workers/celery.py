import os
from django.conf import settings
from celery import Celery

from core.constants import ServiceDiscovery
from core.utilities.common import get_environment_mode

env = get_environment_mode()

# identify the settings to use based on the environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"core.settings.{env}")
# setup the worker for celery
# app = Celery(ServiceDiscovery.Name, broker=settings.CELERY_BROKER)
app = Celery(ServiceDiscovery.Name)
app.config_from_object("django.conf:settings", namespace="CELERY")

# Looks up for task modules in Django applications and loads them
app.autodiscover_tasks()
