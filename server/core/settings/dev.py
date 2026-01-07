'''Use this for development'''

from core.settings.base import *

ALLOWED_HOSTS += ['*']
DEBUG = True


CORS_ORIGIN_WHITELIST = (
    'http://localhost:5173',
)

STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_TEST_PUBLIC_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_TEST_SECRET_KEY')
PAYSTACK_SECRET_KEY = os.environ.get('PAYSTACK_TEST_SECRET_KEY')

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql_psycopg2",
#         "NAME": os.environ.get("DB_NAME", "ecommerce"),
#         "USER": os.environ.get("DB_USER", "ecommerce"),
#         "PASSWORD": os.environ.get("DB_PASS", "ecommerce"),
#         "HOST": os.environ.get("DB_HOST", "localhost"),
#         "PORT": os.environ.get("DB_PORT", 5432),
#         "AUTO_CREATE": True,
#     }
# }