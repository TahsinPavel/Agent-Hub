from .bytez_agents.text_agent import BytezTextAgent, BytezCodeAgent
from .bytez_agents.image_agent import BytezImageAgent
from .bytez_agents.audio_agent import BytezAudioAgent

class AgentFactory:
    """Factory to create agent instances"""
    
    AGENTS = {
        'writer': BytezTextAgent,
        'code-assistant': BytezCodeAgent,
        'image-generator': BytezImageAgent,
        'voice-assistant': BytezAudioAgent,
        'chat-bot': BytezTextAgent,
        'translator': BytezTextAgent,
    }
    
    @classmethod
    def create_agent(cls, agent_name: str):
        agent_class = cls.AGENTS.get(agent_name)
        if not agent_class:
            raise ValueError(f"Unknown agent: {agent_name}")
        return agent_class()
    
    @classmethod
    def get_available_agents(cls):
        return list(cls.AGENTS.keys())
    
    @classmethod
    def get_agent_info(cls, agent_name: str):
        """Get agent information"""
        agent_info = {
            'writer': {
                'name': 'Writer Agent',
                'description': 'AI agent specialized in creative writing and content creation',
                'category': '✍️ Writing',
                'example_payload': {
                    'prompt': 'Write a short story about...',
                    'max_tokens': 500,
                    'temperature': 0.8
                }
            },
            'code-assistant': {
                'name': 'Code Assistant',
                'description': 'AI agent for code generation, debugging, and programming help',
                'category': '💻 Developer',
                'example_payload': {
                    'task': 'Create a function that...',
                    'language': 'python',
                    'max_tokens': 1000
                }
            },
            'image-generator': {
                'name': 'Image Generator',
                'description': 'Create stunning AI-generated images and artwork',
                'category': '🎨 Images',
                'example_payload': {
                    'prompt': 'A beautiful landscape...',
                    'size': '1024x1024',
                    'quality': 'standard'
                }
            },
            'voice-assistant': {
                'name': 'Voice Assistant',
                'description': 'Text-to-speech and speech processing capabilities',
                'category': '🎤 Audio',
                'example_payload': {
                    'task_type': 'text_to_speech',
                    'text': 'Hello, this is a test...',
                    'voice': 'alloy'
                }
            },
            'chat-bot': {
                'name': 'Chat Bot',
                'description': 'Conversational AI for interactive discussions',
                'category': '💬 Chat',
                'example_payload': {
                    'prompt': 'Tell me about...',
                    'system_message': 'You are a helpful assistant'
                }
            },
            'translator': {
                'name': 'Translator',
                'description': 'Multi-language translation and localization',
                'category': '🌍 Translation',
                'example_payload': {
                    'prompt': 'Translate to French: Hello world',
                    'system_message': 'You are a professional translator'
                }
            }
        }
        return agent_info.get(agent_name, {})
