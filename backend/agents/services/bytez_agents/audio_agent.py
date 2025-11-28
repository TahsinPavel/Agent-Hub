from ..base_agent import BaseAgent
from typing import Dict, Any
from django.conf import settings
import base64

class BytezAudioAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            api_key=getattr(settings, 'BYTEZ_API_KEY', ''),
            base_url="https://api.bytez.com/v1"
        )
    
    def process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process audio request (TTS or STT)"""
        task_type = payload.get('task_type', 'text_to_speech')
        
        if task_type == 'text_to_speech':
            return self.text_to_speech(payload)
        elif task_type == 'speech_to_text':
            return self.speech_to_text(payload)
        else:
            return {"error": f"Unknown task type: {task_type}"}
    
    def text_to_speech(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Convert text to speech"""
        error = self.validate_payload(payload, ['text'])
        if error:
            return {"error": error}
        
        text = payload.get('text', '')
        voice = payload.get('voice', 'alloy')
        model = payload.get('model', 'tts-1')
        
        data = {
            'model': model,
            'input': text,
            'voice': voice,
            'response_format': payload.get('format', 'mp3'),
            'speed': payload.get('speed', 1.0)
        }
        
        result = self._make_request('audio/speech', data)
        
        if 'audio' in result:
            return {
                'success': True,
                'audio_url': result['audio'],
                'text': text,
                'voice': voice,
                'model': model
            }
        else:
            return result
    
    def speech_to_text(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Convert speech to text"""
        error = self.validate_payload(payload, ['audio'])
        if error:
            return {"error": error}
        
        audio_file = payload.get('audio', '')
        model = payload.get('model', 'whisper-1')
        language = payload.get('language', 'en')
        
        data = {
            'file': audio_file,
            'model': model,
            'language': language,
            'response_format': 'json',
            'temperature': payload.get('temperature', 0)
        }
        
        result = self._make_request('audio/transcriptions', data)
        
        if 'text' in result:
            return {
                'success': True,
                'text': result['text'],
                'language': language,
                'model': model
            }
        else:
            return result