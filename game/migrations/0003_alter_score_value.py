# Generated by Django 4.2.16 on 2024-12-06 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_alter_score_alias'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='value',
            field=models.CharField(default='000000', max_length=6),
        ),
    ]