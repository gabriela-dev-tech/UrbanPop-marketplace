from django.urls import path
from .views import ArtistApplicationCreateView, ApprovedArtistListView

urlpatterns = [
    path(
        "applications/",
        ArtistApplicationCreateView.as_view(),
        name="artist-application-create",
    ),
    path(
        "approved/",
        ApprovedArtistListView.as_view(),
        name="approved-artists",
    ),
]