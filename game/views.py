from django.shortcuts import render
from django.views import generic
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from .models import Score
from .forms import ScoreForm


# Create your views here.

def GameList(request):
    if request.user.is_authenticated:
        queryset = Score.objects.filter(player=request.user).order_by("-value")
    else:
        queryset = Score.objects.order_by("-value")
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
    if request.user.is_authenticated:
        my_scores = Score.objects.filter(player=request.user).filter(game=1).order_by("-value")
    else:
        my_scores = Score.objects.filter(game=-1)
        
    if request.method == "POST":
        score_form = ScoreForm(data=request.POST)
        if score_form.is_valid():
            score = score_form.save(commit=False)
            score.game = 1
            if request.user.is_authenticated:
                score.player = request.user
            score.save()
            return HttpResponseRedirect("./")
    
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
    my_scores = Score.objects.filter(game=0).order_by("-value") ##

    if request.method == "POST":
        score_form = ScoreForm(data=request.POST)
        if score_form.is_valid():
            score = score_form.save(commit=False)
            score.game = 0
            ## score.player = request.user
            score.save()
            return HttpResponseRedirect("./")
    
    score_form = ScoreForm()
    
    return render(
        request,
        "game/frogger.html",
        {
            "scores": queryset,
            "my_scores": my_scores,
            "score_form": score_form
        },
    )
