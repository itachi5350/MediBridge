from fastapi import APIRouter
from services.prompt_engine import analyze_symptoms

router = APIRouter()

@router.post("/analyze")
def analyze(payload: dict):
    text = payload.get("text", "").strip()
    language = payload.get("language", "hindi")

    if not text:
        return {"error": "No text provided"}

    if len(text) > 500:
        return {"error": "Input too long. Please keep it under 500 characters."}

    try:
        result = analyze_symptoms(text, language)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}