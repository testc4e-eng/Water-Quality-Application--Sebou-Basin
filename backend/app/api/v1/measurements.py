# backend/app/api/v1/measurements.py
import os
from fastapi import APIRouter, Query
from datetime import date, timedelta
from app.db_raw import connection
from app.util_dbmeta import table_exists
import psycopg2.extras

router = APIRouter(prefix="/stations")

# Tables mesures configurables via .env
TBL_DEBIT = os.getenv("TBL_DEBIT", "mesures_debit_jr")
TBL_TEMP  = os.getenv("TBL_TEMP",  "mesures_temperatures_jr")
TBL_QUAL  = os.getenv("TBL_QUAL",  "mesures_qualite_rivieres")

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

    parts = []

    if table_exists(TBL_DEBIT):
        parts.append(f"""
          SELECT date_utc::timestamp AS ts, debit_m3s::numeric, NULL::numeric AS no3_mgl,
                 NULL::numeric AS p_mgl, NULL::numeric AS temp_c
          FROM {TBL_DEBIT}
          WHERE station_id=%s AND date_utc BETWEEN %s AND %s
        """)

    if table_exists(TBL_TEMP):
        parts.append(f"""
          SELECT date_utc::timestamp AS ts, NULL::numeric AS debit_m3s, NULL::numeric AS no3_mgl,
                 NULL::numeric AS p_mgl, temp_c::numeric
          FROM {TBL_TEMP}
          WHERE station_id=%s AND date_utc BETWEEN %s AND %s
        """)

    if table_exists(TBL_QUAL):
        parts.append(f"""
          SELECT date_utc::timestamp AS ts, NULL::numeric AS debit_m3s, no3_mgl::numeric,
                 p_mgl::numeric, NULL::numeric AS temp_c
          FROM {TBL_QUAL}
          WHERE station_id=%s AND date_utc BETWEEN %s AND %s
        """)

    if not parts:
        return []  # aucune table de mesures disponible

    # UNION ALL + agrégation par ts
    union_sql = " UNION ALL ".join(parts)
    sql = f"""
      WITH allm AS (
        {union_sql}
      )
      SELECT ts AS date,
             max(debit_m3s) AS debit_m3s,
             max(no3_mgl)   AS no3_mgl,
             max(p_mgl)     AS p_mgl,
             max(temp_c)    AS temp_c
      FROM allm
      GROUP BY ts
      ORDER BY ts
    """

    params = []
    for _ in parts:
        params.extend([station_id, from_, to])

    with connection() as cx:
        with cx.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params)
            return cur.fetchall()
