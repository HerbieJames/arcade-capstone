from . import views
from django.urls import path, include


urlpatterns = [
    path('', views.GameList, name="home"),
    path("accounts/", include("allauth.urls")),
    path('snake/', views.SnakeMachine, name='snake'),
    path('frogger/', views.FroggerMachine, name='frogger'),
    path('frogger/edit_score/<int:score_id>', views.score_edit, name='score_edit'),
    path('frogger/delete_score/<int:score_id>', views.score_delete, name='score_delete'),
    path('snake/edit_score/<int:score_id>', views.score_edit, name='score_edit'),
    path('snake/delete_score/<int:score_id>', views.score_delete, name='score_delete'),
]