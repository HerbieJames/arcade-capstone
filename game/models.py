from django.db import models
from django.contrib.auth.models import User

STATUS = ((0, "In Progress"), (1, "Installed"))

# Create your models here.
class Game(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    slug = models.SlugField(max_length=200, unique=True)
    created_on = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(choices=STATUS, default=0)