from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

# =====================================================
# 🔐 ENV VARS
# =====================================================
DB_USER = os.getenv("CLIMATE_DB_USER") or os.getenv("DB_USER")
DB_PASS = quote_plus(os.getenv("CLIMATE_DB_PASS", os.getenv("DB_PASS", "")))
DB_HOST = os.getenv("CLIMATE_DB_HOST") or os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("CLIMATE_DB_PORT") or os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("CLIMATE_DB_NAME") or os.getenv("DB_NAME")

CLIMATE_DB_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASS}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# =====================================================
# 🧱 ENGINE
# =====================================================
engine_climate = create_engine(
    CLIMATE_DB_URL,
    pool_size=int(os.getenv("CLIMATE_DB_POOL_MIN", 1)),
    max_overflow=int(os.getenv("CLIMATE_DB_POOL_MAX", 5)),
    pool_pre_ping=True,
)

# =====================================================
# 🧪 SESSION
# =====================================================
ClimateSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_climate,
)

# =====================================================
# 📡 DEPENDENCY
# =====================================================
def get_climate_db():
    db = ClimateSessionLocal()
    try:
        yield db
    finally:
        db.close()

# =====================================================
# ✅ TEST CONNEXION (appelé depuis main.py)
# =====================================================
def test_climate_db():
    db = ClimateSessionLocal()
    try:
        db.execute(text("SELECT 1"))
    finally:
        db.close()
