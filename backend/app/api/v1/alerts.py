from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.alerts import list_alerts


router = APIRouter(prefix="/alerts")


@router.get("")
def get_alerts(
    alert_type: str | None = Query(None, alias="type"),
    limit: int = Query(50, ge=1, le=200),
    entity_name: str | None = Query(None),
    site_id: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    return list_alerts(
        db,
        alert_type=alert_type,
        limit=limit,
        entity_name=entity_name,
        site_id=site_id,
    )
