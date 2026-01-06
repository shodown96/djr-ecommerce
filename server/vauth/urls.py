from django.urls import path

from vauth.views import UserDetailView, UserIDView

urlpatterns = [
    path("users/me/", UserDetailView.as_view(), name="user-detail"),
    path("users/me/id/", UserIDView.as_view(), name="user-id"),
]
