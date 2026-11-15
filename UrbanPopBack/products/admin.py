from django.contrib import admin
from .models import Order, OrderItem, Product


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "product_name", "unit_price", "quantity")
    can_delete = False


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "sku",
        "category",
        "price",
        "stock",
        "is_active",
        "is_featured",
        "created_at",
    )
    list_filter = ("category", "is_active", "is_featured")
    search_fields = ("name", "sku")
    list_editable = ("price", "stock", "is_active", "is_featured")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "email", "status", "created_at", "total")
    list_filter = ("status", "created_at")
    search_fields = ("customer_name", "email")
    readonly_fields = ("created_at", "total")
    inlines = [OrderItemInline]