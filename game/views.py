from django.shortcuts import render, get_object_or_404, reverse
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import HttpResponse, HttpResponseRedirect
from .models import Score, GAME
from .forms import ScoreForm
from .methods import clearScore

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

def score_edit(request, score_id):
    """
    view to edit scores
    """
    if request.method == "POST":

        queryset = Score.objects.order_by("-value")
        score = get_object_or_404(Score, pk=score_id)
        score_form = ScoreForm(data=request.POST, instance=score)

        if score_form.is_valid():
            score = score_form.save(commit=False)
            score.save()
            messages.add_message(request, messages.SUCCESS, 'Score Updated.')
        else:
            messages.add_message(request, messages.ERROR, 'Error updating score.')

    return HttpResponseRedirect("./")

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
            score.save()
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
