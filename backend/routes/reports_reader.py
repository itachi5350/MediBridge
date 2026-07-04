from fastapi import APIRouter, UploadFile, File, Form
from google import genai
from google.genai import types
import os
import json
import re
import base64
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

REPORT_PROMPT = """
You are a medical report interpreter for MediBridge, a health literacy assistant for India.
A patient has uploaded their medical report. Explain it in simple, clear language.

RULES:
1. Never diagnose — only explain what the report says
2. Use simple language a Class 8 student can understand
3. Explain all medical terms in plain words
4. Be reassuring but honest
5. Always recommend discussing results with their doctor

LANGUAGE RULES:
- All fields except explanation_in_user_language must be in clear proper English
- explanation_in_user_language must be written in the native script of the user's language
- Hindi: देवनागरी script, Kannada: ಕನ್ನಡ, Tamil: தமிழ், Telugu: తెలుగు

You must respond ONLY in this exact JSON format, nothing else:
{
  "report_type": "what kind of report this is in English",
  "summary": "overall summary in plain English",
  "key_findings": ["finding 1 in English", "finding 2 in English"],
  "abnormal_values": "any values outside normal range explained simply in English — write None if everything is normal",
  "what_it_means": "what these results mean for the patient in simple English",
  "questions_for_doctor": ["question 1", "question 2", "question 3"],
  "explanation_in_user_language": "full explanation written entirely in the native script of the user's language",
  "disclaimer": "This explanation is for educational purposes only. Please discuss your report with your doctor."
}
"""

@router.post("/read-report")
async def read_report(
    file: UploadFile = File(...),
    language: str = Form("hindi")
):
    try:
        file_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"

        # Check file size — limit to 10MB
        if len(file_bytes) > 10 * 1024 * 1024:
            return {"success": False, "error": "File too large. Please upload a file under 10MB."}

        # Check supported types
        supported_types = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
        if mime_type not in supported_types:
            return {"success": False, "error": "Unsupported file type. Please upload a JPG, PNG, or PDF."}

        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        prompt = (
            REPORT_PROMPT +
            f"\n\nUser language preference: {language}" +
            f"\nIMPORTANT: Write explanation_in_user_language in proper {language} native script." +
            "\nPlease explain this medical report."
        )

        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=[
                types.Part.from_bytes(
                    data=file_bytes,
                    mime_type=mime_type
                ),
                prompt
            ]
        )

        cleaned = re.sub(r"```json|```", "", response.text).strip()
        result = json.loads(cleaned)
        return {"success": True, "result": result}

    except json.JSONDecodeError:
        return {"success": False, "error": "Could not parse the report analysis. Please try again."}
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            return {
                "success": False,
                "error": "API quota exceeded. Please wait a few minutes and try again, or try a different report."
            }
        if "400" in error_msg:
            return {
                "success": False,
                "error": "Could not read this file. Please make sure it is a clear image or valid PDF."
            }
        return {"success": False, "error": "Something went wrong. Please try again."}