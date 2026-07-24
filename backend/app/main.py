# backend/app/main.py

import asyncio
import os
import threading
from urllib.parse import urlencode
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
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


def _env_flag(name: str, default: bool = False) -> bool:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    return raw_value.strip().lower() in {"1", "true", "yes", "on"}


# En production, la documentation interactive (/docs, /openapi.json) est
# désactivée sauf activation explicite (SAD_EXPOSE_DOCS=true) : elle offre
# la cartographie complète de l'API à un éventuel attaquant.
_IS_PROD = os.getenv("ENV", "development").strip().lower() in {"prod", "production"}
_EXPOSE_DOCS = _env_flag("SAD_EXPOSE_DOCS", default=not _IS_PROD)

app = FastAPI(
    title="SAD_SEBOU API",
    version="1.0.0",
    description="API WebSIG pour la gestion et le suivi de la qualité de l’eau – Bassin du Sebou",
    docs_url="/docs" if _EXPOSE_DOCS else None,
    redoc_url="/redoc" if _EXPOSE_DOCS else None,
    openapi_url="/openapi.json" if _EXPOSE_DOCS else None,
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
app.add_middleware(GZipMiddleware, minimum_size=1024, compresslevel=6)


# =========================
# HEADERS DE SÉCURITÉ
# =========================
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    response.headers.setdefault(
        "Permissions-Policy", "geolocation=(), microphone=(), camera=()"
    )
    return response

def _sanitize_query_params(request: Request) -> str:
    masked_pairs = []
    for key, value in request.query_params.multi_items():
        lowered = key.lower()
        if any(token in lowered for token in ("password", "passwd", "token", "secret", "auth")):
            masked_pairs.append((key, "***"))
        else:
            masked_pairs.append((key, value[:256]))
    return urlencode(masked_pairs, doseq=True)


def _schedule_activity_log(
    *,
    method: str,
    path: str,
    status_code: int,
    duration_ms: int,
    username: str | None,
    ip_address: str | None,
    user_agent: str | None,
    query_params: str,
) -> None:
    from app.db.session import SessionLocal

    def finalize_log() -> None:
        db = SessionLocal()
        try:
            log_activity(
                db=db,
                method=method,
                path=path,
                status_code=status_code,
                duration_ms=duration_ms,
                user_id=None,
                username=username,
                ip_address=ip_address,
                user_agent=user_agent,
                query_params=query_params,
                request_payload=None,
            )
        except Exception:
            # Éviter de faire planter le worker si le log échoue
            pass
        finally:
            db.close()

    try:
        loop = asyncio.get_running_loop()
        loop.run_in_executor(None, finalize_log)
    except RuntimeError:
        # Fallback si aucun event loop n'est disponible
        finalize_log()

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

    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    safe_query_params = _sanitize_query_params(request)

    try:
        response = await call_next(request)
        status_code = getattr(response, "status_code", 500)
    except Exception:
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        _schedule_activity_log(
            method=request.method,
            path=request.url.path,
            status_code=500,
            duration_ms=duration_ms,
            username=username,
            ip_address=ip_address,
            user_agent=user_agent,
            query_params=safe_query_params,
        )
        raise

    duration_ms = int((time.perf_counter() - start_time) * 1000)
    _schedule_activity_log(
        method=request.method,
        path=request.url.path,
        status_code=status_code,
        duration_ms=duration_ms,
        username=username,
        ip_address=ip_address,
        user_agent=user_agent,
        query_params=safe_query_params,
    )
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
        "api_base": API_PREFIX,
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
        from app.db.climate_database import ClimateSessionLocal
        from app.services.dashboard.home_service import warm_dashboard_home_cache
        with connection() as cx:
            with cx.cursor() as cur:
                cur.execute("SELECT 1;")
                cur.fetchone()
        print("Connexion PostgreSQL OK")
        threading.Thread(
            target=warm_dashboard_home_cache,
            args=(ClimateSessionLocal,),
            kwargs={"force": False},
            daemon=True,
        ).start()
    except Exception as e:
        print("ERREUR CONNEXION POSTGRESQL :", e)


from fastapi.responses import HTMLResponse

@app.get("/ui", response_class=HTMLResponse)
def ui():
    return "<h1>SAD Backend OK</h1>"
