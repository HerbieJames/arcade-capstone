# Generated by Django 4.2.16 on 2024-12-06 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='alias',
            field=models.CharField(default='AAAAAA', max_length=6),
        ),
    ]