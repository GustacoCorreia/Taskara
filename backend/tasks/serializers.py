from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'completed',
            'is_note',
            'is_focus',
            'priority',
            'created_at',       # ✅ necessário para o cálculo de vencimento
            'is_overdue'
        ]

    def get_is_overdue(self, obj):
        return obj.is_overdue()

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data.pop('user', None)
        return Task.objects.create(user=user, **validated_data)
