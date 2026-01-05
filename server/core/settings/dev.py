'''Use this for development'''

from .base import *

ALLOWED_HOSTS += ['*']
DEBUG = True


CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)

STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_TEST_PUBLIC_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_TEST_SECRET_KEY')
PAYSTACK_SECRET_KEY = os.environ.get('PAYSTACK_TEST_SECRET_KEY')
