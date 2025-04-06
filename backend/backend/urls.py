from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # JWT views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),  # Inclui as URLs da sua aplicação de tarefas

    # Autenticação JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),       # Para login (obter access e refresh)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),      # Para renovar access token
]


