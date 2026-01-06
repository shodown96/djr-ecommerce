from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from vauth.views import UserDetailView, UserCreateView

urlpatterns = [
    path("sign-in/", TokenObtainPairView.as_view(), name="sign-in"),
    path("sign-up/", UserCreateView.as_view(), name="sign-up"),
    path("refresh-token/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/me/", UserDetailView.as_view(), name="user-detail"),
]
