# backend/app/db_raw.py

import os
import logging
from contextlib import contextmanager
from typing import Iterator, Optional

from dotenv import load_dotenv
load_dotenv()  # ✅ AVANT l'import settings

import psycopg2
from psycopg2 import OperationalError
from psycopg2.pool import SimpleConnectionPool

from app.core.config import settings

logger = logging.getLogger(__name__)

# --- Support de DATABASE_URL (prioritaire si présent) ---
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql+psycopg2://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+psycopg2://", "postgresql://", 1)

DB_HOST = DB_PORT = DB_NAME = DB_USER = DB_PASS = None
if not DATABASE_URL:
    DB_HOST = os.getenv("DB_HOST") or settings.DB_HOST
    DB_PORT = int(os.getenv("DB_PORT", settings.DB_PORT or 5432))
    DB_NAME = os.getenv("DB_NAME") or settings.DB_NAME
    DB_USER = os.getenv("DB_USER") or settings.DB_USER
    DB_PASS = os.getenv("DB_PASS") or settings.DB_PASS

# Options supplémentaires (facultatives) depuis .env
DB_CONNECT_TIMEOUT = int(os.getenv("DB_CONNECT_TIMEOUT", "5"))
DB_APP_NAME = os.getenv("DB_APP_NAME", "hydroqual_api")
DB_SSLMODE = os.getenv("DB_SSLMODE", "")

# Pool
DB_POOL_MIN = int(os.getenv("DB_POOL_MIN", "1"))
DB_POOL_MAX = int(os.getenv("DB_POOL_MAX", "10"))


def _conn_kwargs() -> dict:
    if DATABASE_URL:
        return {
            "dsn": DATABASE_URL,
            "connect_timeout": DB_CONNECT_TIMEOUT,
            "application_name": DB_APP_NAME,
        }
    kwargs = {
        "host": DB_HOST,
        "port": DB_PORT,
        "dbname": DB_NAME,
        "user": DB_USER,
        "password": DB_PASS,
        "connect_timeout": DB_CONNECT_TIMEOUT,
        "application_name": DB_APP_NAME,
    }
    if DB_SSLMODE:
        kwargs["sslmode"] = DB_SSLMODE
    return kwargs


_pool: Optional[SimpleConnectionPool] = None


def _ensure_pool() -> SimpleConnectionPool:
    global _pool
    if _pool is None:
        kwargs = _conn_kwargs()
        logger.info(
            "Initialisation pool PostgreSQL (min=%s, max=%s) via %s",
            DB_POOL_MIN, DB_POOL_MAX,
            "DATABASE_URL" if DATABASE_URL else f"{kwargs.get('host')}:{kwargs.get('port')}/{kwargs.get('dbname')}",
        )
        _pool = SimpleConnectionPool(DB_POOL_MIN, DB_POOL_MAX, **kwargs)
    return _pool


def conn():
    """Connexion directe (hors pool)."""
    return psycopg2.connect(**_conn_kwargs())


def get_conn():
    return conn()


@contextmanager
def connection() -> Iterator[psycopg2.extensions.connection]:
    pool = _ensure_pool()
    cx = None
    try:
        cx = pool.getconn()
        yield cx
        cx.commit()
    except Exception as e:
        if cx:
            cx.rollback()
        logger.exception("Erreur DB, rollback: %s", e)
        raise
    finally:
        if cx:
            pool.putconn(cx)


def ping() -> bool:
    try:
        with connection() as cx:
            with cx.cursor() as cur:
                cur.execute("SELECT 1;")
                cur.fetchone()
        return True
    except OperationalError as e:
        logger.error("Ping DB échoué (OperationalError): %s", e)
        return False
    except Exception as e:
        logger.error("Ping DB échoué: %s", e)
        return False
