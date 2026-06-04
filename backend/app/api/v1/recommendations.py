from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.recommendations import list_recommendations


router = APIRouter(prefix="/recommendations", tags=["Recommendation Engine"])


@router.get("")
def get_recommendations(
    domain: str | None = Query(None),
    limit: int = Query(10, ge=1, le=50),
    entity_name: str | None = Query(None),
    site_id: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    return list_recommendations(
        db,
        domain=domain,
        limit=limit,
        entity_name=entity_name,
        site_id=site_id,
    )
