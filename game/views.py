from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def machine(request):
    return HttpResponse("<h1>G A M E - M A C H I N E</h1>")