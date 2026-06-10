from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.dashboard import get_dashboard_home, get_dashboard_trends


router = APIRouter(prefix="/dashboard", tags=["Operational Home V2"])


@router.get("/home")
def get_home_dashboard(db: Session = Depends(get_climate_db)):
    return get_dashboard_home(db)


@router.get("/trends")
def get_runtime_trends(
    days: int = Query(30, ge=7, le=365),
    db: Session = Depends(get_climate_db),
):
    return get_dashboard_trends(db, days=days)
