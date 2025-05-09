from django.contrib import admin
from django.urls import path, include
from django.apps import apps
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Oscar URLs
    path('', include(apps.get_app_config('oscar').urls[0])),
    
    # Custom API redirect URLs
    path('api/', include('api_redirects.urls')),
    
    # Oscar API URLs (after custom redirects to ensure precedence)
    path('api/', include('oscarapi.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
