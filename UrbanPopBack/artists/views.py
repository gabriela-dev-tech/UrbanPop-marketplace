from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import ArtistApplication
from .serializers import ArtistApplicationSerializer, ApprovedArtistSerializer


class ArtistApplicationCreateView(generics.CreateAPIView):
    queryset = ArtistApplication.objects.all()
    serializer_class = ArtistApplicationSerializer
    permission_classes = [AllowAny]


class ApprovedArtistListView(generics.ListAPIView):
    queryset = ArtistApplication.objects.filter(
        status="approved"
    ).order_by("artist_name")
    serializer_class = ApprovedArtistSerializer
    permission_classes = [AllowAny]