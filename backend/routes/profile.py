from fastapi import APIRouter
from database.mongo import get_db
from collections import Counter

router = APIRouter()

@router.get("/profile/{session_id}")
def get_profile(session_id: str):
    try:
        db = get_db()
        records = list(db.queries.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", -1))

        if not records:
            return {"success": True, "profile": None}

        # Count urgency levels
        urgency_counts = Counter(
            r["result"]["urgency_level"] for r in records
        )

        # Count languages used
        language_counts = Counter(r["language"] for r in records)

        # Extract most common symptom words
        all_words = []
        for r in records:
            words = r["input"].lower().split()
            all_words.extend(words)
        top_symptoms = [
            word for word, _ in Counter(all_words).most_common(5)
            if len(word) > 3  # skip short words like "hai", "the"
        ]

        # Most used language
        most_used_language = language_counts.most_common(1)[0][0]

        # Last query date
        last_query = records[0]["timestamp"] if records else None

        return {
            "success": True,
            "profile": {
                "total_queries": len(records),
                "urgency_breakdown": {
                    "low": urgency_counts.get("low", 0),
                    "moderate": urgency_counts.get("moderate", 0),
                    "high": urgency_counts.get("high", 0),
                },
                "most_used_language": most_used_language,
                "top_symptoms": top_symptoms,
                "last_query": last_query,
                "recent": records[:5]
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}