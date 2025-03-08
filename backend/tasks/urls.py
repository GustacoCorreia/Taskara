from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import TaskViewSet  # Importa TaskViewSet corretamente
from .auth_views import RegisterView  # Importa RegisterView do novo arquivo

# Criando as rotas para as tarefas
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')  # 🔹 Adicionando basename para evitar erro

urlpatterns = [
    path('', include(router.urls)),  # Mantendo as rotas das tarefas

    # Rotas de autenticação
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Rota para registro de usuários
    path('api/register/', RegisterView.as_view(), name='register'),
]
