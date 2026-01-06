from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        # token['name'] = user.name
        # ...

        return token


# # Django project settings.py

# SIMPLE_JWT = {
#   "TOKEN_OBTAIN_SERIALIZER": "common.serializers.MyTokenObtainPairSerializer",
#   # ...
# }
