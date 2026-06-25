from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.dashboard import get_dashboard_home, get_dashboard_trends
from app.services.map_business_service import entities_geojson


router = APIRouter(prefix="/dashboard", tags=["Operational Home V2"])


_LAYER_TO_MAP_FILTERS = {
    "barrages": {"support": "barrages"},
    "hydro": {"support": "stations.hydro", "group_code": "stations", "support_code": "hydro"},
    "pluvio": {"support": "stations.pluvio", "group_code": "stations", "support_code": "pluvio"},
    "quality_daily": {"support": "stations_qualite"},
}


@router.get("/home")
def get_home_dashboard(db: Session = Depends(get_climate_db)):
    return get_dashboard_home(db)


@router.get("/trends")
def get_runtime_trends(
    days: int = Query(30, ge=7, le=365),
    db: Session = Depends(get_climate_db),
):
    return get_dashboard_trends(db, days=days)


@router.get("/map")
def get_dashboard_map(
    layers: str = Query(..., description="Layer code exposed by /dashboard/home"),
    limit: int = Query(200, ge=1, le=5000),
    db: Session = Depends(get_climate_db),
):
    filters = _LAYER_TO_MAP_FILTERS.get(layers)
    if filters is None:
        raise HTTPException(status_code=422, detail=f"Layer non supporté: {layers}")
    return entities_geojson(db, limit=limit, **filters)

