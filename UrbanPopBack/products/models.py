from decimal import Decimal
from django.db import models
from django.conf import settings


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("fashion", "Fashion"),
        ("accessories", "Accessories"),
        ("tech", "Tech"),
        ("essentials", "Essentials"),
    ]

    name = models.CharField(max_length=120)
    sku = models.CharField(max_length=30, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="products/", blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"

    
class Order(models.Model):
    STATUS_CHOICES = [
        ("received", "Received"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("cancelled", "Cancelled"),
    ]
    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="orders",
    verbose_name="Customer account",
)

    customer_name = models.CharField(max_length=120)
    email = models.EmailField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="received",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total(self):
        return sum(
            (item.line_total for item in self.items.all()),
            Decimal("0.00"),
        )

    def __str__(self):
        return f"Order #{self.pk} - {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(
        Product,
        related_name="order_items",
        on_delete=models.PROTECT,
    )
    product_name = models.CharField(max_length=120)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField()

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.product_name} × {self.quantity}"