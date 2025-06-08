from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.utils import timezone; timezone.now()
from django.contrib.auth.models import User  # ✅ Importação do User

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('baixa', 'Baixa'),
        ('moderada', 'Moderada'),
        ('alta', 'Alta'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    is_note = models.BooleanField(default=False)
    is_focus = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='baixa')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def is_overdue(self):
        if self.completed:
            return False

        now = timezone.now()
        delta = {
            'baixa': timedelta(days=7),
            'moderada': timedelta(days=3),
            'alta': timedelta(seconds=10),
        }.get(self.priority, timedelta(days=7))

        return self.created_at + delta < now
