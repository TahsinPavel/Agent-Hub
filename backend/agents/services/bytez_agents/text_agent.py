from ..base_agent import BaseAgent
from typing import Dict, Any
from django.conf import settings
import logging
import re
from functools import wraps
import time

try:
    from bytez import Bytez
    BYTEZ_AVAILABLE = True
except ImportError:
    BYTEZ_AVAILABLE = False

logger = logging.getLogger(__name__)

class BytezTextAgent(BaseAgent):
    def __init__(self):
        api_key = getattr(settings, 'BYTEZ_API_KEY', '')
        super().__init__(
            api_key=api_key,
            base_url="https://api.bytez.com"
        )
        
        if not BYTEZ_AVAILABLE:
            logger.error("Bytez SDK not installed. Run: pip install bytez")
        elif not api_key:
            logger.warning("BYTEZ_API_KEY not found, check your .env file")
        else:
            self.sdk = Bytez(api_key)
    
    def _clean_output(self, text: str) -> str:
        """Remove <think> tags and clean up the output"""
        if not text:
            return ""
        
        # Remove <think>...</think> blocks completely
        cleaned = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
        # Also remove incomplete <think> tags at the end
        cleaned = re.sub(r'<think>.*$', '', cleaned, flags=re.DOTALL)
        
        return cleaned.strip()
    
    def process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process text generation request using Bytez SDK"""
        # Validate required fields
        error = self.validate_payload(payload, ['prompt'])
        if error:
            return {"error": error}
        
        # Check if SDK is available and configured
        if not BYTEZ_AVAILABLE:
            return {"error": "Bytez SDK not installed. Please run: pip install bytez"}
        
        if not self.api_key:
            return {"error": "Bytez API key not configured. Please check your environment variables."}
        
        try:
            # Use a model that works with free tier
            model_name = payload.get('model', 'google/gemma-2b')  # Free model
            model = self.sdk.model(model_name)
            
            # Format messages properly with better system message
            prompt = payload.get('prompt', '')
            system_message = payload.get('system_message', 'You are a helpful assistant. Provide direct, concise responses without using thinking tags or internal monologue. Just give the final answer.')
            
            # Simplified format for models that don't support complex chat templates
            full_prompt = f"{system_message}\n\nUser: {prompt}"
            
            # Add parameters to optimize for speed
            # Reduce max_tokens for faster responses
            max_tokens = min(payload.get('max_tokens', 500), 1000)  # Cap at 1000 tokens
            
            # Make the request with optimized parameters (without timeout)
            result = model.run(full_prompt, {
                "max_new_tokens": max_tokens,
                "temperature": payload.get('temperature', 0.7)
            })
            
            # Handle response
            if result.error:
                return {"error": result.error}
            elif result.output and isinstance(result.output, dict) and 'content' in result.output:
                raw_output = result.output['content']
                cleaned_output = self._clean_output(raw_output)
                return {
                    "success": True,
                    "output": cleaned_output,
                    "response": cleaned_output,  # For frontend compatibility
                    "content": cleaned_output,   # For frontend compatibility
                    "model": model_name,
                    "provider": "Bytez"
                }
            elif result.output:
                raw_output = str(result.output)
                cleaned_output = self._clean_output(raw_output)
                return {
                    "success": True,
                    "output": cleaned_output,
                    "response": cleaned_output,
                    "content": cleaned_output,
                    "model": model_name,
                    "provider": "Bytez"
                }
            else:
                return {"error": "No output received from model"}
                
        except Exception as e:
            logger.error(f"Bytez API error: {str(e)}")
            return {"error": f"Bytez API error: {str(e)}"}

class BytezCodeAgent(BaseAgent):
    def __init__(self):
        api_key = getattr(settings, 'BYTEZ_API_KEY', '')
        super().__init__(
            api_key=api_key,
            base_url="https://api.bytez.com"
        )
        
        if not BYTEZ_AVAILABLE:
            logger.error("Bytez SDK not installed. Run: pip install bytez")
        elif not api_key:
            logger.warning("BYTEZ_API_KEY not found, check your .env file")
        else:
            self.sdk = Bytez(api_key)
    
    def _clean_output(self, text: str) -> str:
        """Remove <think> tags and clean up the output"""
        if not text:
            return ""
        
        # Remove <think>...</think> blocks completely
        cleaned = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
        # Also remove incomplete <think> tags at the end
        cleaned = re.sub(r'<think>.*$', '', cleaned, flags=re.DOTALL)
        
        return cleaned.strip()
    
    def process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process code generation request using Bytez SDK"""
        error = self.validate_payload(payload, ['task'])
        if error:
            return {"error": error}
        
        if not BYTEZ_AVAILABLE:
            return {"error": "Bytez SDK not installed. Please run: pip install bytez"}
        
        if not self.api_key:
            return {"error": "Bytez API key not configured. Please check your environment variables."}
        
        try:
            # Use a model that works with free tier
            model_name = payload.get('model', 'google/gemma-2b')  # Free model
            model = self.sdk.model(model_name)
            
            # Format code generation prompt
            task = payload.get('task', '')
            language = payload.get('language', 'python')
            
            # Simplified format for models that don't support complex chat templates
            full_prompt = f"You are a helpful coding assistant. Generate clean {language} code without explanations or thinking process. Just provide the code directly. Keep responses concise and efficient.\n\nTask: {task}"
            
            # Add parameters to optimize for speed
            # Reduce max_tokens for faster responses
            max_tokens = min(payload.get('max_tokens', 1000), 2000)  # Cap at 2000 tokens
            
            # Make the request with optimized parameters (without timeout)
            result = model.run(full_prompt, {
                "max_new_tokens": max_tokens,
                "temperature": payload.get('temperature', 0.1)  # Lower temperature for code
            })
            
            # Handle response
            if result.error:
                return {"error": result.error}
            elif result.output and isinstance(result.output, dict) and 'content' in result.output:
                cleaned_code = self._clean_output(result.output['content'])
                return {
                    "success": True,
                    "code": cleaned_code,
                    "output": cleaned_code,  # For frontend compatibility
                    "response": cleaned_code,
                    "language": language,
                    "model": model_name,
                    "provider": "Bytez"
                }
            elif result.output:
                cleaned_code = self._clean_output(str(result.output))
                return {
                    "success": True,
                    "code": cleaned_code,
                    "output": cleaned_code,
                    "response": cleaned_code,
                    "language": language,
                    "model": model_name,
                    "provider": "Bytez"
                }
            else:
                return {"error": "No output received from model"}
                
        except Exception as e:
            logger.error(f"Bytez API error: {str(e)}")
            return {"error": f"Bytez API error: {str(e)}"}






