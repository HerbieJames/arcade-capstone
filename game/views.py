from django.shortcuts import render
from django.views import generic
from .models import Score
from django.http import HttpResponse

# Create your views here.
class GameList(generic.ListView):
    queryset = Score.objects.all()
    template_name = "game/index.html" # NOT WORKING

class SnakeMachine(generic.ListView):
    queryset = Score.objects.filter(game=1).order_by("-value")
    template_name = "game/snake.html"
    paginate_by = 12