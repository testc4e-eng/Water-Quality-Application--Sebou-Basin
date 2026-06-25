# backend/app/routers/entities.py
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal
from app.util_dbmeta import table_exists

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------- Stations -------
@router.get("/stations", summary="Stations (format simple)")
def get_stations(db: Session = Depends(get_db)):
    sql = text("""
    SELECT
        COALESCE(station_id::text, legacy_station_id::text, code_station)::text AS id,
        COALESCE(NULLIF(TRIM(station_nom), ''), NULLIF(TRIM(code_station), ''), NULLIF(TRIM(legacy_code_station), '')) AS name,
        NULL::text AS river,
        COALESCE(latitude, ST_Y(geom::geometry))::float8 AS lat,
        COALESCE(longitude, ST_X(geom::geometry))::float8 AS lon
    FROM api.v_station_dimension
    WHERE geom IS NOT NULL OR (longitude IS NOT NULL AND latitude IS NOT NULL)
""")

    try:
        rows = db.execute(sql).fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    out: List[Dict[str, Any]] = []
    for r in rows:
        out.append({
            "id": r.id,
            "name": r.name,
            "river": None,
            "lat": float(r.lat) if r.lat is not None else None,
            "lon": float(r.lon) if r.lon is not None else None,
        })
    return out

# ------- Barrages -------
@router.get("/barrages", summary="Barrages (format simple)")
def get_barrages(db: Session = Depends(get_db)):
    sql = text("""
        SELECT
            id::int AS id,
            ire::text AS ire,
            COALESCE(nom_barrage,'') AS nom_barrage,
            nom_oued::text,
            statut::text,
            type_barrage::text,
            vrn_hm3::float8,
            hauteur::float8,
            apports_hm::float8,
            mise_en_se::text,
            coord_x::float8,
            coord_y::float8
        FROM infra.barrages
    """)
    try:
        rows = db.execute(sql).fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    out: List[Dict[str, Any]] = []
    for r in rows:
        out.append({
            "id": int(r.id),
            "ire": r.ire,
            "nom_barrage": r.nom_barrage,
            "nom_oued": r.nom_oued,
            "statut": r.statut,
            "type_barrage": r.type_barrage,
            "vrn_hm3": float(r.vrn_hm3) if r.vrn_hm3 is not None else None,
            "hauteur": float(r.hauteur) if r.hauteur is not None else None,
            "apports_hm": float(r.apports_hm) if r.apports_hm is not None else None,
            "mise_en_se": r.mise_en_se,
            "coord_x": float(r.coord_x) if r.coord_x is not None else None,
            "coord_y": float(r.coord_y) if r.coord_y is not None else None,
        })
    return out


@router.get("/barrages/{barrage_id}/quality-parameters", summary="Parametres qualite barrage")
def get_barrage_quality_parameters(
    barrage_id: int,
    include_invalid: bool = Query(False),
    include_flagged: bool = Query(False),
    db: Session = Depends(get_db),
):
    query = text("""
        WITH barrage AS (
            SELECT NULLIF(TRIM(ire), '') AS ire
            FROM infra.barrages
            WHERE id = :barrage_id
        )
        SELECT
            mqb.parametre_qualite::text AS parameter,
            MIN(mqb.temps)::date AS date_min,
            MAX(mqb.temps)::date AS date_max
        FROM qualite.mesure_qualite_barrage mqb
        INNER JOIN barrage b
            ON b.ire IS NOT NULL
           AND mqb.ire_station = b.ire
        WHERE NULLIF(TRIM(mqb.parametre_qualite), '') IS NOT NULL
          AND (:include_invalid = true OR COALESCE(mqb.est_valide, true) = true)
          AND (
                :include_flagged = true
                OR (
                    COALESCE(mqb.qa_flag_null_value, false) = false
                    AND COALESCE(mqb.qa_flag_negative, false) = false
                    AND COALESCE(mqb.qa_flag_param_missing, false) = false
                    AND COALESCE(mqb.qa_flag_station_unmapped, false) = false
                )
          )
        GROUP BY mqb.parametre_qualite
        ORDER BY mqb.parametre_qualite
    """)
    try:
        rows = db.execute(
            query,
            {
                "barrage_id": barrage_id,
                "include_invalid": include_invalid,
                "include_flagged": include_flagged,
            },
        ).mappings().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")
    return rows


@router.get("/barrages/{barrage_id}/quality-series", summary="Serie temporelle qualite barrage")
def get_barrage_quality_series(
    barrage_id: int,
    aggregation: str = Query("raw"),
    date_start: str = Query(""),
    date_end: str = Query(""),
    parameter: str = Query(...),
    parameter_secondary: Optional[str] = Query(None),
    include_invalid: bool = Query(False),
    include_flagged: bool = Query(False),
    db: Session = Depends(get_db),
):
    if aggregation not in {"raw", "monthly", "annual"}:
        raise HTTPException(status_code=400, detail="Aggregation invalide")

    if aggregation == "monthly":
        datetime_expr = "date_trunc('month', mqb.temps)::date"
        group_expr = "date_trunc('month', mqb.temps)::date, mqb.parametre_qualite"
    elif aggregation == "annual":
        datetime_expr = "date_trunc('year', mqb.temps)::date"
        group_expr = "date_trunc('year', mqb.temps)::date, mqb.parametre_qualite"
    else:
        datetime_expr = "mqb.temps::date"
        group_expr = "mqb.temps::date, mqb.parametre_qualite"

    query = text(f"""
        WITH barrage AS (
            SELECT NULLIF(TRIM(ire), '') AS ire
            FROM infra.barrages
            WHERE id = :barrage_id
        )
        SELECT
            {datetime_expr} AS datetime,
            mqb.parametre_qualite::text AS parameter,
            AVG(mqb.valeur)::float8 AS value
        FROM qualite.mesure_qualite_barrage mqb
        INNER JOIN barrage b
            ON b.ire IS NOT NULL
           AND mqb.ire_station = b.ire
        WHERE mqb.valeur IS NOT NULL
          AND mqb.parametre_qualite = ANY(:parameters)
          AND (:date_start = '' OR mqb.temps >= CAST(:date_start AS date))
          AND (:date_end = '' OR mqb.temps <= CAST(:date_end AS date))
          AND (:include_invalid = true OR COALESCE(mqb.est_valide, true) = true)
          AND (
                :include_flagged = true
                OR (
                    COALESCE(mqb.qa_flag_null_value, false) = false
                    AND COALESCE(mqb.qa_flag_negative, false) = false
                    AND COALESCE(mqb.qa_flag_param_missing, false) = false
                    AND COALESCE(mqb.qa_flag_station_unmapped, false) = false
                )
          )
        GROUP BY {group_expr}
        ORDER BY datetime, mqb.parametre_qualite
    """)

    parameters = [parameter]
    if parameter_secondary and parameter_secondary != parameter:
        parameters.append(parameter_secondary)

    try:
        rows = db.execute(
            query,
            {
                "barrage_id": barrage_id,
                "parameters": parameters,
                "date_start": date_start or "",
                "date_end": date_end or "",
                "include_invalid": include_invalid,
                "include_flagged": include_flagged,
            },
        ).mappings().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    return rows

# ------- Alerts (placeholder) -------
@router.get("/alerts", summary="Alertes")
def get_alerts():
    # Branchez vos vraies alertes ici. On renvoie une liste vide pour éviter les 404.
    return []


@router.get("/entity/{entity_id}/data", summary="Données série temporelle d'une entité")
def get_entity_data(
    entity_id: str,
    layer_key: Optional[str] = Query(None),
    date_start: Optional[str] = Query(None),
    date_end: Optional[str] = Query(None),
    limit: int = Query(2000, ge=1, le=20000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """
    Endpoint générique pour alimenter le panneau droit (séries + mesures) selon le type d'entité.
    """
    lk = (layer_key or "").strip().lower()
    sql_parts: List[str] = []
    params: Dict[str, Any] = {
        "entity_id": entity_id,
        "date_start": date_start,
        "date_end": date_end,
        "limit_plus_one": limit + 1,
        "offset": offset,
    }

    def _with_date(expr: str) -> str:
        return f"""
        SELECT source_table, ts, parameter, value, unit
        FROM (
        {expr}
        ) _q
        WHERE (:date_start IS NULL OR _q.ts >= CAST(:date_start AS date))
          AND (:date_end IS NULL OR _q.ts < (CAST(:date_end AS date) + interval '1 day'))
        """

    # Station-based
    if lk in ("", "stations_abhs", "stations"):
        if table_exists("hydro.mesure_debit"):
            sql_parts.append(
                _with_date(
                    """
                    SELECT 'hydro.mesure_debit'::text AS source_table, temps AS ts, 'DEBIT'::text AS parameter,
                           valeur::double precision AS value, 'm3/s'::text AS unit
                    FROM hydro.mesure_debit
                    WHERE station_id::text = :entity_id AND valeur IS NOT NULL
                    """
                )
            )
        if table_exists("meteo.mesure_evaporation"):
            sql_parts.append(
                _with_date(
                    """
                    SELECT 'meteo.mesure_evaporation'::text AS source_table, temps AS ts, 'EVAPO'::text AS parameter,
                           valeur::double precision AS value, 'mm'::text AS unit
                    FROM meteo.mesure_evaporation
                    WHERE station_id::text = :entity_id AND valeur IS NOT NULL
                    """
                )
            )
        if table_exists("meteo.mesure_precipitation"):
            sql_parts.append(
                _with_date(
                    """
                    SELECT 'meteo.mesure_precipitation'::text AS source_table, temps AS ts, 'PRECIP'::text AS parameter,
                           val_remplies::double precision AS value, 'mm'::text AS unit
                    FROM meteo.mesure_precipitation
                    WHERE station_id::text = :entity_id AND val_remplies IS NOT NULL
                    """
                )
            )
        if table_exists("meteo.mesure_temperature"):
            sql_parts.append(
                _with_date(
                    """
                    SELECT 'meteo.mesure_temperature'::text AS source_table, temps AS ts, 'TEMP_MOY'::text AS parameter,
                           val_moy::double precision AS value, '°C'::text AS unit
                    FROM meteo.mesure_temperature
                    WHERE station_id::text = :entity_id AND val_moy IS NOT NULL
                    """
                )
            )
        for t in (
            "qualite.mesure_qualite_riviere",
            "qualite.mesure_qualite_barrage",
            "qualite.mesure_qualite_sebou",
            "qualite.mesure_qualite_nappe",
        ):
            if table_exists(t):
                sql_parts.append(
                    _with_date(
                        f"""
                        SELECT '{t}'::text AS source_table, temps AS ts, parametre_qualite::text AS parameter,
                               valeur::double precision AS value, NULL::text AS unit
                        FROM {t}
                        WHERE station_id::text = :entity_id AND valeur IS NOT NULL
                        """
                    )
                )

    # Barrage
    if lk in ("barrages_abhs", "barrages") and table_exists("hydro.mesure_barrage_param"):
        sql_parts.append(
            _with_date(
                """
                SELECT 'hydro.mesure_barrage_param'::text AS source_table,
                       temps AS ts,
                       parametre_code::text AS parameter,
                       valeur::double precision AS value,
                       unite::text AS unit
                FROM hydro.mesure_barrage_param
                WHERE barrage_id::text = :entity_id AND valeur IS NOT NULL
                """
            )
        )

    # Source eau
    if lk == "sources" and table_exists("hydro.mesure_debit_source"):
        sql_parts.append(
            _with_date(
                """
                SELECT 'hydro.mesure_debit_source'::text AS source_table, temps AS ts, 'DEBIT_SOURCE'::text AS parameter,
                       valeur_m3s::double precision AS value, 'm3/s'::text AS unit
                FROM hydro.mesure_debit_source
                WHERE source_id::text = :entity_id AND valeur_m3s IS NOT NULL
                """
            )
        )

    # WASP segment
    if lk == "reseau_hydro_abhs" and table_exists("wasp_output.mesure_qualite_segment_ts"):
        sql_parts.append(
            _with_date(
                """
                SELECT 'wasp_output.mesure_qualite_segment_ts'::text AS source_table, ts_utc AS ts,
                       code_parametre::text AS parameter, valeur::double precision AS value, unite::text AS unit
                FROM wasp_output.mesure_qualite_segment_ts
                WHERE reseau_id::text = :entity_id AND valeur IS NOT NULL
                """
            )
        )

    # SWAT subbasin
    if lk == "sous_bassins_swat" and table_exists("swat_output.mesure_qualite_subbasin_ts"):
        sql_parts.append(
            _with_date(
                """
                SELECT 'swat_output.mesure_qualite_subbasin_ts'::text AS source_table, temps AS ts,
                       param_code::text AS parameter, valeur::double precision AS value, NULL::text AS unit
                FROM swat_output.mesure_qualite_subbasin_ts
                WHERE subbasin_uid::text = :entity_id AND valeur IS NOT NULL
                """
            )
        )

    if not sql_parts:
        return {"entity_id": entity_id, "layer_key": lk, "rows": [], "count": 0}

    union_sql = "\nUNION ALL\n".join(sql_parts)
    final_sql = text(
        f"""
        SELECT source_table, ts, parameter, value, unit
        FROM ({union_sql}) q
        ORDER BY ts DESC
        OFFSET :offset
        LIMIT :limit_plus_one
        """
    )
    raw_rows = db.execute(final_sql, params).mappings().all()
    has_more = len(raw_rows) > limit
    rows = raw_rows[:limit]
    return {
        "entity_id": entity_id,
        "layer_key": lk,
        "rows": rows,
        "count": len(rows),
        "offset": offset,
        "limit": limit,
        "has_more": has_more,
    }
