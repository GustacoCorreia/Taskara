from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'is_note']  # adicionamos 'is_note'

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data.pop('user', None)  
        return Task.objects.create(user=user, **validated_data)
