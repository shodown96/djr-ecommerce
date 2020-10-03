'''Use this for production'''

import django_heroku
from .base import *

DEBUG = False
ALLOWED_HOSTS += ['djr-blog.herokuapp.com']
SECRET_KEY = os.environ.get("SECRET_KEY")
WSGI_APPLICATION = 'djr-ecommerce.wsgi.prod.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'db_name',
        'USER': 'db_user',
        'PASSWORD': 'db_password',
        'HOST': 'localhost',
        'PORT': '',
    }
}


CORS_ORIGIN_WHITELIST = (
    'https://djr-blog.herokuapp.com',
)

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_TEST_PUBLIC_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_TEST_SECRET_KEY')
PAYSTACK_SECRET_KEY = os.environ.get('PAYSTACK_TEST_SECRET_KEY')


# to avoid transmitting the CSRF cookie over HTTP accidentally.
CSRF_COOKIE_SECURE = True
# to avoid transmitting the session cookie over HTTP accidentally.
SESSION_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_REFERRER_POLICY = "origin"

# AWS
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_BUCKET_SOURCE = os.environ.get('AWS_BUCKET_SOURCE')

AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME')
AWS_S3_SIGNATURE_VERSION = os.environ.get('AWS_SIGNATURE_VERSION', 's3v4')

AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
DEBUG_PROPAGATE_EXCEPTIONS = True

django_heroku.settings(locals())
