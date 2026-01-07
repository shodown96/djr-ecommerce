from rest_framework import serializers
from vauth.models import Account


class AccountDetailSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = Account
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "created_at",
            "updated_at",
        )


class AccountCreateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = Account
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        # TODO: send email verification code to verify account
        validated_data["is_active"] = True
        password = validated_data.pop("password")
        user = Account(**validated_data)
        user.set_password(password)
        user.save()
        return user

# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from django.contrib.auth import authenticate

# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

#     def validate(self, attrs):
#         # Default behaviour (username/password)
#         data = super().validate(attrs)

#         # Add extra response data
#         data["user"] = {
#             "id": self.user.id,
#             "email": self.user.email,
#             "first_name": self.user.first_name,
#             "last_name": self.user.last_name,
#         }

#         return data
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

#     def validate(self, attrs):
#         email = attrs.get("email")
#         password = attrs.get("password")

#         user = authenticate(
#             request=self.context.get("request"),
#             email=email,
#             password=password,
#         )

#         if not user:
#             raise serializers.ValidationError("Invalid credentials")

#         refresh = self.get_token(user)

#         return {
#             "refresh": str(refresh),
#             "access": str(refresh.access_token),
#             "user": {
#                 "id": user.id,
#                 "email": user.email,
#             },
#         }
