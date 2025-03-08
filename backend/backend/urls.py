from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token  # Importa a view para autenticação

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),  # Inclui as URLs da sua aplicação de tarefas
    path('api-auth/', include('rest_framework.urls')),  # Permite login pelo navegador Django Rest Framework
    path('api/token/', obtain_auth_token, name='api_token_auth'),  # Endpoint para autenticação por token
]

