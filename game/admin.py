from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin
from .models import Score

@admin.register(Score)
class ScoreAdmin(SummernoteModelAdmin):

    list_display = ('game', 'player', 'alias', 'created_on', 'value')
    search_fields = ['alias', 'value']
    list_filter = ('game', 'created_on')