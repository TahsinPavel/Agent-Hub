import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Get the API key
BYTEZ_API_KEY = os.getenv('BYTEZ_API_KEY', 'your-bytez-api-key-here')

print(f"BYTEZ_API_KEY: {BYTEZ_API_KEY}")

# Test if Bytez SDK is available
try:
    from bytez import Bytez
    print("Bytez SDK is available")
    
    # Test initialization
    if BYTEZ_API_KEY and BYTEZ_API_KEY != 'your-bytez-api-key-here':
        client = Bytez(BYTEZ_API_KEY)
        print("Bytez client initialized successfully")
        
        # Use the same model as in the text agent
        model_name = 'google/gemma-2b'
        try:
            print(f"\nTesting model: {model_name}")
            model = client.model(model_name)
            print(f"Model {model_name} loaded successfully")
            
            # Try with correct parameter names
            prompt = "You are a helpful assistant. Provide direct, concise responses.\n\nUser: Hello, this is a test."
            
            result = model.run(prompt, {
                "max_new_tokens": 100,
                "temperature": 0.7
            })
            
            print(f"Test result: {result}")
            if not result.error:
                print(f"SUCCESS: Model {model_name} works!")
                print(f"Output: {result.output}")
            else:
                print(f"Error with model {model_name}: {result.error}")
                if "concurrency" in str(result.error).lower():
                    print("This is a rate limiting issue. The free plan has concurrency limits.")
                    print("Try again later or consider upgrading your Bytez account.")
                
        except Exception as e:
            print(f"Error testing model {model_name}: {e}")
    else:
        print("BYTEZ_API_KEY not configured properly")
        
except ImportError:
    print("Bytez SDK not installed. Run: pip install bytez")
except Exception as e:
    print(f"Error initializing Bytez: {e}")