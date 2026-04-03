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
        WITH s AS (
          SELECT
            station_id,
            code_station,
            station_nom,
            row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
          FROM api.v_station_dimension
          WHERE station_nom IS NOT NULL
        )
        SELECT
          station_num AS station_id,
          code_station AS station_code,
          station_nom AS station_name
        FROM s
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
        WITH s AS (
          SELECT
            station_id,
            row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
          FROM api.v_station_dimension
          WHERE station_nom IS NOT NULL
        )
        SELECT
          s.station_num AS station_id,
          'observed' AS source_type,
          'OBS' AS scenario_code,
          'Observations' AS scenario_name,
          1 AS run_id,
          'precipitation_annuelle' AS property_name,
          'annual' AS time_step,
          s.station_num AS ts_id,
          MIN(v.date_jr)::date AS dt_min,
          MAX(v.date_jr)::date AS dt_max
        FROM api.v_meteo_precipitation_annuelle_max v
        JOIN s ON v.station_id = s.station_id
        WHERE s.station_num = :station_id
        GROUP BY s.station_num
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

    if time_step.lower() not in {"annual", "yearly"}:
        return []

    rows = db.execute(text("""
        WITH s AS (
          SELECT
            station_id,
            row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
          FROM api.v_station_dimension
          WHERE station_nom IS NOT NULL
        )
        SELECT
          make_date(v.annee, 1, 1) AS datetime,
          v.p_annuelle AS value
        FROM api.v_meteo_precipitation_annuelle_max v
        JOIN s ON v.station_id = s.station_id
        WHERE s.station_num = :ts_id
          AND (:date_start IS NULL OR make_date(v.annee, 1, 1) >= :date_start::date)
          AND (:date_end IS NULL OR make_date(v.annee, 1, 1) <= :date_end::date)
        ORDER BY datetime
    """), {
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
    if time_step.lower() not in {"annual", "yearly"}:
        return {"min": None, "max": None, "mean": None}

    row = db.execute(text("""
        WITH s AS (
          SELECT
            station_id,
            row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
          FROM api.v_station_dimension
          WHERE station_nom IS NOT NULL
        )
        SELECT
          MIN(v.p_annuelle) AS min,
          MAX(v.p_annuelle) AS max,
          AVG(v.p_annuelle) AS mean
        FROM api.v_meteo_precipitation_annuelle_max v
        JOIN s ON v.station_id = s.station_id
        WHERE s.station_num = :ts_id
    """), {"ts_id": ts_id}).mappings().one()
    return row
