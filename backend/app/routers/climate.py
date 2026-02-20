# backend/app/routers/climate.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.climate_database import get_climate_db

from app.core.logger import get_logger
log = get_logger("CLIMATE_API")


router = APIRouter(tags=["climate"])

# =====================================================
# 1. STATIONS (pour combo Station)
# =====================================================
@router.get("/stations")
def climate_stations(db: Session = Depends(get_climate_db)):
    log.info("GET /climate/stations")

    rows = db.execute(text("""
        SELECT DISTINCT station_id, station_code, station_name
        FROM api.v_stations_stats
        ORDER BY station_name
    """)).mappings().all()




    log.info(f"→ stations count = {len(rows)}")
    return rows

# =====================================================
# 2. STATS MÉTIER (équivalent dm.get_station_stats)
# =====================================================
@router.get("/station-stats")
def climate_station_stats(station_id: int, db: Session = Depends(get_climate_db)):
    log.info(f"GET /climate/station-stats | station_id={station_id}")

    rows = db.execute(text("""
        SELECT *
        FROM api.v_stations_stats
        WHERE station_id = :station_id
    """), {"station_id": station_id}).mappings().all()

    log.info(f"→ stats rows = {len(rows)}")
    return rows

# =====================================================
# 3. SÉRIE TEMPORELLE
# =====================================================
@router.get("/timeseries")
def climate_timeseries(
    ts_id: int,
    time_step: str,
    date_start: str | None = None,
    date_end: str | None = None,
    db: Session = Depends(get_climate_db),
):
    log.info(f"GET /climate/timeseries | ts_id={ts_id} | time_step={time_step}")

    view_map = {
        "daily": "api.v_measurements_daily",
        "monthly": "api.v_measurements_monthly",
        "annual": "api.v_measurements_annual",
        "instantaneous": "api.v_measurements_latest",
    }

    view_name = view_map.get(time_step.lower())

    if not view_name:
        return {"error": "Invalid time_step"}

    sql = f"""
        SELECT datetime, value
        FROM {view_name}
        WHERE ts_id = :ts_id
          AND (:date_start IS NULL OR datetime >= :date_start)
          AND (:date_end IS NULL OR datetime <= :date_end)
        ORDER BY datetime
    """

    rows = db.execute(text(sql), {
        "ts_id": ts_id,
        "date_start": date_start,
        "date_end": date_end,
    }).mappings().all()

    return rows


# =====================================================
# 4. KPIs (MIN / MAX / MOY + extrêmes)
# =====================================================
@router.get("/kpis")
def climate_kpis(
    ts_id: int,
    time_step: str,
    db: Session = Depends(get_climate_db),
):
    view_map = {
        "daily": "api.v_measurements_daily",
        "monthly": "api.v_measurements_monthly",
        "annual": "api.v_measurements_annual",
        "instantaneous": "api.v_measurements_latest",
    }

    view_name = view_map.get(time_step.lower())

    sql = f"""
        SELECT
            MIN(value) AS min,
            MAX(value) AS max,
            AVG(value) AS mean
        FROM {view_name}
        WHERE ts_id = :ts_id
    """

    row = db.execute(text(sql), {"ts_id": ts_id}).mappings().one()
    return row
