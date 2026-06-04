from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.dashboard import get_dashboard_home


router = APIRouter(prefix="/dashboard", tags=["Operational Home V2"])


@router.get("/home")
def get_home_dashboard(db: Session = Depends(get_climate_db)):
    return get_dashboard_home(db)
