from django.urls import path
from . import views

urlpatterns = [
    path('', views.AgentListView.as_view(), name='agent-list'),
    path('<str:agent_name>/call/', views.call_agent, name='call-agent'),
    path('<str:agent_name>/details/', views.get_agent_details, name='agent-details'),
]
