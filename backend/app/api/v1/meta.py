# backend/app/api/v1/meta.py
from fastapi import APIRouter, Query, Response
from app.db_raw import connection
from app.util_dbmeta import table_exists, get_geom_column
from psycopg2.extras import RealDictCursor
from psycopg2 import sql
import io, csv, datetime

router = APIRouter(prefix="/meta", tags=["Meta"])

def _tables(schema: str | None):
    where_schema = "AND table_schema = %s" if schema else ""
    params = [schema] if schema else []
    q = f"""
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type IN ('BASE TABLE','VIEW','FOREIGN TABLE')
        AND table_schema NOT IN ('pg_catalog','information_schema')
        {where_schema}
      ORDER BY table_schema, table_name
    """
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q, params)
        return cur.fetchall()

def _row_estimate(schema: str, table: str) -> int:
    q = """
      SELECT GREATEST(reltuples::bigint,0)
      FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname=%s AND c.relname=%s
      LIMIT 1
    """
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q, (schema, table))
        r = cur.fetchone()
        return int(r[0]) if r and r[0] is not None else 0

def _primary_key(schema: str, table: str) -> str | None:
    q = """
      SELECT a.attname
      FROM pg_index i
      JOIN pg_class t ON t.oid=i.indrelid
      JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum = ANY(i.indkey)
      JOIN pg_namespace n ON n.oid=t.relnamespace
      WHERE i.indisprimary AND n.nspname=%s AND t.relname=%s
      ORDER BY a.attnum LIMIT 1
    """
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q, (schema, table))
        r = cur.fetchone()
        return r[0] if r else None

def _foreign_keys(schema: str, table: str):
    q = """
      SELECT kcu.column_name,
             ccu.table_schema AS ref_schema,
             ccu.table_name   AS ref_table,
             ccu.column_name  AS ref_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name=kcu.constraint_name
       AND tc.table_schema=kcu.table_schema
       AND tc.table_name=kcu.table_name
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name=tc.constraint_name
       AND ccu.table_schema=tc.table_schema
      WHERE tc.constraint_type='FOREIGN KEY'
        AND tc.table_schema=%s AND tc.table_name=%s
      ORDER BY kcu.ordinal_position
    """
    with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(q, (schema, table))
        return cur.fetchall()

def _columns(schema: str, table: str):
    q = """
      SELECT c.column_name, c.data_type, (c.is_nullable='YES') AS nullable,
             c.column_default,
             pgd.description AS col_comment
      FROM information_schema.columns c
      LEFT JOIN pg_class cls
        ON cls.relname = c.table_name
      LEFT JOIN pg_namespace ns
        ON ns.nspname = c.table_schema AND ns.oid = cls.relnamespace
      LEFT JOIN pg_description pgd
        ON pgd.objoid = cls.oid AND pgd.objsubid = c.ordinal_position
      WHERE c.table_schema=%s AND c.table_name=%s
      ORDER BY c.ordinal_position
    """
    with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(q, (schema, table))
        return cur.fetchall()

def _table_comment(schema: str, table: str) -> str | None:
    q = """
      SELECT obj_description(c.oid)
      FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname=%s AND c.relname=%s
      LIMIT 1
    """
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q, (schema, table))
        r = cur.fetchone()
        return r[0] if r and r[0] else None

def _srid_for(schema: str, table: str, geom_col: str | None) -> int | None:
    if not geom_col:
        return None
    q = sql.SQL("SELECT ST_SRID({geom}) FROM {sch}.{tbl} WHERE {geom} IS NOT NULL LIMIT 1").format(
        geom=sql.Identifier(geom_col),
        sch=sql.Identifier(schema),
        tbl=sql.Identifier(table),
    )
    with connection() as cx, cx.cursor() as cur:
        try:
            cur.execute(q)
            r = cur.fetchone()
            return int(r[0]) if r and r[0] else None
        except Exception:
            return None

@router.get("/dictionary")
def dictionary(schema: str | None = Query(None), exact: bool = Query(False)):
    """
    Récupère le dictionnaire BD (JSON).
    - schema: restreint à un schéma donné (ex 'public')
    - exact=true: fait des COUNT(*) (plus lent) au lieu d'une estimation
    """
    out = {"generated_at": datetime.datetime.utcnow().isoformat() + "Z", "tables": []}
    for sch, tbl in _tables(schema):
        pk = _primary_key(sch, tbl)
        cols = _columns(sch, tbl)
        fks = _foreign_keys(sch, tbl)
        geom_col = get_geom_column(f"{sch}.{tbl}")
        srid = _srid_for(sch, tbl, geom_col)
        if exact:
            with connection() as cx, cx.cursor() as cur:
                cur.execute(sql.SQL("SELECT COUNT(*) FROM {}.{}").format(
                    sql.Identifier(sch), sql.Identifier(tbl)))
                row_est = int(cur.fetchone()[0])
        else:
            row_est = _row_estimate(sch, tbl)

        # marquer PK/FK au niveau colonne
        fk_cols = {fk["column_name"] for fk in fks}
        for c in cols:
            c["is_pk"] = (c["column_name"] == pk)
            c["is_fk"] = (c["column_name"] in fk_cols)

        out["tables"].append({
            "schema": sch,
            "table": tbl,
            "row_estimate": row_est,
            "primary_key": pk,
            "geom_column": geom_col,
            "srid": srid,
            "comment": _table_comment(sch, tbl),
            "columns": cols,
            "foreign_keys": fks,
        })
    return out

@router.get("/dictionary.csv")
def dictionary_csv(schema: str | None = Query(None), exact: bool = Query(False)):
    """Export CSV du dictionnaire."""
    data = dictionary(schema=schema, exact=exact)  # réutilise la logique
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["schema","table","row_estimate","primary_key","geom_column","srid",
                "column","data_type","nullable","default","is_pk","is_fk",
                "table_comment","column_comment"])
    for t in data["tables"]:
        for c in t["columns"]:
            w.writerow([
                t["schema"], t["table"], t["row_estimate"], t["primary_key"],
                t["geom_column"], t["srid"],
                c["column_name"], c["data_type"], c["nullable"], c["column_default"],
                c["is_pk"], c["is_fk"],
                t["comment"] or "", c["col_comment"] or "",
            ])
    csv_bytes = buf.getvalue().encode("utf-8")
    return Response(content=csv_bytes, media_type="text/csv")
