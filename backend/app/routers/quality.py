from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.climate_database import get_climate_db

router = APIRouter()

@router.get("/inventory")
def get_quality_inventory(db: Session = Depends(get_climate_db)):
    rows_points = db.execute(text("""
        SELECT
          'Points d''eau' AS source,
          COALESCE(utilisation, nature, 'Point d''eau') AS source_type,
          'N/A' AS parameter,
          COALESCE(nom_pt_eau, code_pt_eau, 'Point d''eau') AS source_name,
          COALESCE(foyer_pollution, '') AS location,
          COALESCE(to_char(date_realisation, 'YYYY'), '') AS period,
          1 AS entities,
          COALESCE(vol_preleve_m3_an, niv_piezometrique_m, 0) AS measured_value,
          CASE
            WHEN vol_preleve_m3_an IS NOT NULL THEN 'm3/an'
            WHEN niv_piezometrique_m IS NOT NULL THEN 'm'
            ELSE ''
          END AS unit,
          CASE
            WHEN qa_flag_invalid_geom THEN 'Elevee'
            WHEN qa_flag_missing_geom THEN 'Moyenne'
            ELSE 'Faible'
          END AS pressure,
          CASE
            WHEN qa_flag_invalid_geom THEN 'A verifier'
            WHEN qa_flag_missing_geom THEN 'Surveillance'
            ELSE 'Actif'
          END AS status
        FROM api.v_points_eau
    """)).mappings().all()

    rows_step = db.execute(text("""
        SELECT
          'Industrie' AS source,
          'STEP industrielle' AS source_type,
          'N/A' AS parameter,
          COALESCE(nom_step, code_step, 'STEP') AS source_name,
          COALESCE(commune_nom, '') AS location,
          COALESCE(to_char(created_at, 'YYYY'), '') AS period,
          1 AS entities,
          0::double precision AS measured_value,
          '' AS unit,
          CASE
            WHEN qa_flag_invalid_geom THEN 'Elevee'
            WHEN qa_flag_missing_geom THEN 'Moyenne'
            ELSE 'Faible'
          END AS pressure,
          CASE
            WHEN qa_flag_invalid_geom THEN 'A verifier'
            WHEN qa_flag_missing_geom THEN 'Surveillance'
            ELSE 'Actif'
          END AS status
        FROM api.v_step_industrielles
    """)).mappings().all()

    rows_stm = db.execute(text("""
        SELECT
          'STM' AS source,
          'STM' AS source_type,
          'N/A' AS parameter,
          COALESCE(nom_stm, code_stm, 'STM') AS source_name,
          COALESCE(commune_nom, '') AS location,
          COALESCE(to_char(created_at, 'YYYY'), '') AS period,
          1 AS entities,
          0::double precision AS measured_value,
          '' AS unit,
          CASE
            WHEN qa_flag_invalid_geom THEN 'Elevee'
            WHEN qa_flag_missing_geom THEN 'Moyenne'
            ELSE 'Faible'
          END AS pressure,
          CASE
            WHEN qa_flag_invalid_geom THEN 'A verifier'
            WHEN qa_flag_missing_geom THEN 'Surveillance'
            ELSE 'Actif'
          END AS status
        FROM api.v_stm
    """)).mappings().all()

    return (rows_points or []) + (rows_step or []) + (rows_stm or [])

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
