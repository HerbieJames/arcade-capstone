from . import views
from django.urls import path, include


urlpatterns = [
    path('', views.GameList.as_view(), name="home"),
    path("accounts/", include("allauth.urls")),
    path('snake/', views.SnakeMachine.as_view(), name='snake'),
    path('frogger/', views.FroggerMachine.as_view(), name='frogger'),
]