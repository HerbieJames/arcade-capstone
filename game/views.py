from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from .models import Score, GAME
from .forms import ScoreForm

def clearScore(request, score): # runs on any form submission - to remove redundant data
    score.save()
    for e in GAME:              # executes for each game
        gameIndex = e[0]
        if request.user.is_authenticated:  ## target to remove user's worst (undisplayed) scores
            queryset = Score.objects.order_by("value").filter(player=request.user).filter(game=gameIndex)
        else:                              ## target to remove worst (undisplayed) guest scores
            queryset = Score.objects.order_by("value").filter(player__isnull=True).filter(game=gameIndex)
        if queryset.count() - 7 > 0:
            all_but_top_seven = Score.objects.order_by("value")[:(queryset.count()-7)]
            for score in all_but_top_seven:
                score.delete()

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
        clearScore(request, score)
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
    if request.user.is_authenticated:
        my_scores = Score.objects.filter(player=request.user).filter(game=0).order_by("-value")
    else:
        my_scores = Score.objects.filter(game=-1)

    if request.method == "POST":
        score_form = ScoreForm(data=request.POST)
        if score_form.is_valid():
            score = score_form.save(commit=False)
            score.game = 0
            if request.user.is_authenticated:
                score.player = request.user
        clearScore(request, score)
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
