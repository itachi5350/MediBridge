from fastapi import APIRouter
from database.mongo import save_query, get_history

router = APIRouter()

@router.post("/history/save")
def save(payload: dict):
    try:
        save_query(
            session_id=payload.get("session_id"),
            language=payload.get("language"),
            input_text=payload.get("input"),
            result=payload.get("result")
        )
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/history/{session_id}")
def history(session_id: str):
    try:
        records = get_history(session_id)
        return {"success": True, "history": records}
    except Exception as e:
        return {"success": False, "error": str(e)}