from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from django.conf import settings
from django.conf.urls.static import static

from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    info=openapi.Info(
        title="DJR-Ecommerce",
        default_version="1.0",
        description="My Second Django-React Project",
        contact=openapi.Contact(name="Elijah Soladoye",
                                url="https://elijahsoladoye.netlify.app"),
    ),
    public=True
)

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('admin/', admin.site.urls),
    path("api/", include("core.api.urls")),
    path('docs/', schema_view.with_ui(), name="schema-swagger-ui"),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [re_path(r'^.*',
                        TemplateView.as_view(template_name='index.html'))]
