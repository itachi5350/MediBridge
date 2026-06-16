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