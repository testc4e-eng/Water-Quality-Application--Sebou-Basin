# backend/app/api/v1/api_router.py
from fastapi import APIRouter

from app.routers.layers import router as layers_router
from app.routers.names import router as names_router, legacy_router as catalog_router
from app.routers.entities import router as entities_router

api_router = APIRouter()

# Entités (stations, barrages, alerts…)
api_router.include_router(entities_router, prefix="", tags=["entities"])

# GeoJSON par couche
api_router.include_router(layers_router, prefix="/layers", tags=["layers"])

# Listes (sélecteurs) modernes
api_router.include_router(names_router, prefix="/names", tags=["names"])

# Compatibilité avec vos anciens chemins /api/v1/catalog/...
api_router.include_router(catalog_router, prefix="/catalog", tags=["catalog"])
