from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional, Set, Tuple

from sqlalchemy import text
from sqlalchemy.orm import Session


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
    return int(db.execute(text(f"SELECT COUNT(*) FROM {schema}.{table}")).scalar() or 0)


def _safe_distinct_count(db: Session, schema: str, table: str, col: Optional[str]) -> int:
    if not col or not _table_exists(db, schema, table):
        return 0
    return int(
        db.execute(text(f"SELECT COUNT(DISTINCT {col}) FROM {schema}.{table}")).scalar()
        or 0
    )


def _resolve_station_columns(db: Session) -> Dict[str, Optional[str]]:
    if not _table_exists(db, "geo", "station"):
        return {"id": None, "name": None, "type": None}
    cols = _list_columns(db, "geo", "station")
    return {
        "id": _pick_column(cols, ["id", "station_id", "code", "station_code"]),
        "name": _pick_column(cols, ["name", "station_name", "nom", "libelle"]),
        "type": _pick_column(cols, ["station_type", "type_station", "type", "categorie"]),
    }


def _resolve_basin_columns(db: Session) -> Dict[str, Optional[str]]:
    if not _table_exists(db, "geo", "basin"):
        return {"id": None, "name": None, "group": None}
    cols = _list_columns(db, "geo", "basin")
    return {
        "id": _pick_column(cols, ["id", "basin_id", "code", "basin_code"]),
        "name": _pick_column(cols, ["name", "basin_name", "nom", "libelle"]),
        "group": _pick_column(cols, ["basin_group", "group_name", "niveau", "level"]),
    }


def _resolve_measurement_columns(db: Session, schema: str, table: str) -> Dict[str, Optional[str]]:
    if not _table_exists(db, schema, table):
        return {"station_id": None, "basin_id": None, "variable_id": None, "source_id": None, "time": None}
    cols = _list_columns(db, schema, table)
    return {
        "station_id": _pick_column(cols, ["station_id", "id_station", "station_code"]),
        "basin_id": _pick_column(cols, ["basin_id", "id_basin", "basin_code"]),
        "variable_id": _pick_column(cols, ["variable_id", "id_variable", "var_id"]),
        "source_id": _pick_column(cols, ["source_id", "id_source", "src_id"]),
        "time": _pick_column(cols, ["date", "datetime", "timestamp", "time", "date_time", "dt"]),
    }


def _resolve_variable_columns(db: Session) -> Dict[str, Optional[str]]:
    if not _table_exists(db, "ref", "variable"):
        return {"id": None, "name": None, "code": None}
    cols = _list_columns(db, "ref", "variable")
    return {
        "id": _pick_column(cols, ["id", "variable_id", "code"]),
        "name": _pick_column(cols, ["name", "label", "variable_name", "nom", "libelle"]),
        "code": _pick_column(cols, ["code", "short_name", "abbrev"]),
    }


def _resolve_source_columns(db: Session) -> Dict[str, Optional[str]]:
    if not _table_exists(db, "ref", "source"):
        return {"id": None, "name": None, "code": None}
    cols = _list_columns(db, "ref", "source")
    return {
        "id": _pick_column(cols, ["id", "source_id", "code"]),
        "name": _pick_column(cols, ["name", "label", "source_name", "nom", "libelle"]),
        "code": _pick_column(cols, ["code", "short_name", "abbrev"]),
    }


def _build_available_items_query(
    table_schema: str,
    table_name: str,
    id_col: str,
    name_col: Optional[str],
    code_col: Optional[str],
    union_sql: str,
    union_col: str,
) -> str:
    name_expr = f", t.{name_col} AS name" if name_col else ", NULL AS name"
    code_expr = f", t.{code_col} AS code" if code_col else ", NULL AS code"
    return f"""
        SELECT DISTINCT t.{id_col} AS id{name_expr}{code_expr}
        FROM {table_schema}.{table_name} t
        JOIN ({union_sql}) u ON u.{union_col} = t.{id_col}
        ORDER BY t.{id_col}
    """


def get_data_availability(db: Session, include_time_stats: bool = False) -> Dict[str, Any]:
    if not _table_exists(db, "geo", "station") and _table_exists(db, "public", "stations_abhs"):
        return _legacy_data_scan(db, include_time_stats)

    station_cols = _resolve_station_columns(db)
    basin_cols = _resolve_basin_columns(db)
    variable_cols = _resolve_variable_columns(db)
    source_cols = _resolve_source_columns(db)

    meas_cols = _resolve_measurement_columns(db, "ts", "measurement")
    basin_meas_cols = _resolve_measurement_columns(db, "ts", "basin_measurement")

    summary = {
        "total_stations": _safe_count(db, "geo", "station"),
        "total_basins": _safe_count(db, "geo", "basin"),
        "total_variables": _safe_count(db, "ref", "variable"),
        "total_sources": _safe_count(db, "ref", "source"),
        "total_records": _safe_count(db, "ts", "measurement")
        + _safe_count(db, "ts", "basin_measurement"),
        "stations_with_data": _safe_distinct_count(
            db, "ts", "measurement", meas_cols["station_id"]
        ),
        "basins_with_data": _safe_distinct_count(
            db, "ts", "basin_measurement", basin_meas_cols["basin_id"]
        ),
        "available_variables": [],
        "available_sources": [],
        "variable_time_stats": [],
    }

    available_vars_union_parts: List[str] = []
    if _table_exists(db, "ts", "measurement") and meas_cols["variable_id"]:
        available_vars_union_parts.append(
            f"SELECT DISTINCT {meas_cols['variable_id']} AS variable_id FROM ts.measurement"
        )
    if _table_exists(db, "ts", "basin_measurement") and basin_meas_cols["variable_id"]:
        available_vars_union_parts.append(
            f"SELECT DISTINCT {basin_meas_cols['variable_id']} AS variable_id FROM ts.basin_measurement"
        )

    if available_vars_union_parts and variable_cols["id"]:
        union_sql = " UNION ".join(available_vars_union_parts)
        vars_query = _build_available_items_query(
            "ref",
            "variable",
            variable_cols["id"],
            variable_cols["name"],
            variable_cols["code"],
            union_sql,
            "variable_id",
        )
        summary["available_variables"] = db.execute(text(vars_query)).mappings().all()

    available_sources_union_parts: List[str] = []
    if _table_exists(db, "ts", "measurement") and meas_cols["source_id"]:
        available_sources_union_parts.append(
            f"SELECT DISTINCT {meas_cols['source_id']} AS source_id FROM ts.measurement"
        )
    if _table_exists(db, "ts", "basin_measurement") and basin_meas_cols["source_id"]:
        available_sources_union_parts.append(
            f"SELECT DISTINCT {basin_meas_cols['source_id']} AS source_id FROM ts.basin_measurement"
        )

    if available_sources_union_parts and source_cols["id"]:
        union_sql = " UNION ".join(available_sources_union_parts)
        sources_query = _build_available_items_query(
            "ref",
            "source",
            source_cols["id"],
            source_cols["name"],
            source_cols["code"],
            union_sql,
            "source_id",
        )
        summary["available_sources"] = db.execute(text(sources_query)).mappings().all()

    stations_by_type: List[Dict[str, Any]] = []
    if (
        _table_exists(db, "geo", "station")
        and _table_exists(db, "ts", "measurement")
        and station_cols["id"]
        and meas_cols["station_id"]
    ):
        station_type_expr = (
            f"COALESCE(s.{station_cols['type']}, 'Inconnu')"
            if station_cols["type"]
            else "'Inconnu'"
        )
        time_select = (
            f"MIN(m.{meas_cols['time']}) AS first_record, MAX(m.{meas_cols['time']}) AS last_record"
            if meas_cols["time"]
            else "NULL AS first_record, NULL AS last_record"
        )
        var_count_expr = (
            f"COUNT(DISTINCT m.{meas_cols['variable_id']})"
            if meas_cols["variable_id"]
            else "0"
        )
        source_count_expr = (
            f"COUNT(DISTINCT m.{meas_cols['source_id']})"
            if meas_cols["source_id"]
            else "0"
        )
        stations_by_type = db.execute(
            text(
                f"""
                SELECT
                    {station_type_expr} AS station_type,
                    COUNT(DISTINCT s.{station_cols['id']}) AS station_count,
                    COUNT(m.{meas_cols['station_id']}) AS record_count,
                    {var_count_expr} AS variable_count,
                    {source_count_expr} AS source_count,
                    {time_select}
                FROM geo.station s
                LEFT JOIN ts.measurement m
                  ON m.{meas_cols['station_id']} = s.{station_cols['id']}
                GROUP BY {station_type_expr}
                ORDER BY station_type
                """
            )
        ).mappings().all()

    basins_summary: List[Dict[str, Any]] = []
    if (
        _table_exists(db, "geo", "basin")
        and _table_exists(db, "ts", "basin_measurement")
        and basin_cols["id"]
        and basin_meas_cols["basin_id"]
    ):
        basin_group_expr = (
            f"COALESCE(b.{basin_cols['group']}, 'Bassin')"
            if basin_cols["group"]
            else "'Bassin'"
        )
        time_select = (
            f"MIN(m.{basin_meas_cols['time']}) AS first_record, MAX(m.{basin_meas_cols['time']}) AS last_record"
            if basin_meas_cols["time"]
            else "NULL AS first_record, NULL AS last_record"
        )
        var_count_expr = (
            f"COUNT(DISTINCT m.{basin_meas_cols['variable_id']})"
            if basin_meas_cols["variable_id"]
            else "0"
        )
        source_count_expr = (
            f"COUNT(DISTINCT m.{basin_meas_cols['source_id']})"
            if basin_meas_cols["source_id"]
            else "0"
        )
        basins_summary = db.execute(
            text(
                f"""
                SELECT
                    {basin_group_expr} AS basin_group,
                    COUNT(DISTINCT b.{basin_cols['id']}) AS basin_count,
                    COUNT(m.{basin_meas_cols['basin_id']}) AS record_count,
                    {var_count_expr} AS variable_count,
                    {source_count_expr} AS source_count,
                    {time_select}
                FROM geo.basin b
                LEFT JOIN ts.basin_measurement m
                  ON m.{basin_meas_cols['basin_id']} = b.{basin_cols['id']}
                GROUP BY {basin_group_expr}
                ORDER BY basin_group
                """
            )
        ).mappings().all()

    station_entities: List[Dict[str, Any]] = []
    if _table_exists(db, "geo", "station") and station_cols["id"]:
        station_name_expr = (
            f"COALESCE(s.{station_cols['name']}, s.{station_cols['id']})"
            if station_cols["name"]
            else f"CAST(s.{station_cols['id']} AS TEXT)"
        )
        station_type_expr = (
            f"COALESCE(s.{station_cols['type']}, 'Inconnu')"
            if station_cols["type"]
            else "'Inconnu'"
        )
        stations_rows = db.execute(
            text(
                f"""
                SELECT
                    s.{station_cols['id']} AS station_id,
                    {station_name_expr} AS station_name,
                    {station_type_expr} AS station_type
                FROM geo.station s
                ORDER BY station_name
                """
            )
        ).mappings().all()

        station_map: Dict[Any, Dict[str, Any]] = {
            row["station_id"]: {
                "station_id": row["station_id"],
                "station_name": row["station_name"],
                "station_type": row["station_type"],
                "total_records": 0,
                "variable_count": 0,
                "source_count": 0,
                "first_record": None,
                "last_record": None,
                "variables": [],
            }
            for row in stations_rows
        }

        if (
            _table_exists(db, "ts", "measurement")
            and meas_cols["station_id"]
            and meas_cols["variable_id"]
            and meas_cols["source_id"]
        ):
            time_select = (
                f"MIN(m.{meas_cols['time']}) AS first_record, MAX(m.{meas_cols['time']}) AS last_record"
                if meas_cols["time"]
                else "NULL AS first_record, NULL AS last_record"
            )
            var_name_expr = (
                f"v.{variable_cols['name']}"
                if variable_cols["id"] and variable_cols["name"]
                else "CAST(m.{meas_col} AS TEXT)".format(meas_col=meas_cols["variable_id"])
            )
            src_name_expr = (
                f"src.{source_cols['name']}"
                if source_cols["id"] and source_cols["name"]
                else "CAST(m.{meas_col} AS TEXT)".format(meas_col=meas_cols["source_id"])
            )
            var_join = (
                f"LEFT JOIN ref.variable v ON v.{variable_cols['id']} = m.{meas_cols['variable_id']}"
                if variable_cols["id"]
                else ""
            )
            src_join = (
                f"LEFT JOIN ref.source src ON src.{source_cols['id']} = m.{meas_cols['source_id']}"
                if source_cols["id"]
                else ""
            )

            station_stats_rows = db.execute(
                text(
                    f"""
                    SELECT
                        m.{meas_cols['station_id']} AS station_id,
                        m.{meas_cols['variable_id']} AS variable_id,
                        {var_name_expr} AS variable_name,
                        m.{meas_cols['source_id']} AS source_id,
                        {src_name_expr} AS source_name,
                        COUNT(*) AS record_count,
                        {time_select}
                    FROM ts.measurement m
                    {var_join}
                    {src_join}
                    GROUP BY
                        m.{meas_cols['station_id']},
                        m.{meas_cols['variable_id']},
                        {var_name_expr},
                        m.{meas_cols['source_id']},
                        {src_name_expr}
                    """
                )
            ).mappings().all()

            for row in station_stats_rows:
                station_id = row["station_id"]
                if station_id not in station_map:
                    continue
                entity = station_map[station_id]
                entity["total_records"] += int(row["record_count"] or 0)
                entity["first_record"] = _min_dt(entity["first_record"], row["first_record"])
                entity["last_record"] = _max_dt(entity["last_record"], row["last_record"])

                variable_id = row["variable_id"]
                source_id = row["source_id"]
                variable_entry = _ensure_variable_entry(entity, variable_id, row["variable_name"])
                variable_entry["record_count"] += int(row["record_count"] or 0)
                variable_entry["first_record"] = _min_dt(variable_entry["first_record"], row["first_record"])
                variable_entry["last_record"] = _max_dt(variable_entry["last_record"], row["last_record"])

                source_entry = _ensure_source_entry(
                    variable_entry, source_id, row["source_name"]
                )
                source_entry["record_count"] += int(row["record_count"] or 0)
                source_entry["first_record"] = _min_dt(source_entry["first_record"], row["first_record"])
                source_entry["last_record"] = _max_dt(source_entry["last_record"], row["last_record"])

            for entity in station_map.values():
                entity["variable_count"] = len(entity["variables"])
                entity["source_count"] = sum(
                    len(v["sources"]) for v in entity["variables"]
                )

        station_entities = list(station_map.values())

    basin_entities: List[Dict[str, Any]] = []
    if _table_exists(db, "geo", "basin") and basin_cols["id"]:
        basin_name_expr = (
            f"COALESCE(b.{basin_cols['name']}, b.{basin_cols['id']})"
            if basin_cols["name"]
            else f"CAST(b.{basin_cols['id']} AS TEXT)"
        )
        basin_group_expr = (
            f"COALESCE(b.{basin_cols['group']}, 'Bassin')"
            if basin_cols["group"]
            else "'Bassin'"
        )
        basins_rows = db.execute(
            text(
                f"""
                SELECT
                    b.{basin_cols['id']} AS basin_id,
                    {basin_name_expr} AS basin_name,
                    {basin_group_expr} AS basin_group
                FROM geo.basin b
                ORDER BY basin_name
                """
            )
        ).mappings().all()

        basin_map: Dict[Any, Dict[str, Any]] = {
            row["basin_id"]: {
                "basin_id": row["basin_id"],
                "basin_name": row["basin_name"],
                "basin_group": row["basin_group"],
                "total_records": 0,
                "variable_count": 0,
                "source_count": 0,
                "first_record": None,
                "last_record": None,
                "variables": [],
            }
            for row in basins_rows
        }

        if (
            _table_exists(db, "ts", "basin_measurement")
            and basin_meas_cols["basin_id"]
            and basin_meas_cols["variable_id"]
            and basin_meas_cols["source_id"]
        ):
            time_select = (
                f"MIN(m.{basin_meas_cols['time']}) AS first_record, MAX(m.{basin_meas_cols['time']}) AS last_record"
                if basin_meas_cols["time"]
                else "NULL AS first_record, NULL AS last_record"
            )
            var_name_expr = (
                f"v.{variable_cols['name']}"
                if variable_cols["id"] and variable_cols["name"]
                else "CAST(m.{meas_col} AS TEXT)".format(
                    meas_col=basin_meas_cols["variable_id"]
                )
            )
            src_name_expr = (
                f"src.{source_cols['name']}"
                if source_cols["id"] and source_cols["name"]
                else "CAST(m.{meas_col} AS TEXT)".format(
                    meas_col=basin_meas_cols["source_id"]
                )
            )
            var_join = (
                f"LEFT JOIN ref.variable v ON v.{variable_cols['id']} = m.{basin_meas_cols['variable_id']}"
                if variable_cols["id"]
                else ""
            )
            src_join = (
                f"LEFT JOIN ref.source src ON src.{source_cols['id']} = m.{basin_meas_cols['source_id']}"
                if source_cols["id"]
                else ""
            )
            basin_stats_rows = db.execute(
                text(
                    f"""
                    SELECT
                        m.{basin_meas_cols['basin_id']} AS basin_id,
                        m.{basin_meas_cols['variable_id']} AS variable_id,
                        {var_name_expr} AS variable_name,
                        m.{basin_meas_cols['source_id']} AS source_id,
                        {src_name_expr} AS source_name,
                        COUNT(*) AS record_count,
                        {time_select}
                    FROM ts.basin_measurement m
                    {var_join}
                    {src_join}
                    GROUP BY
                        m.{basin_meas_cols['basin_id']},
                        m.{basin_meas_cols['variable_id']},
                        {var_name_expr},
                        m.{basin_meas_cols['source_id']},
                        {src_name_expr}
                    """
                )
            ).mappings().all()

            for row in basin_stats_rows:
                basin_id = row["basin_id"]
                if basin_id not in basin_map:
                    continue
                entity = basin_map[basin_id]
                entity["total_records"] += int(row["record_count"] or 0)
                entity["first_record"] = _min_dt(entity["first_record"], row["first_record"])
                entity["last_record"] = _max_dt(entity["last_record"], row["last_record"])

                variable_id = row["variable_id"]
                source_id = row["source_id"]
                variable_entry = _ensure_variable_entry(entity, variable_id, row["variable_name"])
                variable_entry["record_count"] += int(row["record_count"] or 0)
                variable_entry["first_record"] = _min_dt(variable_entry["first_record"], row["first_record"])
                variable_entry["last_record"] = _max_dt(variable_entry["last_record"], row["last_record"])

                source_entry = _ensure_source_entry(
                    variable_entry, source_id, row["source_name"]
                )
                source_entry["record_count"] += int(row["record_count"] or 0)
                source_entry["first_record"] = _min_dt(source_entry["first_record"], row["first_record"])
                source_entry["last_record"] = _max_dt(source_entry["last_record"], row["last_record"])

            for entity in basin_map.values():
                entity["variable_count"] = len(entity["variables"])
                entity["source_count"] = sum(
                    len(v["sources"]) for v in entity["variables"]
                )

        basin_entities = list(basin_map.values())

    if (
        include_time_stats
        and _table_exists(db, "ts", "measurement")
        and meas_cols["time"]
        and meas_cols["variable_id"]
        and meas_cols["station_id"]
    ):
        var_join = (
            f"LEFT JOIN ref.variable v ON v.{variable_cols['id']} = o.variable_id"
            if variable_cols["id"]
            else ""
        )
        var_name_expr = (
            f"v.{variable_cols['name']}"
            if variable_cols["id"] and variable_cols["name"]
            else "CAST(o.variable_id AS TEXT)"
        )
        time_stats = db.execute(
            text(
                f"""
                WITH ordered AS (
                    SELECT
                        m.{meas_cols['variable_id']} AS variable_id,
                        m.{meas_cols['station_id']} AS station_id,
                        m.{meas_cols['time']} AS ts,
                        EXTRACT(
                            EPOCH FROM (
                                m.{meas_cols['time']}
                                - LAG(m.{meas_cols['time']})
                                  OVER (
                                      PARTITION BY m.{meas_cols['station_id']}, m.{meas_cols['variable_id']}
                                      ORDER BY m.{meas_cols['time']}
                                  )
                            )
                        ) AS step_seconds
                    FROM ts.measurement m
                )
                SELECT
                    o.variable_id,
                    {var_name_expr} AS variable_name,
                    COUNT(*) AS record_count,
                    COUNT(DISTINCT o.station_id) AS entity_count,
                    MIN(o.ts) AS first_record,
                    MAX(o.ts) AS last_record,
                    MIN(o.step_seconds) AS min_step_seconds,
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY o.step_seconds) AS median_step_seconds,
                    MAX(o.step_seconds) AS max_step_seconds
                FROM ordered o
                {var_join}
                WHERE o.step_seconds IS NOT NULL
                GROUP BY o.variable_id, {var_name_expr}
                ORDER BY record_count DESC
                """
            )
        ).mappings().all()
        summary["variable_time_stats"] = time_stats

    return {
        "stations": stations_by_type,
        "basins": basins_summary,
        "station_entities": station_entities,
        "basin_entities": basin_entities,
        "basins_full": [],
        "barrages_full": [],
        "summary": summary,
    }


def _legacy_data_scan(db: Session, include_time_stats: bool = False) -> Dict[str, Any]:
    station_cols = _list_columns(db, "public", "stations_abhs")
    basin_cols = _list_columns(db, "public", "bassin_sebou") if _table_exists(db, "public", "bassin_sebou") else set()

    station_id_col = _pick_column(station_cols, ["ire_station", "id_station"])
    station_name_col = _pick_column(station_cols, ["nom_station", "station_name", "name"])
    station_type_col = _pick_column(station_cols, ["type_station", "station_type"])

    if not station_id_col:
        return {
            "stations": [],
            "basins": [],
            "station_entities": [],
            "basin_entities": [],
            "summary": {
                "total_stations": 0,
                "total_basins": 0,
                "total_variables": 0,
                "total_sources": 0,
                "total_records": 0,
                "stations_with_data": 0,
                "basins_with_data": 0,
                "available_variables": [],
                "available_sources": [],
                "variable_time_stats": [],
            },
        }

    union_sql = _build_legacy_station_union(db, station_id_col)
    if not union_sql:
        union_sql = "SELECT NULL::text AS station_id, NULL::text AS variable_name, NULL::timestamp AS ts WHERE 1=0"

    summary = {
        "total_stations": _safe_count(db, "public", "stations_abhs"),
        "total_basins": _safe_count(db, "public", "bassin_sebou"),
        "total_variables": 0,
        "total_sources": 0,
        "total_records": 0,
        "stations_with_data": 0,
        "basins_with_data": 0,
        "available_variables": [],
        "available_sources": [],
        "variable_time_stats": [],
    }

    total_records = db.execute(text(f"SELECT COUNT(*) FROM ({union_sql}) AS u")).scalar()
    summary["total_records"] = int(total_records or 0)
    summary["stations_with_data"] = int(
        db.execute(text(f"SELECT COUNT(DISTINCT station_id) FROM ({union_sql}) AS u")).scalar() or 0
    )
    if _table_exists(db, "public", "types_mesures"):
        summary["total_variables"] = int(
            db.execute(
                text(
                    """
                    SELECT COUNT(DISTINCT COALESCE(parametre_qualite, type_mesure))
                    FROM public.types_mesures
                    """
                )
            ).scalar()
            or 0
        )
        summary["available_variables"] = [
            dict(row)
            for row in db.execute(
                text(
                    """
                    SELECT
                        COALESCE(parametre_qualite, type_mesure) AS name,
                        unite AS code,
                        description AS label
                    FROM public.types_mesures
                    WHERE COALESCE(parametre_qualite, type_mesure) IS NOT NULL
                    ORDER BY COALESCE(parametre_qualite, type_mesure)
                    """
                )
            ).mappings().all()
        ]
    else:
        summary["total_variables"] = int(
            db.execute(text(f"SELECT COUNT(DISTINCT variable_name) FROM ({union_sql}) AS u")).scalar() or 0
        )
        summary["available_variables"] = [
            dict(row)
            for row in db.execute(
                text(
                    f"""
                    SELECT DISTINCT variable_name AS name
                    FROM ({union_sql}) AS u
                    WHERE variable_name IS NOT NULL
                    ORDER BY variable_name
                    """
                )
            ).mappings().all()
        ]

    if _table_exists(db, "public", "sources_abhs"):
        source_cols = _list_columns(db, "public", "sources_abhs")
        source_id_col = _pick_column(source_cols, ["ire_source", "id"])
        source_name_col = _pick_column(source_cols, ["nom_source", "name"])
        summary["total_sources"] = _safe_count(db, "public", "sources_abhs")
        if source_name_col:
            summary["available_sources"] = [
                dict(row)
                for row in db.execute(
                text(
                    f"""
                    SELECT DISTINCT {source_name_col} AS name
                    FROM public.sources_abhs
                    WHERE {source_name_col} IS NOT NULL
                    ORDER BY {source_name_col}
                    """
                )
                ).mappings().all()
            ]
        elif source_id_col:
            summary["available_sources"] = [
                dict(row)
                for row in db.execute(
                text(
                    f"""
                    SELECT DISTINCT {source_id_col} AS name
                    FROM public.sources_abhs
                    ORDER BY {source_id_col}
                    """
                )
                ).mappings().all()
            ]

    station_type_expr = (
        f"COALESCE(s.{station_type_col}, 'Inconnu')" if station_type_col else "'Inconnu'"
    )
    station_name_expr = (
        f"COALESCE(s.{station_name_col}, s.{station_id_col})"
        if station_name_col
        else f"CAST(s.{station_id_col} AS TEXT)"
    )

    stations_by_type = db.execute(
        text(
            f"""
            WITH station_measurements AS ({union_sql})
            SELECT
                {station_type_expr} AS station_type,
                COUNT(DISTINCT s.{station_id_col}) AS station_count,
                COUNT(sm.station_id) AS record_count,
                COUNT(DISTINCT sm.variable_name) AS variable_count,
                0 AS source_count,
                MIN(sm.ts) AS first_record,
                MAX(sm.ts) AS last_record
            FROM public.stations_abhs s
            LEFT JOIN station_measurements sm ON sm.station_id = s.{station_id_col}
            GROUP BY {station_type_expr}
            ORDER BY station_type
            """
        )
    ).mappings().all()

    station_rows = db.execute(
        text(
            f"""
            SELECT
                s.{station_id_col} AS station_id,
                {station_name_expr} AS station_name,
                {station_type_expr} AS station_type
            FROM public.stations_abhs s
            ORDER BY station_name
            """
        )
    ).mappings().all()

    station_map: Dict[Any, Dict[str, Any]] = {
        row["station_id"]: {
            "station_id": row["station_id"],
            "station_name": row["station_name"],
            "station_type": row["station_type"],
            "total_records": 0,
            "variable_count": 0,
            "source_count": 0,
            "first_record": None,
            "last_record": None,
            "variables": [],
        }
        for row in station_rows
    }

    station_stats_rows = db.execute(
        text(
            f"""
            WITH station_measurements AS ({union_sql})
            SELECT
                station_id,
                variable_name,
                COUNT(*) AS record_count,
                MIN(ts) AS first_record,
                MAX(ts) AS last_record
            FROM station_measurements
            GROUP BY station_id, variable_name
            """
        )
    ).mappings().all()

    for row in station_stats_rows:
        station_id = row["station_id"]
        if station_id not in station_map:
            continue
        entity = station_map[station_id]
        entity["total_records"] += int(row["record_count"] or 0)
        entity["first_record"] = _min_dt(entity["first_record"], row["first_record"])
        entity["last_record"] = _max_dt(entity["last_record"], row["last_record"])

        variable_entry = _ensure_variable_entry(entity, row["variable_name"], row["variable_name"])
        variable_entry["record_count"] += int(row["record_count"] or 0)
        variable_entry["first_record"] = _min_dt(variable_entry["first_record"], row["first_record"])
        variable_entry["last_record"] = _max_dt(variable_entry["last_record"], row["last_record"])

    for entity in station_map.values():
        entity["variable_count"] = len(entity["variables"])

    basin_entities: List[Dict[str, Any]] = []
    basins_summary: List[Dict[str, Any]] = []
    if basin_cols and _table_exists(db, "public", "bassin_sebou"):
        basin_id_col = _pick_column(basin_cols, ["id", "id_bassin"])
        basin_name_col = _pick_column(basin_cols, ["nom", "name"])
        basins_summary = db.execute(
            text(
                """
                SELECT
                    'Bassin' AS basin_group,
                    COUNT(*) AS basin_count,
                    0 AS record_count,
                    0 AS variable_count,
                    0 AS source_count,
                    NULL AS first_record,
                    NULL AS last_record
                FROM public.bassin_sebou
                """
            )
        ).mappings().all()

        if basin_id_col:
            if basin_name_col:
                basin_name_expr = f"COALESCE(b.{basin_name_col}, CAST(b.{basin_id_col} AS TEXT))"
            else:
                basin_name_expr = f"CAST(b.{basin_id_col} AS TEXT)"
            basin_entities = [
                dict(row)
                for row in db.execute(
                text(
                    f"""
                    SELECT
                        b.{basin_id_col} AS basin_id,
                        {basin_name_expr} AS basin_name,
                        'Bassin' AS basin_group,
                        0 AS total_records,
                        0 AS variable_count,
                        0 AS source_count,
                        NULL AS first_record,
                        NULL AS last_record,
                        ARRAY[]::jsonb[] AS variables
                    FROM public.bassin_sebou b
                    """
                )
                ).mappings().all()
            ]

    barrages_full = _fetch_full_table(db, "public", "barrages_abhs", geom_col="geom")
    basins_full = _fetch_full_table(db, "public", "bassin_sebou", geom_col="geom")

    if include_time_stats:
        time_stats = db.execute(
            text(
                f"""
                WITH ordered AS (
                    SELECT
                        station_id,
                        variable_name,
                        ts,
                        EXTRACT(
                            EPOCH FROM (
                                ts - LAG(ts) OVER (
                                    PARTITION BY station_id, variable_name
                                    ORDER BY ts
                                )
                            )
                        ) AS step_seconds
                    FROM ({union_sql}) AS u
                )
                SELECT
                    variable_name AS variable_id,
                    variable_name AS variable_name,
                    COUNT(*) AS record_count,
                    COUNT(DISTINCT station_id) AS entity_count,
                    MIN(ts) AS first_record,
                    MAX(ts) AS last_record,
                    MIN(step_seconds) AS min_step_seconds,
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY step_seconds) AS median_step_seconds,
                    MAX(step_seconds) AS max_step_seconds
                FROM ordered
                WHERE step_seconds IS NOT NULL
                GROUP BY variable_name
                ORDER BY record_count DESC
                """
            )
        ).mappings().all()
        summary["variable_time_stats"] = time_stats

    return {
        "stations": stations_by_type,
        "basins": basins_summary,
        "station_entities": list(station_map.values()),
        "basin_entities": basin_entities,
        "basins_full": basins_full,
        "barrages_full": barrages_full,
        "summary": summary,
    }


def _build_legacy_station_union(db: Session, station_col: str) -> str:
    configs = [
        ("mesures_debit_jr", "date_jr", station_col, "'Debit'"),
        ("mesures_temperatures_jr", "date_jr", station_col, "'Temperature'"),
        ("mesures_precipitations_jr", "date_jr", station_col, "'Precipitation'"),
        ("mesures_qualite_rivieres", "date_prelevement", station_col, "parametre_qualite"),
    ]

    union_parts: List[str] = []
    for table, time_col, station_id_col, variable_expr in configs:
        if not _table_exists(db, "public", table):
            continue
        cols = _list_columns(db, "public", table)
        if station_id_col not in cols or time_col not in cols:
            continue
        if variable_expr == "parametre_qualite" and "parametre_qualite" not in cols:
            continue
        union_parts.append(
            f"""
            SELECT
                {station_id_col}::text AS station_id,
                {variable_expr}::text AS variable_name,
                {time_col}::timestamp AS ts
            FROM public.{table}
            """
        )

    return " UNION ALL ".join(union_parts)


def _fetch_full_table(
    db: Session, schema: str, table: str, geom_col: Optional[str] = None
) -> List[Dict[str, Any]]:
    if not _table_exists(db, schema, table):
        return []
    cols = _list_columns(db, schema, table)
    select_cols = [f"{c}" for c in cols if c != geom_col]
    if geom_col and geom_col in cols:
        select_cols.append(f"ST_AsGeoJSON({geom_col}) AS {geom_col}")
    col_sql = ", ".join(select_cols) if select_cols else "*"
    rows = db.execute(text(f"SELECT {col_sql} FROM {schema}.{table}")).mappings().all()
    return [dict(r) for r in rows]


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


def _min_dt(a: Any, b: Any) -> Any:
    if a is None:
        return b
    if b is None:
        return a
    return a if a <= b else b


def _max_dt(a: Any, b: Any) -> Any:
    if a is None:
        return b
    if b is None:
        return a
    return a if a >= b else b
