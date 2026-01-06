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
        )
