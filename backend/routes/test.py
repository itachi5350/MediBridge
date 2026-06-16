from fastapi import APIRouter
from services.gemini_service import call_gemini

router = APIRouter()

@router.post("/test-pipe")
def test_pipe(payload: dict):
    text = payload.get("text", "")
    if not text:
        return {"error": "No text provided"}
    response = call_gemini(f"Reply briefly to: {text}")
    return {"input": text, "response": response}