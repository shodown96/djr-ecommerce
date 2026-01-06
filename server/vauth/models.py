from common.constants import DBTables
from common.models import BaseModel
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from integrations.mailjet import send_email

# from django.contrib.auth import get_user_model
# User = get_user_model()
# OR settings.AUTH_USER_MODEL


# Create your models here.
class Account(BaseModel, AbstractBaseUser, PermissionsMixin):
    """
    An Account class implementing a fully featured User model with
    admin-compliant permissions.
    """

    username_validator = UnicodeUsernameValidator()
    first_name = models.TextField(max_length=200, blank=True, null=True)
    last_name = models.TextField(max_length=200, blank=True, null=True)
    username = models.CharField(
        max_length=250,
        blank=False,
        null=False,
        unique=True,
        validators=[username_validator],
    )
    email = models.EmailField(max_length=250, blank=False, null=False, unique=True)
    avatar_url = models.CharField(max_length=500, blank=True, null=True, default="")
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    blocked_at = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "username"

    # def email_user(self, subject, context):
    #     """Send an email to this user."""
    #     send_email(self.email, subject, "", context)

    class Meta:
        db_table = DBTables.Account


class Profile(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=50, blank=True, null=True)
    one_click_purchasing = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    class Meta:
        db_table = DBTables.Profile
