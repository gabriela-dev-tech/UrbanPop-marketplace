from django.db import models

# Create your models here.
class ArtistApplication(models.Model):
    artist_name = models.CharField(max_length=120)
    email = models.EmailField()
    category = models.CharField(max_length=80)
    portfolio = models.URLField(blank=True)
    about_work = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("declined", "Declined"),
    ]

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="pending",
    )

    def __str__(self):
        return f"{self.artist_name} - {self.category}"