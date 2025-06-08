from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
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

    # ✅ Endpoint corrigido: /api/tasks/<id>/set_daily/
    @action(detail=True, methods=['post'], url_path='set_daily')
    def mark_focus_of_day(self, request, pk=None):
        try:
            task = self.get_object()
            if task.user != request.user:
                return Response({'error': 'Você não tem permissão para essa tarefa.'}, status=status.HTTP_403_FORBIDDEN)

            # Remove o foco anterior
            Task.objects.filter(user=request.user, is_focus_of_day=True).update(is_focus_of_day=False)

            # Marca a tarefa atual
            task.is_focus_of_day = True
            task.save()

            return Response({'message': 'Tarefa marcada como foco do dia com sucesso!'}, status=status.HTTP_200_OK)

        except Task.DoesNotExist:
            return Response({'error': 'Tarefa não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

# ✅ View de perfil do usuário autenticado
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
