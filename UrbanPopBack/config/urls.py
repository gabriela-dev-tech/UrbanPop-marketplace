from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from products.views import OrderCreateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/artists/', include('artists.urls')),
    path("api/products/", include("products.urls")),
    path("api/orders/", OrderCreateView.as_view(), name="order-create"),
    path("api/auth/", include("accounts.urls")),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )