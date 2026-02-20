# backend/app/core/config.py
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus  # 👈 ajoute cet import

# Charger le fichier .env
load_dotenv()

class Settings:
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT", "5432"))
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")

    SECRET_KEY = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

    CORS_ORIGINS = [
        o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()
    ]
    BACKEND_CORS_ORIGINS = [
        o.strip() for o in os.getenv("BACKEND_CORS_ORIGINS", "").split(",") if o.strip()
    ]

    @property
    def dsn(self) -> str:
        password = quote_plus(self.DB_PASS) if self.DB_PASS else ""
        return (
            f"postgresql+psycopg2://{self.DB_USER}:{password}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

# 👇 instanciation de la config
settings = Settings()
