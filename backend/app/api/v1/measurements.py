import os
from datetime import date, timedelta

import psycopg2.extras
from fastapi import APIRouter, Query

from app.db_raw import connection
from app.util_dbmeta import pick_first_existing, table_exists

router = APIRouter(prefix="/stations")

# Tables mesures configurables via .env
TBL_DEBIT = os.getenv("TBL_DEBIT", "mesures_debit_jr")
TBL_TEMP = os.getenv("TBL_TEMP", "mesures_temperatures_jr")
TBL_QUAL = os.getenv("TBL_QUAL", "mesures_qualite_rivieres")
STATIONS_TABLE = os.getenv("STATIONS_TABLE", "public.stations_abhs")

DATE_COL_CANDIDATES = ["date_utc", "date_jr", "date_prelevement", "date", "ts", "timestamp"]
STATION_COL_CANDIDATES = ["station_id", "id_station", "ire_station", "station_code", "code_station"]
DEBIT_COL_CANDIDATES = ["debit_m3s", "debit_jr", "debit", "flow", "q"]
TEMP_COL_CANDIDATES = ["temp_c", "temperature_jr", "temperature", "temp", "t_eau"]


def _station_tokens(station_id: int) -> list[str]:
    # Toujours garder l'ID numérique comme fallback texte
    tokens = [str(station_id)]
    if not table_exists(STATIONS_TABLE):
        return tokens

    id_col = pick_first_existing(STATIONS_TABLE, ["id_station", "id"])
    ire_col = pick_first_existing(STATIONS_TABLE, ["ire_station", "code_station"])
    if not id_col or not ire_col:
        return tokens

    sql = f"SELECT {ire_col} FROM {STATIONS_TABLE} WHERE {id_col} = %s LIMIT 1"
    with connection() as cx, cx.cursor() as cur:
        cur.execute(sql, (station_id,))
        row = cur.fetchone()
        if row and row[0]:
            tokens.append(str(row[0]))
    return list(dict.fromkeys(tokens))


def _build_base_part(table_name: str, value_col: str, out_col: str) -> str:
    date_col = pick_first_existing(table_name, DATE_COL_CANDIDATES)
    station_col = pick_first_existing(table_name, STATION_COL_CANDIDATES)
    if not date_col or not station_col:
        return ""

    select_cols = {
        "debit_m3s": "NULL::numeric AS debit_m3s",
        "no3_mgl": "NULL::numeric AS no3_mgl",
        "p_mgl": "NULL::numeric AS p_mgl",
        "temp_c": "NULL::numeric AS temp_c",
    }
    select_cols[out_col] = f"{value_col}::numeric AS {out_col}"

    return f"""
      SELECT {date_col}::timestamp AS ts,
             {select_cols["debit_m3s"]},
             {select_cols["no3_mgl"]},
             {select_cols["p_mgl"]},
             {select_cols["temp_c"]}
      FROM {table_name}
      WHERE {station_col}::text = ANY(%s)
        AND {date_col} BETWEEN %s AND %s
    """


@router.get("/{station_id}/measurements")
def measurements(
    station_id: int,
    from_: date | None = Query(None, alias="from"),
    to: date | None = Query(None, alias="to"),
    days: int | None = 30,
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
            part = _build_base_part(TBL_DEBIT, debit_col, "debit_m3s")
            if part:
                parts.append(part)
                params.extend([station_tokens, from_, to])

    if table_exists(TBL_TEMP):
        temp_col = pick_first_existing(TBL_TEMP, TEMP_COL_CANDIDATES)
        if temp_col:
            part = _build_base_part(TBL_TEMP, temp_col, "temp_c")
            if part:
                parts.append(part)
                params.extend([station_tokens, from_, to])

    if table_exists(TBL_QUAL):
        qual_date_col = pick_first_existing(TBL_QUAL, DATE_COL_CANDIDATES)
        qual_station_col = pick_first_existing(TBL_QUAL, STATION_COL_CANDIDATES)
        qual_param_col = pick_first_existing(TBL_QUAL, ["parametre_qualite", "parametre", "parameter"])
        qual_value_col = pick_first_existing(TBL_QUAL, ["val_qual_riv", "valeur", "value", "measure"])
        if qual_date_col and qual_station_col and qual_param_col and qual_value_col:
            parts.append(f"""
              SELECT {qual_date_col}::timestamp AS ts,
                     NULL::numeric AS debit_m3s,
                     CASE
                       WHEN lower(trim({qual_param_col})) IN ('no3-', 'no3', 'nitrates', 'nitrate')
                       THEN {qual_value_col}::numeric
                       ELSE NULL::numeric
                     END AS no3_mgl,
                     CASE
                       WHEN lower(trim({qual_param_col})) IN ('phosphore total', 'po4 3-', 'po4', 'phosphore', 'p_total')
                       THEN {qual_value_col}::numeric
                       ELSE NULL::numeric
                     END AS p_mgl,
                     CASE
                       WHEN lower(trim({qual_param_col})) IN ('t_eau', 'temp', 'temperature', 'temp_c')
                       THEN {qual_value_col}::numeric
                       ELSE NULL::numeric
                     END AS temp_c
              FROM {TBL_QUAL}
              WHERE {qual_station_col}::text = ANY(%s)
                AND {qual_date_col} BETWEEN %s AND %s
            """)
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
