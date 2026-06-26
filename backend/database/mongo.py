from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

_db = None

def get_db():
    global _db
    if _db is not None:
        return _db
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise ValueError("MONGODB_URI not set in .env")
    client = MongoClient(uri)
    _db = client["medibridge"]
    return _db

def ping_db():
    try:
        get_db().client.admin.command("ping")
        return True
    except ConnectionFailure:
        return False

def save_query(session_id: str, language: str, input_text: str, result: dict):
    db = get_db()
    db.queries.insert_one({
        "session_id": session_id,
        "language": language,
        "input": input_text,
        "result": result,
        "timestamp": __import__("datetime").datetime.utcnow().isoformat()
    })

def get_history(session_id: str):
    db = get_db()
    records = db.queries.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", -1).limit(10)
    return list(records)