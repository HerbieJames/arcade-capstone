from .models import Score
from django import forms


class ScoreForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):  # Prohibts manual change of "value" field
        super(ScoreForm, self).__init__(*args, **kwargs)
        instance = getattr(self, 'instance', None)
        if instance and instance.pk:
            self.fields['value'].widget.attrs['readonly'] = True

    class Meta:
        model = Score
        fields = ('value', 'alias',)

