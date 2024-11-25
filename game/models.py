from django.db import models
from django.contrib.auth.models import User

GAME = ((0, "Frogger"), (1, "Snake"))

# Create your models here.
class Score(models.Model):
    game        = models.IntegerField(choices=GAME, default=0)
    player      = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="personal_scores", null=True, blank=True
    )
    alias       = models.CharField(max_length=6)
    created_on  = models.DateTimeField(auto_now_add=True)
    value       = models.CharField(max_length=6)
