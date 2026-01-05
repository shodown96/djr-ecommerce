"""
ASGI config for DJR Ecommerce project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from utils.common import get_environment_mode

env = get_environment_mode()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'core.settings.{env}')

application = get_asgi_application()
