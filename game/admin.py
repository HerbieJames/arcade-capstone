from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin
from .models import Score

@admin.register(Score)
class ScoreAdmin(SummernoteModelAdmin):

    list_display = ('game', 'player', 'alias', 'value')
    search_fields = ['alias']
    list_filter = ('game',)