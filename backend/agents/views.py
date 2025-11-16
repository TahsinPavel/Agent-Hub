import requests
import json
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views import View
from .models import Agent

# List all agents (for GET /api/agents/)
class AgentListView(View):
    def get(self, request):
        # For now, return hardcoded agents including your writer agent
        # Later you can store these in the database if needed
        agents = [
            {
                'id': 1,
                'name': 'Writer Agent',
                'description': 'An AI agent specialized in creative writing, content creation, and text generation. Perfect for blogs, stories, and marketing copy.',
                'category': '✍️ Writing',
                'price': 9.99,
                'rating': 4.8,
                'downloads': 1250,
                'icon': '✍️',
                'created_at': '2024-01-01T00:00:00Z'
            },
            {
                'id': 2,
                'name': 'Code Assistant',
                'description': 'A programming assistant that helps with code review, debugging, and development across multiple languages.',
                'category': '💻 Developer',
                'price': 14.99,
                'rating': 4.9,
                'downloads': 2100,
                'icon': '💻',
                'created_at': '2024-01-02T00:00:00Z'
            },
            {
                'id': 3,
                'name': 'Data Analyst',
                'description': 'An AI agent that analyzes data, creates reports, and provides actionable business insights.',
                'category': '📈 Marketing',
                'price': 19.99,
                'rating': 4.7,
                'downloads': 890,
                'icon': '📊',
                'created_at': '2024-01-03T00:00:00Z'
            },
            {
                'id': 4,
                'name': 'Image Generator',
                'description': 'Create stunning AI-generated images, artwork, and visual content for any project.',
                'category': '🎨 Images',
                'price': 12.99,
                'rating': 4.6,
                'downloads': 1800,
                'icon': '🎨',
                'created_at': '2024-01-04T00:00:00Z'
            },
            {
                'id': 5,
                'name': 'Task Automator',
                'description': 'Automate repetitive tasks and workflows to boost your productivity and efficiency.',
                'category': '⚡ Productivity',
                'price': 16.99,
                'rating': 4.5,
                'downloads': 1500,
                'icon': '⚡',
                'created_at': '2024-01-05T00:00:00Z'
            }
        ]
        
        print(f"Backend returning {len(agents)} agents")
        return JsonResponse(agents, safe=False)

# Call a single agent (POST /api/agents/<id>/call/)
@csrf_exempt
@require_POST
def call_agent(request, agent_name):
    try:
        request_data = json.loads(request.body) if request.body else {}
        
        # Map agent names to their actual endpoints
        agent_endpoints = {
            'writer': 'http://localhost:8001/generate-text/',
            # Add more agents here as needed
        }
        
        if agent_name not in agent_endpoints:
            return JsonResponse({
                "error": f"Unknown agent: {agent_name}"
            }, status=404)
        
        agent_url = agent_endpoints[agent_name]
        
        response = requests.post(
            agent_url,
            json=request_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            return JsonResponse(response.json())
        else:
            return JsonResponse({
                "error": f"Agent service returned status {response.status_code}",
                "details": response.text
            }, status=response.status_code)
            
    except requests.exceptions.ConnectionError:
        return JsonResponse({
            "error": "Could not connect to agent service",
            "message": "Make sure the agent service is running on port 8001"
        }, status=503)
    except Exception as e:
        return JsonResponse({
            "error": "Internal server error", 
            "message": str(e)
        }, status=500)
