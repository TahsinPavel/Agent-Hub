from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views import View
from .models import Agent

# List all agents (for GET /api/agents/)
class AgentListView(View):
    def get(self, request):
        agents = list(Agent.objects.values('id', 'name', 'description'))
        return JsonResponse(agents, safe=False)

# Call a single agent (POST /api/agents/<id>/call/)
@csrf_exempt  # only for dev; remove in production and use CSRF token
@require_POST
def call_agent(request, agent_id):
    agent = get_object_or_404(Agent, id=agent_id)
    # Example processing logic
    # TODO: replace `None` with actual processing result
    return JsonResponse({"response": f"Agent {agent.id} would process: None"})
