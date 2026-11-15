from rest_framework import serializers
from .models import ArtistApplication


class ArtistApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistApplication
        fields = [
            "id",
            "artist_name",
            "email",
            "category",
            "portfolio",
            "about_work",
            "submitted_at",
        ]
        read_only_fields = ["id", "submitted_at"]

class ApprovedArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistApplication
        fields = ["artist_name", "category", "portfolio"]