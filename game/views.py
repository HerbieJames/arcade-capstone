from django.shortcuts import render
from django.views import generic
from django.contrib.auth.models import User
from django.http import HttpResponse
from .models import Score
from .forms import ScoreForm


# Create your views here.

def GameList(request):
    queryset = Score.objects.order_by("-value").filter(player=request.user)
    my_snake = queryset.filter(game=1)
    my_frogger = queryset.filter(game=0)
    return render(
        request,
        "game/index.html",
        {
            "my_snake" : my_snake,
            "my_frogger" : my_frogger
        },
    )

def SnakeMachine(request):
    queryset = Score.objects.filter(game=1).order_by("-value")
    my_scores = Score.objects.filter(game=1).filter(player=request.user).order_by("-value")

    if request.method == "POST":
        score_form = ScoreForm(data=request.POST)
        if score_form.is_valid():
            score = score_form.save(commit=False)
            score.game = 1
            score.player = request.user
            score.save()
    
    score_form = ScoreForm()
    
    return render(
        request,
        "game/snake.html",
        {
            "scores": queryset,
            "my_scores": my_scores,
            "score_form": score_form
        },
    )

def FroggerMachine(request):
    queryset = Score.objects.filter(game=0).order_by("-value")
    my_scores = Score.objects.filter(game=0).filter(player=request.user).order_by("-value")
    return render(
        request,
        "game/frogger.html",
        {
            "scores": queryset,
            "my_scores": my_scores
        },
    )