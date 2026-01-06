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
    # url="http://localhost:8000/api/v1/",
    public=True,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("docs/swagger/", schema_view.with_ui(), name="schema_swagger_ui"),
    path(
        "docs/redoc/",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema_redoc_ui",
    ),
    path("api/v1/", include("core.api_v1_urls")),
    re_path(r"^.*", TemplateView.as_view(template_name="index.html")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
