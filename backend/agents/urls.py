from django.urls import path
from .views import AgentListView, call_agent

urlpatterns = [
    path('', AgentListView.as_view(), name='agent-list'),  # GET all agents
    path('<int:agent_id>/call/', call_agent, name='call-agent'),  # POST to call agent
]
