from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        is_note = self.request.query_params.get('is_note')
        if is_note is not None:
            queryset = queryset.filter(is_note=is_note.lower() in ['true', '1'])
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




