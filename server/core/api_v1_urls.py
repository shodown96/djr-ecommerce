from django.urls import include, path

urlpatterns = [
    path("", include("ecommerce.api.urls")),
    path("auth/", include("vauth.urls")),
    path("auth/rest_framework", include("rest_framework.urls")),
]