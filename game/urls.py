from . import views
from django.urls import path


urlpatterns = [
    path('', views.GameList.as_view(), name="home"),
    path('snake/', views.SnakeMachine.as_view(), name='snake'),
    path('frogger/', views.FroggerMachine.as_view(), name='frogger'),
]