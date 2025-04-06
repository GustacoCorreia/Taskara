from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    is_note = models.BooleanField(default=False)  # <-- Novo campo
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title or "Anotação sem título"

