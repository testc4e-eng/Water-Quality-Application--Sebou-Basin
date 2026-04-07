# backend/app/routers/climate.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.logger import get_logger
from app.db.climate_database import get_climate_db

log = get_logger("CLIMATE_API")

router = APIRouter(tags=["climate"])

SOURCE_TYPE = "observed"
SCENARIO_CODE = "OBS"
SCENARIO_NAME = "Mesures ABH"
RUN_ID = 1


def _metric_from_ts_id(ts_id: str) -> tuple[str | None, str | None]:
    if "|" not in ts_id:
        return None, None
    station_id, metric = ts_id.split("|", 1)
    if metric not in {"p_max", "p_annuelle"}:
        return None, None
    return station_id, metric


def _datetime_expression():
    return "make_date(annee, 1, 1)"


@router.get("/stations")
def climate_stations(db: Session = Depends(get_climate_db)):
    log.info("GET /climate/stations")

    rows = db.execute(
        text(
            """
            SELECT DISTINCT
              d.station_id::text AS station_id,
              COALESCE(NULLIF(d.code_station, ''), p.ire_station) AS station_code,
              COALESCE(NULLIF(d.station_nom, ''), NULLIF(p.station_nom, ''), NULLIF(d.code_station, ''), p.ire_station) AS station_name
            FROM api.v_meteo_precipitation_annuelle_max p
            LEFT JOIN api.v_station_dimension d
              ON d.station_id = p.station_id
            WHERE p.station_id IS NOT NULL
            ORDER BY 3
            """
        )
    ).mappings().all()

    log.info("stations count = %s", len(rows))
    return rows


@router.get("/station-stats")
def climate_station_stats(station_id: str, db: Session = Depends(get_climate_db)):
    log.info("GET /climate/station-stats | station_id=%s", station_id)

    row = db.execute(
        text(
            f"""
            SELECT
              MIN({_datetime_expression()})::date AS dt_min,
              MAX({_datetime_expression()})::date AS dt_max,
              COUNT(*) AS n_rows
            FROM api.v_meteo_precipitation_annuelle_max
            WHERE station_id::text = :station_id
            """
        ),
        {"station_id": station_id},
    ).mappings().first()

    if not row or not row["n_rows"]:
        return []

    stats = [
        {
            "station_id": station_id,
            "source_type": SOURCE_TYPE,
            "scenario_code": SCENARIO_CODE,
            "scenario_name": SCENARIO_NAME,
            "run_id": RUN_ID,
            "property_name": "Précipitation maximale",
            "time_step": "annual",
            "ts_id": f"{station_id}|p_max",
            "dt_min": row["dt_min"].isoformat() if row["dt_min"] else None,
            "dt_max": row["dt_max"].isoformat() if row["dt_max"] else None,
        },
        {
            "station_id": station_id,
            "source_type": SOURCE_TYPE,
            "scenario_code": SCENARIO_CODE,
            "scenario_name": SCENARIO_NAME,
            "run_id": RUN_ID,
            "property_name": "Précipitation annuelle",
            "time_step": "annual",
            "ts_id": f"{station_id}|p_annuelle",
            "dt_min": row["dt_min"].isoformat() if row["dt_min"] else None,
            "dt_max": row["dt_max"].isoformat() if row["dt_max"] else None,
        },
    ]

    log.info("stats rows = %s", len(stats))
    return stats


@router.get("/timeseries")
def climate_timeseries(
    ts_id: str,
    time_step: str,
    date_start: str | None = None,
    date_end: str | None = None,
    db: Session = Depends(get_climate_db),
):
    log.info("GET /climate/timeseries | ts_id=%s | time_step=%s", ts_id, time_step)

    if time_step.lower() != "annual":
        return []

    station_id, metric = _metric_from_ts_id(ts_id)
    if not station_id or not metric:
        return []

    value_column = "p_max" if metric == "p_max" else "p_annuelle"

    rows = db.execute(
        text(
            f"""
            SELECT
              {_datetime_expression()}::date AS datetime,
              {value_column} AS value
            FROM api.v_meteo_precipitation_annuelle_max
            WHERE station_id::text = :station_id
              AND {value_column} IS NOT NULL
              AND (:date_start IS NULL OR {_datetime_expression()}::date >= :date_start::date)
              AND (:date_end IS NULL OR {_datetime_expression()}::date <= :date_end::date)
            ORDER BY datetime
            """
        ),
        {
            "station_id": station_id,
            "date_start": date_start,
            "date_end": date_end,
        },
    ).mappings().all()

    return rows


@router.get("/kpis")
def climate_kpis(
    ts_id: str,
    time_step: str = Query("annual"),
    db: Session = Depends(get_climate_db),
):
    if time_step.lower() != "annual":
        return {"min": None, "max": None, "mean": None}

    station_id, metric = _metric_from_ts_id(ts_id)
    if not station_id or not metric:
        return {"min": None, "max": None, "mean": None}

    value_column = "p_max" if metric == "p_max" else "p_annuelle"

    row = db.execute(
        text(
            f"""
            SELECT
              MIN({value_column}) AS min,
              MAX({value_column}) AS max,
              AVG({value_column}) AS mean
            FROM api.v_meteo_precipitation_annuelle_max
            WHERE station_id::text = :station_id
              AND {value_column} IS NOT NULL
            """
        ),
        {"station_id": station_id},
    ).mappings().one()

    return row


@router.get("/latest")
def climate_latest(
    metric: str = Query("p_annuelle", pattern="^(p_max|p_annuelle)$"),
    date_start: str | None = Query(None),
    date_end: str | None = Query(None),
    db: Session = Depends(get_climate_db),
):
    query = text(
        f"""
        select
          station_id::text as entity_id,
          avg({metric})::double precision as value
        from api.v_meteo_precipitation_annuelle_max
        where station_id is not null
          and {metric} is not null
          and (:date_start is null or make_date(annee, 1, 1) >= :date_start::date)
          and (:date_end is null or make_date(annee, 1, 1) <= :date_end::date)
        group by station_id
        """
    )
    return db.execute(
        query, {"date_start": date_start, "date_end": date_end}
    ).mappings().all()
