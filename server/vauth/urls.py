from django.urls import path
from vauth.views import (
    UserDetailView,
    UserCreateView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
)

urlpatterns = [
    path("sign-in/", CustomTokenObtainPairView.as_view(), name="sign-in"),
    path("sign-up/", UserCreateView.as_view(), name="sign-up"),
    path("refresh-token/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("users/me/", UserDetailView.as_view(), name="user-detail"),
]
