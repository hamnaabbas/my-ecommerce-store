from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls')),
     path('accounts/logout/', auth_views.LogoutView.as_view(next_page='index'), name='logout'),
]

# Yeh line honi zaroori hai taake images browser par load ho sakein:
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    