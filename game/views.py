from django.shortcuts import render
from django.views import generic
from .models import Score
from django.http import HttpResponse

# Create your views here.
def index(request):
    return HttpResponse("<p style='color: blue; text-align: center;'>index</p>")

class SnakeMachine(generic.ListView):
    queryset = Score.objects.filter(game=1).order_by("-value")
    template_name = "score_list.html"