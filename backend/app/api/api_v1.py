from fastapi import APIRouter

from app.api.v1.swat import router as swat_router
from app.api.v1.stations import router as stations_router
from app.api.v1.geojson import router as geo_router
from app.api.v1.measurements import router as meas_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.auth import router as auth_router
from app.api.v1.meta import router as meta_router
from app.api.v1.raw import router as raw_router

from app.api.v1 import swat
from app.api.v1 import swat_analysis

from app.routers import hydro, quality, climate

from app.routers.layers import router as layers_router
from app.routers.names import router as names_router




api_router = APIRouter()

# =========================
# AUTH
# =========================
api_router.include_router(auth_router, tags=["Auth"])

# =========================
# CORE API
# =========================
api_router.include_router(stations_router, tags=["stations"])
api_router.include_router(geo_router, tags=["geojson"])
api_router.include_router(meas_router, tags=["measurements"])
api_router.include_router(alerts_router, tags=["alerts"])
api_router.include_router(meta_router, tags=["meta"])
api_router.include_router(raw_router, tags=["raw"])

# =========================
# LAYERS / NAMES
# =========================
api_router.include_router(layers_router, prefix="/layers", tags=["layers"])
api_router.include_router(names_router, prefix="/names", tags=["names"])


# =========================
# DASHBOARDS
# =========================
api_router.include_router(climate.router, prefix="/climate", tags=["Climate"])
api_router.include_router(hydro.router, prefix="/hydro", tags=["hydro"])
api_router.include_router(quality.router, prefix="/quality", tags=["Quality"])

# =========================
# SWAT
# =========================
api_router.include_router(swat_router, tags=["swat"])
api_router.include_router(swat.router)
api_router.include_router(swat_analysis.router)
