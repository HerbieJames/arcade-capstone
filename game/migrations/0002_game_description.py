# Generated by Django 4.2.16 on 2024-11-22 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]