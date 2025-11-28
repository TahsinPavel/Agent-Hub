from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views import View
import json
import requests
from .services import AgentFactory

# List all agents (for GET /api/agents/)
class AgentListView(View):
    def get(self, request):
        # Get available agents from factory
        available_agents = AgentFactory.get_available_agents()
        
        agents = []
        for agent_name in available_agents:
            agent_info = AgentFactory.get_agent_info(agent_name)
            if agent_info:
                agents.append({
                    'id': agent_name,
                    'name': agent_info['name'],
                    'description': agent_info['description'],
                    'category': agent_info['category'],
                    'models': agent_info.get('models', []),
                    'price': 9.99,  # You can make this dynamic
                    'rating': 4.8,
                    'downloads': 1250,
                    'icon': agent_info['category'].split()[0],
                    'created_at': '2024-01-01T00:00:00Z'
                })
        
        print(f"Backend returning {len(agents)} agents")
        return JsonResponse(agents, safe=False)

# Call a single agent (POST /api/agents/<id>/call/)
@csrf_exempt
@require_POST
def call_agent(request, agent_name):
    try:
        request_data = json.loads(request.body) if request.body else {}
        
        # Use the agent factory
        agent = AgentFactory.create_agent(agent_name)
        result = agent.process(request_data)
        
        # Check if there's an error in the result and provide better feedback
        if isinstance(result, dict) and result.get('error'):
            error_msg = result['error']
            if 'concurrency' in error_msg.lower():
                return JsonResponse({
                    "error": "Rate limit exceeded",
                    "message": "Too many requests. Please wait a moment and try again, or consider upgrading your Bytez account for higher rate limits."
                }, status=429)
            elif 'upgrade' in error_msg.lower():
                return JsonResponse({
                    "error": "Model access restricted",
                    "message": "This model requires a paid Bytez account. Please upgrade your account or try a different model."
                }, status=402)
            elif 'fetch failed' in error_msg.lower():
                return JsonResponse({
                    "error": "API connection error",
                    "message": "Unable to connect to the AI service. Please try again later."
                }, status=502)
        
        return JsonResponse(result)
        
    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=404)
    except requests.exceptions.Timeout:
        return JsonResponse({
            "error": "Request timeout", 
            "message": "The AI model is taking too long to respond. Please try again with a simpler request."
        }, status=408)
    except Exception as e:
        print(f"Error calling agent {agent_name}: {str(e)}")
        return JsonResponse({
            "error": "Internal server error", 
            "message": str(e)
        }, status=500)

# Get agent details
@csrf_exempt
def get_agent_details(request, agent_name):
    try:
        agent_info = AgentFactory.get_agent_info(agent_name)
        if not agent_info:
            return JsonResponse({"error": "Agent not found"}, status=404)
        
        return JsonResponse({
            'id': agent_name,
            'name': agent_info['name'],
            'description': agent_info['description'],
            'category': agent_info['category'],
            'models': agent_info.get('models', []),
            'capabilities': agent_info.get('capabilities', []),
            'pricing': agent_info.get('pricing', {}),
        })
        
    except Exception as e:
        return JsonResponse({
            "error": "Internal server error", 
            "message": str(e)
        }, status=500)
