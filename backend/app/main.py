# backend/app/main.py

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Charger .env AVANT tout le reste
load_dotenv()

# Import unique du routeur principal
from app.api.api_v1 import api_router


def _parse_cors_origins() -> list[str]:
    raw_val = os.getenv("BACKEND_CORS_ORIGINS", "").strip()
    if not raw_val:
        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
        ]
    return [x.strip() for x in raw_val.split(",") if x.strip()]


cors_origins = _parse_cors_origins()

app = FastAPI(
    title="SAD_SEBOU API",
    version="1.0.0",
    description="API WebSIG pour la gestion et le suivi de la qualité de l’eau – Bassin du Sebou",
)

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS
# =========================
API_PREFIX = "/api/v1"
app.include_router(api_router, prefix=API_PREFIX)

# =========================
# SYSTEM ROUTES
# =========================
@app.get("/", tags=["system"])
def root():
    return {
        "status": "OK",
        "message": "Backend SAD_SEBOU opérationnel",
        "docs": "/docs",
        "api_base": API_PREFIX,
        "cors_origins": cors_origins,
    }


@app.get("/health", tags=["system"])
def health():
    try:
        from app.db_raw import ping
        return {"status": "OK", "db": "OK" if ping() else "DOWN"}
    except Exception as e:
        return {"status": "OK", "db": "ERROR", "detail": str(e)}


@app.on_event("startup")
def test_db_connection():
    try:
        from app.db_raw import connection
        with connection() as cx:
            with cx.cursor() as cur:
                cur.execute("SELECT 1;")
                cur.fetchone()
        print("✅ Connexion PostgreSQL OK")
    except Exception as e:
        print("❌ ERREUR CONNEXION POSTGRESQL :", e)


from fastapi.responses import HTMLResponse

@app.get("/ui", response_class=HTMLResponse)
def ui():
    return "<h1>SAD Backend OK</h1>"
