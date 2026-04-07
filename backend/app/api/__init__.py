# backend/app/api/__init__.py
from fastapi import APIRouter
from app.routers import layers

# Création du routeur principal de l'API
api_router = APIRouter()

# Inclusion des sous-routeurs
api_router.include_router(layers.router, prefix="/layers", tags=["layers"])
