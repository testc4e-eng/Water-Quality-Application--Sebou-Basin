# backend/app/main.py

import os
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import time
from app.security.jwt_service import decode_token
from app.security.services import log_activity

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
# ACTIVITY LOGGING MIDDLEWARE
# =========================
@app.middleware("http")
async def activity_log_middleware(request: Request, call_next):
    # Ignorer les routes système et docs pour ne pas polluer
    if request.url.path in ["/health", "/", "/docs", "/openapi.json", "/favicon.ico"]:
        return await call_next(request)
    if request.url.path.startswith("/ui"):
        return await call_next(request)
    if request.method.upper() == "OPTIONS":
        return await call_next(request)
    if request.url.path.startswith("/api/v1/security/logs"):
        return await call_next(request)

    start_time = time.perf_counter()
    
    # Tenter d'identifier l'utilisateur via le token Bearer
    username = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
        try:
            payload = decode_token(token)
            if payload and payload.get("sub"):
                username = payload.get("sub")
        except Exception:
            # Token invalide, on continue sans username
            pass

    response = await call_next(request)
    
    duration_ms = int((time.perf_counter() - start_time) * 1000)
    
    # Enregistrement asynchrone (non-bloquant)
    from app.db.session import SessionLocal
    def finalize_log():
        db = SessionLocal()
        try:
            log_activity(
                db=db,
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=duration_ms,
                user_id=None,
                username=username,
                ip_address=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent"),
                query_params=str(request.query_params),
                request_payload=None
            )
        except Exception:
            # Éviter de faire planter le worker si le log échoue
            pass
        finally:
            db.close()

    # On utilise BackgroundTasks si possible, ou on exécute simplement après
    # Dans un middleware FastAPI "http", les BackgroundTasks de l'endpoint ne sont pas encore là.
    # On peut les ajouter à la réponse
    if (not hasattr(response, "background")) or (getattr(response, "background", None) is None):
        response.background = BackgroundTasks()
    response.background.add_task(finalize_log)
    
    return response


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
        print("Connexion PostgreSQL OK")
    except Exception as e:
        print("ERREUR CONNEXION POSTGRESQL :", e)


from fastapi.responses import HTMLResponse

@app.get("/ui", response_class=HTMLResponse)
def ui():
    return "<h1>SAD Backend OK</h1>"
