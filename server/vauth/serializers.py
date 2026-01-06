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
