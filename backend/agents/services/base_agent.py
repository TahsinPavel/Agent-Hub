from abc import ABC, abstractmethod
import requests
from typing import Dict, Any, Optional
import logging
import time

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = self._get_headers()
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
    
    @abstractmethod
    def process(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process the request and return response"""
        pass
    
    def _make_request(self, endpoint: str, data: Dict[str, Any], method: str = 'POST', timeout: int = 30) -> Dict[str, Any]:
        """Common request method with timeout"""
        try:
            url = f"{self.base_url}/{endpoint}"
            logger.info(f"Making {method} request to {url}")
            
            if method.upper() == 'POST':
                response = requests.post(url, json=data, headers=self.headers, timeout=timeout)
            elif method.upper() == 'GET':
                response = requests.get(url, params=data, headers=self.headers, timeout=timeout)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.Timeout:
            return {"error": "Request timeout. Please try again with a smaller request."}
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {str(e)}")
            return {"error": f"Request failed: {str(e)}"}
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return {"error": f"Unexpected error: {str(e)}"}

    def validate_payload(self, payload: Dict[str, Any], required_fields: list) -> Optional[str]:
        """Validate required fields in payload"""
        for field in required_fields:
            if field not in payload or not payload[field]:
                return f"Missing required field: {field}"
        return None