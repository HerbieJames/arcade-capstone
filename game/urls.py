from . import views
from django.urls import path, include


urlpatterns = [
    path('', views.GameList, name="home"),
    path("accounts/", include("allauth.urls")),
    path('snake/', views.SnakeMachine, name='snake'),
    path('frogger/', views.FroggerMachine, name='frogger'),
]