# backend/app/api/v1/raw.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from app.db_raw import connection
from app.util_dbmeta import get_geom_column, pick_first_existing, table_exists

router = APIRouter(prefix="/raw", tags=["Raw"])

# Heuristiques colonnes coordonnées
LAT_CANDIDATES = ["lat","latitude","y","lat_dd"]
LON_CANDIDATES = ["lon","long","longitude","x","lng","lon_dd"]

def _has_coords(schema: str, table: str) -> tuple[bool, list[str]]:
    # on teste si des colonnes lat/lon existent
    coord_cols = []
    for name in LAT_CANDIDATES + LON_CANDIDATES:
        col = pick_first_existing(f"{schema}.{table}", [name])
        if col:
            coord_cols.append(col)
    has_lat = any(c.lower() in LAT_CANDIDATES for c in coord_cols)
    has_lon = any(c.lower() in LON_CANDIDATES for c in coord_cols)
    return (has_lat and has_lon, sorted(set(coord_cols)))

@router.get("/tables")
def list_tables(schema: Optional[str] = Query(None)):
    """
    Liste les tables visibles (hors pg_catalog, information_schema),
    avec détection has_geometry (geom ou lat/lon).
    """
    where_schema = "AND t.table_schema=%s" if schema else ""
    params = [schema] if schema else []
    q = f"""
      SELECT t.table_schema, t.table_name
      FROM information_schema.tables t
      WHERE t.table_type IN ('BASE TABLE','VIEW','FOREIGN TABLE')
        AND t.table_schema NOT IN ('pg_catalog','information_schema')
        {where_schema}
      ORDER BY t.table_schema, t.table_name;
    """
    out = []
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q, params)
        for sch, tbl in cur.fetchall():
            fullname = f"{sch}.{tbl}"
            # geom via PostGIS ?
            geom_col = get_geom_column(fullname)
            if geom_col:
                out.append({
                    "schema": sch, "table": tbl,
                    "has_geometry": True,
                    "geom_columns": [geom_col],
                    "coord_columns": []
                })
                continue
            # sinon lat/lon ?
            has_coords, coord_cols = _has_coords(sch, tbl)
            out.append({
                "schema": sch, "table": tbl,
                "has_geometry": bool(has_coords),
                "geom_columns": [],
                "coord_columns": coord_cols
            })
    return {"tables": out}

@router.get("/{schema}/{table}/columns")
def table_columns(schema: str, table: str):
    if not table_exists(f"{schema}.{table}"):
        raise HTTPException(404, "Table introuvable")
    q = """
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema=%s AND table_name=%s
      ORDER BY ordinal_position
    """
    with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(q, (schema, table))
        return cur.fetchall()

@router.get("/{schema}/{table}/rows")
def table_rows(
    schema: str, table: str,
    limit: int = Query(100, ge=1, le=10000),
    offset: int = Query(0, ge=0),
    order_by: Optional[str] = None,
    desc: bool = True,
):
    """
    Renvoie des lignes (pagination).
    - order_by : nom de colonne optionnel (sécurisé par identifier)
    """
    if not table_exists(f"{schema}.{table}"):
        raise HTTPException(404, "Table introuvable")

    base = sql.SQL("SELECT * FROM {}.{}").format(
        sql.Identifier(schema), sql.Identifier(table)
    )
    order = sql.SQL("")
    if order_by:
        # sécuriser le nom de colonne
        order = sql.SQL(" ORDER BY {} {}").format(
            sql.Identifier(order_by),
            sql.SQL("DESC" if desc else "ASC")
        )
    pag = sql.SQL(" LIMIT %s OFFSET %s")
    query = sql.SQL("").join([base, order, pag])

    with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, (limit, offset))
        rows = cur.fetchall()
        return {"rows": rows, "limit": limit, "offset": offset}
