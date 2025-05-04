from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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

# ✅ Nova view para retornar dados do usuário autenticado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    })

