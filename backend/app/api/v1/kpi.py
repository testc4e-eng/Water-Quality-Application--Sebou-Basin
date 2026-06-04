from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.services.kpi import get_overview_kpis, get_pollution_kpis, get_station_kpis, get_subbasin_kpis


router = APIRouter(prefix="/kpi", tags=["KPI Engine"])


@router.get("/overview")
def get_kpi_overview(db: Session = Depends(get_climate_db)):
    return get_overview_kpis(db)


@router.get("/stations")
def get_kpi_stations(db: Session = Depends(get_climate_db)):
    return get_station_kpis(db)


@router.get("/subbasins")
def get_kpi_subbasins(db: Session = Depends(get_climate_db)):
    return get_subbasin_kpis(db)


@router.get("/pollution")
def get_kpi_pollution(db: Session = Depends(get_climate_db)):
    return get_pollution_kpis(db)
