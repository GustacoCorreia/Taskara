from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all() 
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated] # 🔴 Apenas usuários autenticados podem acessar

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user) # 🔴 Filtra apenas as tarefas do usuário logado

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) # 🔴 Define o usuário dono da tarefa



