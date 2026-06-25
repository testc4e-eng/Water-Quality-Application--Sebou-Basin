# backend/app/services/admin_data_scan_service.py
from __future__ import annotations
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple
from sqlalchemy import text
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

def _table_exists(db: Session, schema: str, table: str) -> bool:
    row = db.execute(
        text(
            """
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = :schema AND table_name = :table
            """
        ),
        {"schema": schema, "table": table},
    ).first()
    return row is not None

def _list_columns(db: Session, schema: str, table: str) -> Set[str]:
    rows = db.execute(
        text(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = :schema AND table_name = :table
            """
        ),
        {"schema": schema, "table": table},
    ).fetchall()
    return {r[0] for r in rows}

def _pick_column(cols: Set[str], candidates: Iterable[str]) -> Optional[str]:
    for col in candidates:
        if col in cols:
            return col
    return None

def _safe_count(db: Session, schema: str, table: str) -> int:
    if not _table_exists(db, schema, table):
        return 0
    try:
        return int(db.execute(text(f'SELECT COUNT(*) FROM "{schema}"."{table}"')).scalar() or 0)
    except Exception as e:
        db.rollback()
        logger.warning(f"Count failed for {schema}.{table}: {e}")
        return 0

def _safe_distinct_count(db: Session, schema: str, table: str, col: Optional[str]) -> int:
    if not col or not _table_exists(db, schema, table):
        return 0
    try:
        return int(
            db.execute(text(f'SELECT COUNT(DISTINCT "{col}") FROM "{schema}"."{table}"')).scalar()
            or 0
        )
    except Exception as e:
        db.rollback()
        logger.warning(f"Distinct count failed for {schema}.{table}.{col}: {e}")
        return 0

def _fetch_full_table(
    db: Session, schema: str, table: str, geom_col: Optional[str] = None
) -> List[Dict[str, Any]]:
    if not _table_exists(db, schema, table):
        return []
    cols = _list_columns(db, schema, table)
    select_cols = [f'"{c}"' for c in cols if c != geom_col]
    if geom_col and geom_col in cols:
        select_cols.append(f'ST_AsGeoJSON("{geom_col}") AS "{geom_col}"')
    col_sql = ", ".join(select_cols) if select_cols else "*"
    try:
        rows = db.execute(text(f'SELECT {col_sql} FROM "{schema}"."{table}"')).mappings().all()
        return [dict(r) for r in rows]
    except Exception as e:
        db.rollback()
        logger.error(f"Fetch failed for {schema}.{table}: {e}")
        return []

def _min_dt(a: Any, b: Any) -> Any:
    if a is None: return b
    if b is None: return a
    return a if a <= b else b

def _max_dt(a: Any, b: Any) -> Any:
    if a is None: return b
    if b is None: return a
    return a if a >= b else b

def _ensure_variable_entry(entity: Dict[str, Any], variable_id: Any, variable_name: Any) -> Dict[str, Any]:
    for item in entity["variables"]:
        if item["variable_id"] == variable_id:
            return item
    entry = {
        "variable_id": variable_id,
        "variable_name": variable_name,
        "record_count": 0,
        "first_record": None,
        "last_record": None,
        "sources": [],
    }
    entity["variables"].append(entry)
    return entry

def _ensure_source_entry(variable_entry: Dict[str, Any], source_id: Any, source_name: Any) -> Dict[str, Any]:
    for item in variable_entry["sources"]:
        if item["source_id"] == source_id:
            return item
    entry = {
        "source_id": source_id,
        "source_name": source_name,
        "record_count": 0,
        "first_record": None,
        "last_record": None,
    }
    variable_entry["sources"].append(entry)
    return entry

def _build_legacy_station_union(db: Session, station_col: str) -> str:
    """Construit un UNION ALL des tables de mesures identifiées (débit, précipitation, qualité)."""
    configs = [
        ("staging", "mesures_debit_jr", "date_jr", "ire_station", "'Débit'"),
        ("staging", "mesures_precipitations_jr_traitees", "date_jr", "ire_station", "'Précipitation'"),
        ("qualite", "mesure_qualite_riviere", "temps", "ire_station", "parametre_qualite"),
        ("qualite", "mesure_qualite_sebou", "temps", "ire_station", "parametre_qualite"),
    ]

    union_parts: List[str] = []
    for schema, table, time_col, st_id_col, variable_expr in configs:
        if not _table_exists(db, schema, table):
            continue
        union_parts.append(f"""
            SELECT
                "{st_id_col}"::text AS station_id,
                {variable_expr}::text AS variable_name,
                "{time_col}"::timestamp AS ts
            FROM "{schema}"."{table}"
        """)

    return " UNION ALL ".join(union_parts)

def get_data_availability(db: Session, include_time_stats: bool = False) -> Dict[str, Any]:
    """Point d'entrée principal pour l'audit de disponibilité des données."""
    # Le projet Sebou exploite le pivot canonique api.v_station_dimension.
    # Le service reste "legacy" au sens fonctionnel (scan de disponibilité),
    # mais il ne doit plus dépendre des anciennes tables public.*.
    return _legacy_data_scan(db, include_time_stats)

def _legacy_data_scan(db: Session, include_time_stats: bool = False) -> Dict[str, Any]:
    """Scan adapté à l'infrastructure réelle du Sebou (infra/staging/qualite)."""
    station_schema = "api"
    station_table = "v_station_dimension"

    station_id_col = "station_id"
    station_join_expr = 'COALESCE(s."legacy_code_station", s."code_station")'
    station_name_col = "station_nom"
    station_type_col = "type_station"

    union_sql = _build_legacy_station_union(db, station_id_col)
    if not union_sql:
        union_sql = "SELECT NULL::text AS station_id, NULL::text AS variable_name, NULL::timestamp AS ts WHERE 1=0"

    # 1. Résumé global
    summary = {
        "total_stations": _safe_count(db, station_schema, station_table),
        "total_basins": _safe_count(db, "geo", "bassin_versant") or _safe_count(db, "api", "v_bassin_geojson") or 1,
        "total_variables": 0,
        "total_sources": 0,
        "total_records": 0,
        "stations_with_data": 0,
        "basins_with_data": 0,
        "available_variables": [],
        "available_sources": [],
        "variable_time_stats": [],
    }

    # Calcul des stats via l'union
    try:
        stats_res = db.execute(text(f"""
            SELECT 
                COUNT(*) AS total, 
                COUNT(DISTINCT station_id) AS st_count,
                COUNT(DISTINCT variable_name) AS var_count
            FROM ({union_sql}) AS u
        """)).fetchone()
        if stats_res:
            summary["total_records"] = int(stats_res[0] or 0)
            summary["stations_with_data"] = int(stats_res[1] or 0)
            summary["total_variables"] = int(stats_res[2] or 0)
    except Exception as e:
        db.rollback()
        logger.error(f"Erreur calcul stats union : {e}")

    # 2. Variables disponibles
    try:
        var_rows = db.execute(text(f"SELECT DISTINCT variable_name FROM ({union_sql}) AS u WHERE variable_name IS NOT NULL ORDER BY 1")).fetchall()
        summary["available_variables"] = [{"name": r[0]} for r in var_rows]
    except Exception:
        db.rollback()

    # 3. Répartition par type de station
    station_type_expr = f'COALESCE("{station_type_col}", \'Inconnu\')'
    stations_by_type = []
    try:
        stations_by_type = db.execute(
            text(
                f"""
                WITH station_measurements AS ({union_sql})
                SELECT
                    {station_type_expr} AS station_type,
                    COUNT(DISTINCT s."{station_id_col}") AS station_count,
                    COUNT(sm.station_id) AS record_count,
                    COUNT(DISTINCT sm.variable_name) AS variable_count,
                    0 AS source_count,
                    MIN(sm.ts) AS first_record,
                    MAX(sm.ts) AS last_record
                FROM "{station_schema}"."{station_table}" s
                LEFT JOIN station_measurements sm ON sm.station_id = {station_join_expr}::text
                WHERE {station_join_expr} IS NOT NULL
                GROUP BY {station_type_expr}
                ORDER BY station_type
                """
            )
        ).mappings().all()
        stations_by_type = [dict(r) for r in stations_by_type]
    except Exception as e:
        db.rollback()
        logger.error(f"Erreur stations_by_type : {e}")

    # 4. Entités Stations (Détail)
    station_map: Dict[str, Any] = {}
    try:
        station_rows = db.execute(
            text(
                f'''
                SELECT
                    "{station_id_col}"::text AS station_uuid,
                    COALESCE("legacy_code_station", "code_station")::text AS station_ref,
                    "{station_name_col}" AS station_name,
                    {station_type_expr} AS type
                FROM "{station_schema}"."{station_table}"
                WHERE COALESCE("legacy_code_station", "code_station") IS NOT NULL
                '''
            )
        ).fetchall()
        for station_uuid, station_ref, sname, stype in station_rows:
            station_map[str(station_ref)] = {
                "station_id": station_uuid,
                "station_code": station_ref,
                "station_name": sname or station_ref,
                "station_type": stype,
                "total_records": 0, "variable_count": 0, "source_count": 0,
                "first_record": None, "last_record": None, "variables": [],
            }
        
        # Hydratation avec les stats réelles
        stats_rows = db.execute(text(f"SELECT station_id, variable_name, COUNT(*) as cnt, MIN(ts) as mi, MAX(ts) as ma FROM ({union_sql}) AS u GROUP BY 1, 2")).mappings().all()
        for row in stats_rows:
            sid = str(row["station_id"])
            if sid in station_map:
                entity = station_map[sid]
                entity["total_records"] += int(row["cnt"] or 0)
                entity["first_record"] = _min_dt(entity["first_record"], row["mi"])
                entity["last_record"] = _max_dt(entity["last_record"], row["ma"])
                
                v_entry = _ensure_variable_entry(entity, row["variable_name"], row["variable_name"])
                v_entry["record_count"] += int(row["cnt"] or 0)
                v_entry["first_record"] = _min_dt(v_entry["first_record"], row["mi"])
                v_entry["last_record"] = _max_dt(v_entry["last_record"], row["ma"])
        
        for e in station_map.values():
            e["variable_count"] = len(e["variables"])
    except Exception as e:
        db.rollback()
        logger.error(f"Erreur hydration stations : {e}")

    # 5. Données géographiques pour la carte
    barrages_full = _fetch_full_table(db, "api", "v_barrage_dimension", geom_col="geom")
    basins_full = _fetch_full_table(db, "api", "v_bassin_geojson", geom_col="geom")

    # 6. Statistiques temporelles (Optionnel)
    if include_time_stats:
        try:
            summary["variable_time_stats"] = db.execute(text(f"""
                WITH ordered AS (
                    SELECT
                        station_id, variable_name, ts,
                        EXTRACT(EPOCH FROM (ts - LAG(ts) OVER (PARTITION BY station_id, variable_name ORDER BY ts))) AS step_seconds
                    FROM ({union_sql}) AS u
                )
                SELECT
                    variable_name AS variable_id, variable_name AS variable_name,
                    COUNT(*) AS record_count, COUNT(DISTINCT station_id) AS entity_count,
                    MIN(ts) AS first_record, MAX(ts) AS last_record,
                    MIN(step_seconds) AS min_step_seconds,
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY step_seconds) AS median_step_seconds,
                    MAX(step_seconds) AS max_step_seconds
                FROM ordered WHERE step_seconds IS NOT NULL
                GROUP BY variable_name ORDER BY record_count DESC
            """)).mappings().all()
        except Exception:
            db.rollback()

    return {
        "stations": stations_by_type,
        "basins": [], # Géré via basins_full
        "station_entities": list(station_map.values()),
        "basin_entities": [],
        "basins_full": basins_full,
        "barrages_full": barrages_full,
        "summary": summary,
    }
