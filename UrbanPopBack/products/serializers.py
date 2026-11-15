from django.db import transaction
from rest_framework import serializers

from .models import Order, OrderItem, Product


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(
        source="get_category_display",
        read_only=True,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "price",
            "description",
            "image",
            "is_featured",
        ]


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    customer_name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    status = serializers.CharField(read_only=True)
    total = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )
    items = OrderItemInputSerializer(
        many=True,
        write_only=True,
        allow_empty=False,
    )

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        with transaction.atomic():
            order = Order.objects.create(**validated_data)

            for item_data in items_data:
                product_id = item_data["product_id"]
                quantity = item_data["quantity"]

                try:
                    product = Product.objects.select_for_update().get(
                        pk=product_id,
                        is_active=True,
                    )
                except Product.DoesNotExist:
                    raise serializers.ValidationError(
                        {"items": f"Product {product_id} is unavailable."}
                    )

                if product.stock < quantity:
                    raise serializers.ValidationError(
                        {"items": f"Not enough stock for {product.name}."}
                    )

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    unit_price=product.price,
                    quantity=quantity,
                )

                product.stock -= quantity
                product.save(update_fields=["stock"])

        return order