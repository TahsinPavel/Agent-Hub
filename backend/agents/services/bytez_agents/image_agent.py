from ..base_agent import BaseAgent
from typing import Dict, Any
from django.conf import settings

class BytezImageAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            api_key=getattr(settings, 'BYTEZ_API_KEY', ''),
            base_url="https://api.bytez.com/v1"
        )
    
    def process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process image generation request"""
        error = self.validate_payload(payload, ['prompt'])
        if error:
            return {"error": error}
        
        prompt = payload.get('prompt', '')
        model = payload.get('model', 'dall-e-3')
        size = payload.get('size', '1024x1024')
        quality = payload.get('quality', 'standard')
        style = payload.get('style', 'vivid')
        
        data = {
            'model': model,
            'prompt': prompt,
            'n': payload.get('n', 1),
            'size': size,
            'quality': quality,
            'style': style
        }
        
        result = self._make_request('images/generations', data)
        
        if 'data' in result and len(result['data']) > 0:
            return {
                'success': True,
                'images': [img['url'] for img in result['data']],
                'prompt': prompt,
                'model': model,
                'size': size
            }
        else:
            return result
    
    def edit_image(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Edit an existing image"""
        error = self.validate_payload(payload, ['image', 'prompt'])
        if error:
            return {"error": error}
        
        data = {
            'image': payload['image'],
            'mask': payload.get('mask'),
            'prompt': payload['prompt'],
            'n': payload.get('n', 1),
            'size': payload.get('size', '1024x1024')
        }
        
        result = self._make_request('images/edits', data)
        
        if 'data' in result and len(result['data']) > 0:
            return {
                'success': True,
                'images': [img['url'] for img in result['data']],
                'prompt': payload['prompt']
            }
        else:
            return result