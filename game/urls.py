from . import views
from django.urls import path


urlpatterns = [
    path('', views.index, name="home"),
    path('snake/', views.SnakeMachine.as_view(), name='snake'),
]