from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny

from .models import Product
from .serializers import OrderCreateSerializer, ProductSerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(
        is_active=True,
        stock__gt=0,
    ).order_by("name")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user if user.is_authenticated else None)