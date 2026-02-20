from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.climate_database import get_climate_db

router = APIRouter()

@router.get("/stations")
def get_quality_stations(db: Session = Depends(get_climate_db)):
    return db.execute(text("""
        SELECT DISTINCT station_code, station_name
        FROM api.v_quality_stations
        ORDER BY station_name
    """)).mappings().all()

@router.get("/kpis")
def get_quality_kpis(
    station_code: str,
    db: Session = Depends(get_climate_db)
):
    return db.execute(text("""
        SELECT n, o, p
        FROM api.v_quality_kpis
        WHERE station_code = :station_code
    """), {"station_code": station_code}).mappings().first()

@router.get("/table")
def get_quality_table(
    station_code: str,
    db: Session = Depends(get_climate_db)
):
    return db.execute(text("""
        SELECT date, n, o, p
        FROM api.v_quality_measurements
        WHERE station_code = :station_code
        ORDER BY date DESC
        LIMIT 500
    """), {"station_code": station_code}).mappings().all()

@router.get("/chart")
def get_quality_chart(
    station_code: str,
    db: Session = Depends(get_climate_db)
):
    return db.execute(text("""
        SELECT date, n, o, p
        FROM api.v_quality_measurements
        WHERE station_code = :station_code
        ORDER BY date ASC
    """), {"station_code": station_code}).mappings().all()
