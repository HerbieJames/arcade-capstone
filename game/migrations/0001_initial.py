# Generated by Django 4.2.16 on 2024-11-25 10:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Score',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game', models.IntegerField(choices=[(0, 'Frogger'), (1, 'Snake')], default=0)),
                ('alias', models.CharField(max_length=6)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('value', models.CharField(max_length=6)),
                ('player', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='personal_scores', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
