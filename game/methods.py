from django.contrib.auth.models import User
from .models import Score, GAME


def clearScore(request, score):  # runs on any form submission - to remove redundant data
    for e in GAME:               # executes for each game
        gameIndex = e[0]
        if request.user.is_authenticated:  # target to remove user's worst (undisplayed) scores
            queryset = Score.objects.order_by("value").filter(player=request.user).filter(game=gameIndex)
        else:                              # target to remove worst (undisplayed) guest scores
            queryset = Score.objects.order_by("value").filter(player__isnull=True).filter(game=gameIndex)
        if queryset.count() - 7 > 0:
            all_but_top_seven = Score.objects.order_by("value")[:(queryset.count()-7)]
            for score in all_but_top_seven:
                score.delete()     