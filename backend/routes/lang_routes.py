from fastapi import APIRouter
from config.languages import SUPPORTED_LANGUAGES

router = APIRouter()

@router.get("/languages")
def get_languages():
    active, coming_soon = [], []
    for key, lang in SUPPORTED_LANGUAGES.items():
        entry = {**lang, "key": key}
        if lang["status"] == "active":
            active.append(entry)
        else:
            coming_soon.append(entry)
    return {"active": active, "coming_soon": coming_soon}