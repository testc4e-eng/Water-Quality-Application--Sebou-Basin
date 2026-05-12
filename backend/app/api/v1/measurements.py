import os
from datetime import date, timedelta

import psycopg2.extras
from fastapi import APIRouter, Query

from app.db_raw import connection
from app.util_dbmeta import pick_first_existing, table_exists

router = APIRouter(prefix="/stations")

TBL_DEBIT = os.getenv("TBL_DEBIT", "hydro.mesure_debit")
TBL_TEMP = os.getenv("TBL_TEMP", "meteo.mesure_temperature")
TBL_QUAL = os.getenv("TBL_QUAL", "qualite.mesure_qualite_riviere")
STATIONS_TABLE = os.getenv("STATIONS_TABLE", "api.v_station_dimension")

DATE_COL_CANDIDATES = ["temps", "date_utc", "date_jr", "date_prelevement", "date", "ts", "timestamp"]
STATION_COL_CANDIDATES = ["station_id", "ire_station", "id_station", "station_code", "code_station"]
DEBIT_COL_CANDIDATES = ["valeur", "debit_m3s", "debit_jr", "debit", "flow", "q"]
TEMP_COL_CANDIDATES = ["val_moy", "temp_c", "temperature_jr", "temperature", "temp", "t_eau"]
QUAL_PARAM_COL_CANDIDATES = ["parametre_qualite", "parametre", "parameter"]
QUAL_VALUE_COL_CANDIDATES = ["valeur", "val_qual_riv", "value", "measure"]
QA_FLAG_CANDIDATES = [
    "qa_flag_negative",
    "qa_flag_outlier",
    "qa_flag_method_missing",
    "qa_flag_null_value",
    "qa_flag_param_missing",
    "qa_flag_station_unmapped",
]


def _existing_cols(table_name: str, candidates: list[str]) -> list[str]:
    return [col for col in candidates if pick_first_existing(table_name, [col]) == col]


def _station_tokens(station_id: str) -> list[str]:
    tokens = [str(station_id)]
    if not table_exists(STATIONS_TABLE):
        return list(dict.fromkeys(tokens))

    token_cols = _existing_cols(
        STATIONS_TABLE,
        ["station_id", "legacy_station_id", "code_station", "legacy_code_station", "ire_station", "id_station", "id"],
    )
    if not token_cols:
        return list(dict.fromkeys(tokens))

    select_sql = ", ".join(f"{col}::text" for col in token_cols)
    where_sql = " OR ".join(f"{col}::text = %s" for col in token_cols)
    query_params = [station_id] * len(token_cols)

    with connection() as cx, cx.cursor() as cur:
        cur.execute(f"SELECT {select_sql} FROM {STATIONS_TABLE} WHERE {where_sql} LIMIT 1", query_params)
        row = cur.fetchone()
        if row:
            tokens.extend(str(value) for value in row if value not in (None, ""))

    return list(dict.fromkeys(tokens))


def _station_filter(table_name: str, alias: str = "") -> str:
    station_cols = _existing_cols(table_name, STATION_COL_CANDIDATES)
    if not station_cols:
        return ""
    prefix = f"{alias}." if alias else ""
    comparisons = " OR ".join(f"token.station_ref = {prefix}{col}::text" for col in station_cols)
    return f"EXISTS (SELECT 1 FROM unnest(%s::text[]) AS token(station_ref) WHERE {comparisons})"


def _qa_conditions(table_name: str, alias: str, include_invalid: bool, include_flagged: bool) -> list[str]:
    conditions: list[str] = []
    prefix = f"{alias}." if alias else ""

    if not include_invalid and pick_first_existing(table_name, ["est_valide"]) == "est_valide":
        conditions.append(f"COALESCE({prefix}est_valide, true) = true")

    if not include_flagged:
        for flag_col in _existing_cols(table_name, QA_FLAG_CANDIDATES):
            conditions.append(f"COALESCE({prefix}{flag_col}, false) = false")

    return conditions


def _build_base_part(
    table_name: str,
    value_col: str,
    out_col: str,
    include_invalid: bool,
    include_flagged: bool,
) -> str:
    date_col = pick_first_existing(table_name, DATE_COL_CANDIDATES)
    station_filter = _station_filter(table_name)
    if not date_col or not station_filter:
        return ""

    select_cols = {
        "debit_m3s": "NULL::numeric AS debit_m3s",
        "no3_mgl": "NULL::numeric AS no3_mgl",
        "p_mgl": "NULL::numeric AS p_mgl",
        "temp_c": "NULL::numeric AS temp_c",
    }
    select_cols[out_col] = f"{value_col}::numeric AS {out_col}"

    conditions = [
        station_filter,
        f"{date_col} BETWEEN %s AND %s",
        * _qa_conditions(table_name, "", include_invalid, include_flagged),
    ]

    return f"""
      SELECT {date_col}::timestamp AS ts,
             {select_cols["debit_m3s"]},
             {select_cols["no3_mgl"]},
             {select_cols["p_mgl"]},
             {select_cols["temp_c"]}
      FROM {table_name}
      WHERE {" AND ".join(conditions)}
    """


@router.get("/{station_id}/measurements")
def measurements(
    station_id: str,
    from_: date | None = Query(None, alias="from"),
    to: date | None = Query(None, alias="to"),
    days: int | None = 30,
    include_invalid: bool = Query(False, description="Inclut les mesures avec est_valide = false"),
    include_flagged: bool = Query(False, description="Inclut les mesures portant des QA flags"),
):
    if not from_ or not to:
        to = to or date.today()
        from_ = from_ or (to - timedelta(days=days or 30))

    station_tokens = _station_tokens(station_id)
    parts: list[str] = []
    params: list[object] = []

    if table_exists(TBL_DEBIT):
        debit_col = pick_first_existing(TBL_DEBIT, DEBIT_COL_CANDIDATES)
        if debit_col:
            part = _build_base_part(TBL_DEBIT, debit_col, "debit_m3s", include_invalid, include_flagged)
            if part:
                parts.append(part)
                params.extend([station_tokens, from_, to])

    if table_exists(TBL_TEMP):
        temp_col = pick_first_existing(TBL_TEMP, TEMP_COL_CANDIDATES)
        if temp_col:
            part = _build_base_part(TBL_TEMP, temp_col, "temp_c", include_invalid, include_flagged)
            if part:
                parts.append(part)
                params.extend([station_tokens, from_, to])

    if table_exists(TBL_QUAL):
        qual_date_col = pick_first_existing(TBL_QUAL, DATE_COL_CANDIDATES)
        qual_param_col = pick_first_existing(TBL_QUAL, QUAL_PARAM_COL_CANDIDATES)
        qual_value_col = pick_first_existing(TBL_QUAL, QUAL_VALUE_COL_CANDIDATES)
        qual_station_filter = _station_filter(TBL_QUAL)
        if qual_date_col and qual_param_col and qual_value_col and qual_station_filter:
            qual_conditions = [
                qual_station_filter,
                f"{qual_date_col} BETWEEN %s AND %s",
                * _qa_conditions(TBL_QUAL, "", include_invalid, include_flagged),
            ]
            parts.append(
                f"""
              SELECT {qual_date_col}::timestamp AS ts,
                     NULL::numeric AS debit_m3s,
                     CASE
                       WHEN lower(trim({qual_param_col}::text)) IN ('no3-', 'no3', 'nitrates', 'nitrate')
                       THEN {qual_value_col}::numeric
                       ELSE NULL::numeric
                     END AS no3_mgl,
                     CASE
                       WHEN lower(trim({qual_param_col}::text)) IN ('phosphore total', 'po4 3-', 'po4', 'phosphore', 'p_total')
                       THEN {qual_value_col}::numeric
                       ELSE NULL::numeric
                     END AS p_mgl,
                     CASE
                       WHEN lower(trim({qual_param_col}::text)) IN ('t_eau', 'temp', 'temperature', 'temp_c')
                       THEN {qual_value_col}::numeric
                       ELSE NULL::numeric
                     END AS temp_c
              FROM {TBL_QUAL}
              WHERE {" AND ".join(qual_conditions)}
            """
            )
            params.extend([station_tokens, from_, to])

    if not parts:
        return []

    union_sql = " UNION ALL ".join(parts)
    sql = f"""
      WITH allm AS (
        {union_sql}
      )
      SELECT ts AS date,
             max(debit_m3s) AS debit_m3s,
             max(no3_mgl)   AS no3_mgl,
             max(p_mgl)     AS p_mgl,
             max(temp_c)    AS temp_c,
             max(debit_m3s) AS flow,
             max(no3_mgl)   AS no3,
             max(p_mgl)     AS p,
             max(temp_c)    AS temp
      FROM allm
      GROUP BY ts
      ORDER BY ts
    """

    with connection() as cx:
        with cx.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params)
            return cur.fetchall()
