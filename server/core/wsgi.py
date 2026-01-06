"""
WSGI config for DJR Ecommerce project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

from utilities.common import get_environment_mode

env = get_environment_mode()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'core.settings.{env}')

application = get_wsgi_application()