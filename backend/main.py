from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from database.mongo import ping_db
from services.gemini_service import ping_gemini
from routes.lang_routes import router as languages_router
from routes.test import router as test_router
from routes.analyze import router as analyze_router
from routes.history import router as history_router
from routes.profile import router as profile_router

load_dotenv()

app = FastAPI(title="MediBridge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("FRONTEND_URL", "")],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(languages_router, prefix="/api")
app.include_router(test_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(profile_router, prefix="/api")

@app.on_event("startup")
async def startup():
    print("\n── MediBridge startup ──")
    print(f"  Gemini  : {'✓' if ping_gemini() else '✗ FAILED'}")
    print(f"  MongoDB : {'✓' if ping_db() else '✗ FAILED'}")
    print("────────────────────────\n")

@app.get("/")
def root():
    return {"status": "ok"}