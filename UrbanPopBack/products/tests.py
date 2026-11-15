from decimal import Decimal

from django.test import TestCase
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient

from .models import Order, Product
from .serializers import OrderCreateSerializer


class ProductModelTests(TestCase):
    def test_product_is_saved_with_its_details(self):
        product = Product.objects.create(
            name="Classic Tee",
            sku="UP-TEST-001",
            category="fashion",
            price=Decimal("24.99"),
            stock=5,
        )

        saved_product = Product.objects.get(sku="UP-TEST-001")

        self.assertEqual(saved_product.name, "Classic Tee")
        self.assertEqual(saved_product.price, Decimal("24.99"))
        self.assertEqual(saved_product.stock, 5)
        self.assertTrue(saved_product.is_active)


class OrderCreationTests(TestCase):
    def test_order_reduces_product_stock(self):
        product = Product.objects.create(
            name="Classic Tee",
            sku="UP-TEST-002",
            category="fashion",
            price=Decimal("24.99"),
            stock=5,
        )

        serializer = OrderCreateSerializer(
            data={
                "customer_name": "Test Customer",
                "email": "customer@example.com",
                "items": [{"product_id": product.id, "quantity": 2}],
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        order = serializer.save()

        product.refresh_from_db()

        self.assertEqual(product.stock, 3)
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.total, Decimal("49.98"))

    def test_order_fails_when_quantity_exceeds_stock(self):
        product = Product.objects.create(
            name="Classic Tee",
            sku="UP-TEST-003",
            category="fashion",
            price=Decimal("24.99"),
            stock=1,
        )

        serializer = OrderCreateSerializer(
            data={
                "customer_name": "Test Customer",
                "email": "customer@example.com",
                "items": [{"product_id": product.id, "quantity": 2}],
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        with self.assertRaises(ValidationError):
            serializer.save()

        product.refresh_from_db()

        self.assertEqual(product.stock, 1)
        self.assertEqual(Order.objects.count(), 0)


class ProductListAPITests(TestCase):
    def test_list_shows_only_active_products_with_stock(self):
        Product.objects.create(
            name="Available Tee",
            sku="UP-API-001",
            category="fashion",
            price=Decimal("24.99"),
            stock=5,
            is_active=True,
        )
        Product.objects.create(
            name="Sold Out Tee",
            sku="UP-API-002",
            category="fashion",
            price=Decimal("24.99"),
            stock=0,
            is_active=True,
        )
        Product.objects.create(
            name="Hidden Tee",
            sku="UP-API-003",
            category="fashion",
            price=Decimal("24.99"),
            stock=5,
            is_active=False,
        )

        client = APIClient()
        response = client.get("/api/products/")

        self.assertEqual(response.status_code, 200)

        product_names = {product["name"] for product in response.data}
        self.assertEqual(product_names, {"Available Tee"})