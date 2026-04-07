# backend/app/db/database.py
# Shim de compatibilité : réexporte la session unifiée
from app.db.session import engine, SessionLocal, get_db  # noqa: F401

# Si d'anciens imports utilisent "Base" depuis database.py, on NE la redéfinit pas ici.
# La "Base" unique doit venir de app.db.base import Base.
