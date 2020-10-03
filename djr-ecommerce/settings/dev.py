'''Use this for development'''

from .base import *

ALLOWED_HOSTS += ['127.0.0.1']
DEBUG = True


CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)

STRIPE_PUBLIC_KEY = config('STRIPE_TEST_PUBLIC_KEY')
STRIPE_SECRET_KEY = config('STRIPE_TEST_SECRET_KEY')
PAYSTACK_SECRET_KEY = config('PAYSTACK_TEST_SECRET_KEY')
