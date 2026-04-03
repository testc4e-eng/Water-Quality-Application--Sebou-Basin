from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.climate_database import get_climate_db

router = APIRouter(tags=["hydro"])


@router.get("/stations")
def stations(db: Session = Depends(get_climate_db)):
    return db.execute(text("""
        WITH s AS (
          SELECT
            station_id,
            code_station,
            station_nom,
            row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
          FROM api.v_station_dimension
          WHERE station_nom IS NOT NULL
        )
        SELECT DISTINCT
          s.station_num AS station_id,
          s.code_station AS station_code,
          s.station_nom AS station_name
        FROM api.v_hydro_debit_mensuel h
        JOIN s ON h.station_id = s.station_id
        ORDER BY station_name
    """)).mappings().all()


@router.get("/stats")
def station_stats(station_id: int, db: Session = Depends(get_climate_db)):
    return db.execute(text("""
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
          'debit' AS property_name,
          'monthly' AS time_step,
          s.station_num AS ts_id,
          MIN(h.bucket_month)::date AS dt_min,
          MAX(h.bucket_month)::date AS dt_max
        FROM api.v_hydro_debit_mensuel h
        JOIN s ON h.station_id = s.station_id
        WHERE s.station_num = :station_id
        GROUP BY s.station_num
        ORDER BY s.station_num
    """), {"station_id": station_id}).mappings().all()


@router.get("/timeseries")
def hydro_timeseries(
    ts_id: int,
    aggregation: str,
    date_start: str,
    date_end: str,
    db: Session = Depends(get_climate_db),
):
    agg = aggregation.lower()
    if agg not in {"monthly", "annual", "daily", "instantaneous"}:
        raise HTTPException(400, "Invalid aggregation")

    if agg in {"daily", "instantaneous"}:
        agg = "monthly"

    if agg == "annual":
        sql = """
            WITH s AS (
              SELECT
                station_id,
                row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
              FROM api.v_station_dimension
              WHERE station_nom IS NOT NULL
            )
            SELECT
              date_trunc('year', h.bucket_month)::date AS datetime,
              AVG(h.valeur_moy_m3s) AS value
            FROM api.v_hydro_debit_mensuel h
            JOIN s ON h.station_id = s.station_id
            WHERE s.station_num = :ts_id
              AND (:date_start IS NULL OR h.bucket_month >= :date_start::date)
              AND (:date_end IS NULL OR h.bucket_month <= :date_end::date)
            GROUP BY date_trunc('year', h.bucket_month)
            ORDER BY datetime
        """
    else:
        sql = """
            WITH s AS (
              SELECT
                station_id,
                row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
              FROM api.v_station_dimension
              WHERE station_nom IS NOT NULL
            )
            SELECT
              h.bucket_month::date AS datetime,
              h.valeur_moy_m3s AS value
            FROM api.v_hydro_debit_mensuel h
            JOIN s ON h.station_id = s.station_id
            WHERE s.station_num = :ts_id
              AND (:date_start IS NULL OR h.bucket_month >= :date_start::date)
              AND (:date_end IS NULL OR h.bucket_month <= :date_end::date)
            ORDER BY h.bucket_month
        """

    return db.execute(
        text(sql),
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
    agg = aggregation.lower()
    if agg not in {"monthly", "annual", "daily", "instantaneous"}:
        raise HTTPException(400, "Invalid aggregation")
    if agg in {"daily", "instantaneous"}:
        agg = "monthly"

    if agg == "annual":
        sql = """
            WITH s AS (
              SELECT
                station_id,
                row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
              FROM api.v_station_dimension
              WHERE station_nom IS NOT NULL
            ),
            series AS (
              SELECT
                date_trunc('year', h.bucket_month)::date AS datetime,
                AVG(h.valeur_moy_m3s) AS value
              FROM api.v_hydro_debit_mensuel h
              JOIN s ON h.station_id = s.station_id
              WHERE s.station_num = :ts_id
                AND (:date_start IS NULL OR h.bucket_month >= :date_start::date)
                AND (:date_end IS NULL OR h.bucket_month <= :date_end::date)
              GROUP BY date_trunc('year', h.bucket_month)
            )
            SELECT MIN(value) AS min, MAX(value) AS max, AVG(value) AS mean FROM series
        """
    else:
        sql = """
            WITH s AS (
              SELECT
                station_id,
                row_number() OVER (ORDER BY station_nom NULLS LAST, station_id) AS station_num
              FROM api.v_station_dimension
              WHERE station_nom IS NOT NULL
            )
            SELECT
              MIN(h.valeur_moy_m3s) AS min,
              MAX(h.valeur_moy_m3s) AS max,
              AVG(h.valeur_moy_m3s) AS mean
            FROM api.v_hydro_debit_mensuel h
            JOIN s ON h.station_id = s.station_id
            WHERE s.station_num = :ts_id
              AND (:date_start IS NULL OR h.bucket_month >= :date_start::date)
              AND (:date_end IS NULL OR h.bucket_month <= :date_end::date)
        """

    return db.execute(
        text(sql),
        {
            "ts_id": ts_id,
            "date_start": date_start,
            "date_end": date_end,
        }
    ).mappings().first()
