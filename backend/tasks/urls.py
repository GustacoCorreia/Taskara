from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import TaskViewSet
from .auth_views import RegisterView, ProfileView, ChangePasswordView  # ✅ Adicionado ChangePasswordView

# Criando as rotas para as tarefas
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),  # Rotas das tarefas

    # Rotas de autenticação
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Rota para registro de usuários
    path('api/register/', RegisterView.as_view(), name='register'),

    # ✅ Rota para buscar dados do usuário logado
    path('profile/', ProfileView.as_view(), name='user_profile'),

    # ✅ Nova rota para alterar a senha
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
