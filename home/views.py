from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def index(request):
    return HttpResponse("<i style='color: blue; text-align: center;'>home</i>")