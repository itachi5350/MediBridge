from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set in .env")
    return genai.Client(api_key=api_key)

def ping_gemini():
    try:
        client = get_client()
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents="Say ok"
        )
        return bool(response.text)
    except Exception as e:
        print(f"Gemini error: {e}")
        return False

def call_gemini(prompt: str) -> str:
    client = get_client()
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )
    return response.text