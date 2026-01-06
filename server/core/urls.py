from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

schema_view = get_schema_view(
    info=openapi.Info(
        title="DJR Ecommerce",
        default_version="1.0",
        description="An Ecommerce Project Powered by Django and React",
        contact=openapi.Contact(
            name="Elijah Soladoye", url="https://elijahsoladoye.com"
        ),
    ),
    public=True,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("docs/", schema_view.with_ui(), name="schema-swagger-ui"),
    path("api/", include("ecommerce.api.urls")),
    path("api/", include("vauth.urls")),
    path("api/auth/", include("rest_framework.urls")),
    re_path(r"^.*", TemplateView.as_view(template_name="index.html")),
    # path('rest-auth/', include('rest_auth.urls')),
    # path('rest-auth/registration/', include('rest_auth.registration.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# from workers.tasks import ping
# ping.delay()
