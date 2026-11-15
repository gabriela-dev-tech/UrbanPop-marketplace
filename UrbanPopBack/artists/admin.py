from django.contrib import admin
from .models import ArtistApplication


@admin.register(ArtistApplication)
class ArtistApplicationAdmin(admin.ModelAdmin):
    list_display = ("artist_name", "email", "category", "status","submitted_at")
    search_fields = ("artist_name", "email", "category")
    list_filter = ("status", "category")


