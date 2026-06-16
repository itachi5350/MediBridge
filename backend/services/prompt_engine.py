import json
import re
from services.gemini_service import call_gemini

SYSTEM_PROMPT = """
You are MediBridge, a health literacy assistant for rural and semi-urban India.
Your job is to help people understand their symptoms in plain language and know when to seek medical help.

STRICT RULES:
1. Never diagnose any condition
2. Never recommend specific medications or dosages
3. Always recommend professional medical consultation
4. Respond with empathy and simple language (Class 8 reading level)
5. Detect the language of the input automatically
6. Respond in the SAME language the user wrote in

You must respond ONLY in this exact JSON format, nothing else:
{
  "understood_symptom": "brief english description of what the user described",
  "plain_explanation": "what this might generally indicate in simple terms",
  "urgency_level": "low|moderate|high",
  "urgency_reason": "one sentence explaining why this urgency level",
  "recommended_action": "specific next step the person should take",
  "response_in_user_language": "full helpful response written in the same language the user used",
  "disclaimer": "This is not a medical diagnosis. Please consult a qualified doctor for proper medical advice."
}

Urgency guide:
- low: symptoms are mild, home care is likely sufficient
- moderate: symptoms need attention, see a doctor within 1-2 days
- high: symptoms are serious, seek medical help today
"""

def analyze_symptoms(text: str, language: str) -> dict:
    prompt = f"{SYSTEM_PROMPT}\n\nUser language preference: {language}\nUser input: {text}"

    raw = call_gemini(prompt)

    # Strip markdown code blocks if Gemini wraps the JSON
    cleaned = re.sub(r"```json|```", "", raw).strip()

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback if Gemini doesn't return valid JSON
        result = {
            "understood_symptom": text,
            "plain_explanation": "We were unable to analyze your symptoms at this time.",
            "urgency_level": "moderate",
            "urgency_reason": "Could not process. Please try again.",
            "recommended_action": "Please consult a doctor for proper guidance.",
            "response_in_user_language": "हम अभी आपके लक्षणों का विश्लेषण नहीं कर पाए। कृपया डॉक्टर से मिलें।",
            "disclaimer": "This is not a medical diagnosis. Please consult a qualified doctor for proper medical advice."
        }

    # Safety check — block medication dosage requests
    blocked_keywords = ["dosage", "dose", "mg", "tablet", "medicine name", "drug"]
    if any(word in text.lower() for word in blocked_keywords):
        result["recommended_action"] = "We cannot recommend specific medications. Please consult a pharmacist or doctor."

    return result