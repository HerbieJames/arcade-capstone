from django.shortcuts import render
from django.views import generic
from .models import Score
from django.http import HttpResponse

# Create your views here.
"""
def machine(request):
    return HttpResponse("<h1>G A M E - M A C H I N E</h1>")
"""

def index(request):
    return HttpResponse("<p style='color: blue; text-align: center;'>index</p>")

class SnakeMachine(generic.ListView):
    queryset = Score.objects.filter(game=1).order_by("-value")
    template_name = "score_list.html"