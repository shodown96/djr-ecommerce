from django.conf import settings
from redis import Redis as RedisAPI

from core.exceptions import NotFoundError

r = RedisAPI(host=settings.REDIS_HOST, port=settings.REDIS_PORT, username=settings.REDIS_USERNAME, password=settings.REDIS_PASSWORD)


class Redis:
    """
    A  small helper class for integration with redis api
    """

    @classmethod
    def has_key(self, key: str):
        return r.exists(key)

    @classmethod
    def set(self, key: str, value: str, **options):
        return r.set(key, value, **options)

    @classmethod
    def get(self, key: str):
        value = r.get(key)
        if not value:
            raise NotFoundError()
        return value

    @classmethod
    def unset(self, key: str):
        return r.delete(key)
    
    @classmethod
    def unset_all(self):
        return r.flushall()
