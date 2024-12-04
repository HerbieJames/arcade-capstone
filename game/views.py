from django.shortcuts import render
from django.views import generic
from .models import Score
from django.http import HttpResponse

# Create your views here.
class GameList(generic.ListView):
    queryset = Score.objects.all().order_by("-value")
    template_name = "game/index.html"
    paginate_by = 1

class SnakeMachine(generic.ListView):
    queryset = Score.objects.filter(game=1).order_by("-value")
    template_name = "game/snake.html"
    paginate_by = 12

class FroggerMachine(generic.ListView):
    queryset = Score.objects.filter(game=0).order_by("-value")
    template_name = "game/frogger.html"
    paginate_by = 12