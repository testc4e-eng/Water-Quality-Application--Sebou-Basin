import logging
import os

from fastapi import APIRouter

from app.api.v1.swat import router as swat_router
from app.api.v1.stations import router as stations_router
from app.api.v1.geojson import router as geo_router
from app.api.v1.measurements import router as meas_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.auth import router as auth_router
from app.api.v1.meta import router as meta_router
from app.api.v1.raw import router as raw_router
from app.api.v1.qualite_specialized import router as qualite_specialized_router
from app.api.v1.pollution import router as pollution_router
from app.api.v1.map import router as map_router
from app.api.v1.propagation import router as propagation_router
from app.api.v1.kpi import router as kpi_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.data_admin.router import router as data_admin_router
from app.api.v1.data_admin.ingestion import router as data_admin_ingestion_router
from app.api.v1.data_admin.templates import router as data_admin_templates_router
from app.api.v1.data_admin.change_requests import router as data_admin_change_requests_router

from app.api.v1 import swat

from app.routers import hydro, quality, climate, entities, observatory, analytics


from app.routers.layers import router as layers_router
from app.routers.admin_data_scan import router as admin_data_scan_router
from app.routers.names import router as names_router
from app.routers.admin_password_resets import router as admin_password_resets_router
from app.routers.admin_users import router as admin_users_router
from app.security.routes_users import router as users_router
from app.security.routes_logs import router as security_logs_router
from app.routers.layer_configs import router as layer_configs_router




from app.api.v1.routing import router as routing_router


log = logging.getLogger(__name__)


def _env_flag(name: str, default: bool = False) -> bool:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    return raw_value.strip().lower() in {"1", "true", "yes", "on"}


def _include_optional_swat_analysis(router: APIRouter) -> bool:
    if not _env_flag("SAD_ENABLE_SWAT_ANALYSIS", default=False):
        log.warning(
            "SWAT analysis disabled: optional router not loaded. "
            "Set SAD_ENABLE_SWAT_ANALYSIS=true after validating the scientific runtime."
        )
        return False

    try:
        from app.api.v1 import swat_analysis
    except BaseException as exc:
        log.warning("SWAT analysis disabled: %s: %s", type(exc).__name__, exc)
        return False

    router.include_router(swat_analysis.router)
    log.info("SWAT analysis router enabled")
    return True


def _include_optional_ingestion(router: APIRouter) -> bool:
    if not _env_flag("SAD_ENABLE_INGESTION_API", default=False):
        log.warning(
            "Ingestion API disabled: optional router not loaded. "
            "Set SAD_ENABLE_INGESTION_API=true after validating pandas/numpy runtime."
        )
        return False

    try:
        from app.routers.ingestion import router as ingestion_router
    except BaseException as exc:
        log.warning("Ingestion API disabled: %s: %s", type(exc).__name__, exc)
        return False

    router.include_router(ingestion_router, tags=["SAD Ingestion"])
    log.info("Ingestion API router enabled")
    return True


api_router = APIRouter()
api_router.include_router(routing_router, prefix='/routing', tags=['routing'])

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
api_router.include_router(data_admin_router)
api_router.include_router(data_admin_ingestion_router)
api_router.include_router(data_admin_templates_router)
api_router.include_router(data_admin_change_requests_router)
api_router.include_router(entities.router, tags=["entities"])

# =========================
# LAYERS / NAMES
# =========================
api_router.include_router(layers_router, prefix="/layers", tags=["layers"])
api_router.include_router(names_router, prefix="/names", tags=["names"])
api_router.include_router(users_router, tags=["users"])
api_router.include_router(security_logs_router, tags=["security"])

# =========================
# ADMIN
# =========================
api_router.include_router(admin_data_scan_router, prefix="/admin", tags=["admin"])
api_router.include_router(admin_password_resets_router, prefix="/admin", tags=["admin"])
api_router.include_router(admin_users_router, prefix="/admin", tags=["admin"])


# =========================
# DASHBOARDS
# =========================
api_router.include_router(climate.router, prefix="/climate", tags=["Climate"])
api_router.include_router(hydro.router, prefix="/hydro", tags=["hydro"])
api_router.include_router(quality.router, prefix="/quality", tags=["Quality"])
api_router.include_router(qualite_specialized_router)
api_router.include_router(pollution_router)
api_router.include_router(map_router)
api_router.include_router(propagation_router)
api_router.include_router(kpi_router)
api_router.include_router(recommendations_router)
api_router.include_router(dashboard_router)
api_router.include_router(observatory.router)
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

# =========================
# SWAT
# =========================
api_router.include_router(swat_router, tags=["swat"])
api_router.include_router(swat.router)
SWAT_ANALYSIS_AVAILABLE = _include_optional_swat_analysis(api_router)

# =========================
# INGESTION / SAD
# =========================
INGESTION_API_AVAILABLE = _include_optional_ingestion(api_router)

api_router.include_router(layer_configs_router)
