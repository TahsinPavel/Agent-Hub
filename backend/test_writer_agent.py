import requests
import json

# Test the writer agent
url = "http://localhost:8000/api/agents/writer/call/"
payload = {
    "prompt": "Write one short sentence about AI.",
    "max_tokens": 50,  # Very small token limit
    "temperature": 0.7,
    "system_message": "You are a helpful assistant. Write one very short sentence."
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")