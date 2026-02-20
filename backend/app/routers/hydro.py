from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.climate_database import get_climate_db

router = APIRouter(tags=["hydro"])



@router.get("/stations")
def stations(db: Session = Depends(get_climate_db)):
    return db.execute(text("""
        SELECT DISTINCT
            station_id,
            station_code,
            station_name
        FROM api.v_stations_stats
        WHERE property_name ILIKE '%flow%'
        ORDER BY station_name
    """)).mappings().all()


@router.get("/stats")
def station_stats(station_id: int, db: Session = Depends(get_climate_db)):
    return db.execute(text("""
        SELECT *
        FROM api.v_stations_stats
        WHERE station_id = :station_id
          AND property_name ILIKE '%flow%'
        ORDER BY source_type, scenario_code, run_id
    """), {"station_id": station_id}).mappings().all()


@router.get("/timeseries")
def hydro_timeseries(
    ts_id: int,
    aggregation: str,
    date_start: str,
    date_end: str,
    db: Session = Depends(get_climate_db),
):

    view_map = {
        "instantaneous": ("api.v_measurements_latest", "datetime"),
        "daily": ("api.v_measurements_daily", "datetime"),
        "monthly": ("api.v_measurements_monthly", "datetime"),
        "annual": ("api.v_measurements_annual", "datetime"),
    }

    config = view_map.get(aggregation)

    if not config:
        raise HTTPException(400, "Invalid aggregation")

    view, date_column = config

    # 🔥 CORRECTION POUR SCÉNARIO OBSERVÉ
    if aggregation == "instantaneous":
        view = "api.v_measurements_daily"


    return db.execute(
        text(f"""
            SELECT {date_column} AS datetime, value
            FROM {view}
            WHERE ts_id = :ts_id
                AND (:date_start IS NULL OR {date_column} >= :date_start)
                AND (:date_end IS NULL OR {date_column} <= :date_end)

            ORDER BY {date_column}
        """),
        {
            "ts_id": ts_id,
            "date_start": date_start,
            "date_end": date_end,
        }
    ).mappings().all()

@router.get("/kpis")
def hydro_kpis(
    ts_id: int,
    aggregation: str,
    date_start: str,
    date_end: str,
    db: Session = Depends(get_climate_db),
):

    view_map = {
        "instantaneous": ("api.v_measurements_latest", "datetime"),
        "daily": ("api.v_measurements_daily", "datetime"),
        "monthly": ("api.v_measurements_monthly", "datetime"),
        "annual": ("api.v_measurements_annual", "datetime"),
    }

    config = view_map.get(aggregation)

    if not config:
        raise HTTPException(400, "Invalid aggregation")

    view, date_column = config

    # 🔥 CORRECTION POUR SCÉNARIO OBSERVÉ
    if aggregation == "instantaneous":
        view = "api.v_measurements_daily"

    return db.execute(
        text(f"""
            SELECT
                MIN(value) AS min,
                MAX(value) AS max,
                AVG(value) AS mean
            FROM {view}
            WHERE ts_id = :ts_id
                AND (:date_start IS NULL OR {date_column} >= :date_start)
                AND (:date_end IS NULL OR {date_column} <= :date_end)

        """),
        {
            "ts_id": ts_id,
            "date_start": date_start,
            "date_end": date_end,
        }
    ).mappings().first()
