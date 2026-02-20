# backend/app/util_dbmeta.py
from __future__ import annotations
import re
from functools import lru_cache
from typing import Iterable, Optional, Sequence, Tuple

import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor

from app.db_raw import connection

# -------------------------------
# Helpers parsing nom de table
# -------------------------------
def _split_table(fullname: str) -> Tuple[str, str]:
    """
    Accepte:
      - 'schema.table'
      - 'table' (=> schema = 'public')
    Nettoie les quotes éventuelles.
    """
    fullname = fullname.strip().strip('"').strip("'")
    if "." in fullname:
        sch, tbl = fullname.split(".", 1)
        return sch.strip().strip('"'), tbl.strip().strip('"')
    return "public", fullname

# -------------------------------
# Existence table
# -------------------------------
@lru_cache(maxsize=512)
def table_exists(fullname: str) -> bool:
    schema, table = _split_table(fullname)
    q = """
    SELECT 1
    FROM   pg_catalog.pg_class c
    JOIN   pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE  c.relkind = 'r'
      AND  n.nspname = %s
      AND  c.relname = %s
    LIMIT 1;
    """
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q, (schema, table))
        return cur.fetchone() is not None

# -------------------------------
# Colonne géométrique
# -------------------------------
@lru_cache(maxsize=512)
def get_geom_column(fullname: str) -> Optional[str]:
    """
    Essaie d'abord geometry_columns (PostGIS), sinon information_schema/pg_*.
    Renvoie le nom de la première colonne geometry/geography trouvée.
    """
    schema, table = _split_table(fullname)
    # 1) geometry_columns (si dispo)
    q1 = """
    SELECT f_geometry_column
    FROM   public.geometry_columns
    WHERE  f_table_schema = %s AND f_table_name = %s
    LIMIT 1;
    """
    with connection() as cx, cx.cursor() as cur:
        try:
            cur.execute(q1, (schema, table))
            r = cur.fetchone()
            if r and r[0]:
                return r[0]
        except Exception:
            # geometry_columns peut ne pas exister (selon PostGIS)
            pass

    # 2) information_schema + pg_type (geometry / geography)
    q2 = """
    SELECT c.column_name
    FROM   information_schema.columns c
    JOIN   pg_catalog.pg_class cls
           ON cls.relname = c.table_name
    JOIN   pg_catalog.pg_namespace ns
           ON ns.nspname = c.table_schema AND ns.oid = cls.relnamespace
    WHERE  c.table_schema = %s
      AND  c.table_name   = %s
      AND  (c.udt_name = 'geometry' OR c.udt_name = 'geography')
    LIMIT 1;
    """
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q2, (schema, table))
        r = cur.fetchone()
        if r:
            return r[0]

    # 3) heuristique: colonnes s'appellant geom/geometry
    q3 = """
    SELECT c.column_name
    FROM   information_schema.columns c
    WHERE  c.table_schema = %s AND c.table_name = %s
      AND  lower(c.column_name) IN ('geom','geometry','the_geom')
    LIMIT 1;
    """
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q3, (schema, table))
        r = cur.fetchone()
        return r[0] if r else None

# -------------------------------
# Clé primaire
# -------------------------------
@lru_cache(maxsize=512)
def get_primary_key(fullname: str) -> Optional[str]:
    schema, table = _split_table(fullname)
    q = """
    SELECT a.attname
    FROM   pg_index i
    JOIN   pg_class c    ON c.oid = i.indrelid
    JOIN   pg_namespace n ON n.oid = c.relnamespace
    JOIN   pg_attribute a ON a.attrelid = c.oid AND a.attnum = ANY(i.indkey)
    WHERE  i.indisprimary
      AND  n.nspname = %s
      AND  c.relname = %s
    ORDER BY a.attnum
    LIMIT 1;
    """
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q, (schema, table))
        r = cur.fetchone()
        return r[0] if r else None

# -------------------------------
# Choisir première colonne existante
# -------------------------------
def pick_first_existing(fullname: str, candidates: Sequence[str]) -> Optional[str]:
    if not candidates:
        return None
    schema, table = _split_table(fullname)
    # On teste toutes d'un coup
    placeholders = ",".join(["%s"] * len(candidates))
    q = f"""
    SELECT column_name
    FROM   information_schema.columns
    WHERE  table_schema = %s AND table_name = %s
       AND column_name IN ({placeholders})
    ORDER BY array_position(ARRAY[{placeholders}]::text[], column_name)
    LIMIT 1;
    """
    params = [schema, table] + list(candidates) + list(candidates)
    with connection() as cx, cx.cursor() as cur:
        cur.execute(q, params)
        r = cur.fetchone()
        return r[0] if r else None

# -------------------------------
# Chercher une table par motif
# -------------------------------
def find_first_table_like(patterns: Sequence[str]) -> Optional[str]:
    """
    patterns: liste de patterns ILIKE appliqués à "schema.table" (ex: '%.stations_abh%')
    Exclut pg_catalog et information_schema.
    """
    if not patterns:
        return None
    with connection() as cx, cx.cursor() as cur:
        for pat in patterns:
            q = """
            SELECT n.nspname || '.' || c.relname AS fullname
            FROM   pg_class c
            JOIN   pg_namespace n ON n.oid = c.relnamespace
            WHERE  c.relkind IN ('r','v','m')  -- table, view, matview
              AND  n.nspname NOT IN ('pg_catalog','information_schema')
              AND  (n.nspname || '.' || c.relname) ILIKE %s
            LIMIT 1;
            """
            cur.execute(q, (pat,))
            r = cur.fetchone()
            if r and r[0]:
                return r[0]
    return None

# -------------------------------
# Détection "table stations" plausible
# -------------------------------
CANDIDATE_STATION_NAMES = [
    "%stations%", "%station%", "%points%mesure%", "%points_mesure%",
    "%stations_abh%", "%stations%qualite%", "%pts_station%"
]
CANDIDATE_NAME_COLS = ["name","nom","libelle","libelle_station","station","label"]

def find_candidate_station_table() -> Optional[str]:
    """
    Heuristique: cherche une table avec une colonne geometry et une colonne "nom".
    """
    with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
        # 1) tables candidates par nom
        cur.execute("""
        SELECT n.nspname AS schema, c.relname AS table
        FROM   pg_class c
        JOIN   pg_namespace n ON n.oid = c.relnamespace
        WHERE  c.relkind IN ('r','v','m')
          AND  n.nspname NOT IN ('pg_catalog','information_schema')
          AND  EXISTS (
                SELECT 1
                FROM information_schema.columns ic
                WHERE ic.table_schema = n.nspname
                  AND ic.table_name   = c.relname
                  AND (ic.udt_name = 'geometry' OR ic.udt_name = 'geography'
                       OR lower(ic.column_name) IN ('geom','geometry','the_geom'))
              )
          AND  (
               """ + " OR ".join(["(n.nspname || '.' || c.relname) ILIKE %s"] * len(CANDIDATE_STATION_NAMES)) + """
              )
        LIMIT 20;
        """, tuple(CANDIDATE_STATION_NAMES))
        candidates = cur.fetchall()

        # 2) parmi ces tables, retourne la première qui a une "colonne nom"
        for row in candidates:
            fullname = f"{row['schema']}.{row['table']}"
            name_col = pick_first_existing(fullname, CANDIDATE_NAME_COLS)
            if name_col:
                return fullname

    # Fallback simple: première table avec geometry + une colonne 'name/nom'
    with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
        SELECT n.nspname AS schema, c.relname AS table
        FROM   pg_class c
        JOIN   pg_namespace n ON n.oid = c.relnamespace
        WHERE  c.relkind IN ('r','v','m')
          AND  n.nspname NOT IN ('pg_catalog','information_schema')
          AND  EXISTS (
                SELECT 1
                FROM information_schema.columns ic
                WHERE ic.table_schema = n.nspname
                  AND ic.table_name   = c.relname
                  AND (ic.udt_name = 'geometry' OR ic.udt_name = 'geography'
                       OR lower(ic.column_name) IN ('geom','geometry','the_geom'))
              )
          AND  EXISTS (
                SELECT 1
                FROM information_schema.columns ic
                WHERE ic.table_schema = n.nspname
                  AND ic.table_name   = c.relname
                  AND lower(ic.column_name) IN ('name','nom','libelle','station','label','libelle_station')
              )
        LIMIT 1;
        """)
        r = cur.fetchone()
        if r:
            return f"{r['schema']}.{r['table']}"
    return None
