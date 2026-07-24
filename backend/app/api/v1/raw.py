# backend/app/api/v1/raw.py
import logging
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from typing import List, Optional, Dict, Any
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from app.db_raw import connection
from app.security.deps import require_roles
from app.util_dbmeta import get_geom_column, pick_first_existing, table_exists

logger = logging.getLogger(__name__)
# Accès brut aux tables (lecture/écriture/suppression par schema/table) :
# outil d'administration des données, réservé au rôle admin (RBAC réel).
router = APIRouter(
    prefix="/raw",
    tags=["Raw"],
    dependencies=[Depends(require_roles("admin"))],
)

# Heuristiques pour détection visuelle (optionnel désormais)
LAT_CANDIDATES = ["lat", "latitude", "y", "lat_dd"]
LON_CANDIDATES = ["lon", "long", "longitude", "x", "lng", "lon_dd"]

def _primary_key_column(schema: str, table: str) -> Optional[str]:
    """Détecte la clé primaire via le catalogue système PostgreSQL."""
    q = """
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = %s::regclass
        AND i.indisprimary
      LIMIT 1
    """
    regclass = f'"{schema}"."{table}"'
    try:
        with connection() as cx, cx.cursor() as cur:
            cur.execute(q, (regclass,))
            row = cur.fetchone()
            return row[0] if row else None
    except Exception as e:
        logger.warning(f"Erreur PK pour {regclass}: {e}")
        return None

@router.get("/tables")
def list_tables(schema: Optional[str] = Query(None)):
    """
    Liste les tables épurée des schémas techniques.
    Optimisation : Pas de détection de géométrie groupée (trop lent).
    """
    where_schema = "AND t.table_schema = %s" if schema else ""
    # On exclut les schémas systèmes et techniques (TimescaleDB, etc.)
    excluded_schemas = (
        'pg_catalog', 'information_schema', 'topology',
        '_timescaledb_cache', '_timescaledb_catalog', '_timescaledb_config',
        '_timescaledb_internal', 'timescaledb_experimental', 'timescaledb_information'
    )
    
    q = f"""
      SELECT t.table_schema, t.table_name
      FROM information_schema.tables t
      WHERE t.table_type IN ('BASE TABLE', 'VIEW', 'FOREIGN TABLE')
        AND t.table_schema NOT IN %s
        {where_schema}
      ORDER BY t.table_schema, t.table_name;
    """
    
    params = [excluded_schemas]
    if schema:
        params.append(schema)

    try:
        with connection() as cx, cx.cursor() as cur:
            cur.execute(q, params)
            rows = cur.fetchall()
            # On renvoie une liste d'objets {schema, table}
            out = [{"schema": r[0], "table": r[1]} for r in rows]
            return {"tables": out}
    except Exception as e:
        logger.error(f"Erreur list_tables: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{schema}/{table}/columns")
def table_columns(schema: str, table: str):
    """Métadonnées des colonnes pour le formulaire dynamique."""
    q = """
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema=%s AND table_name=%s
      ORDER BY ordinal_position
    """
    try:
        with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(q, (schema, table))
            return cur.fetchall()
    except Exception as e:
        logger.error(f"Erreur colonnes {schema}.{table}: {e}")
        raise HTTPException(500, f"Impossible de lire les colonnes : {e}")

@router.get("/{schema}/{table}/rows")
def table_rows(
    schema: str, table: str,
    limit: int = Query(100, ge=1, le=10000),
    offset: int = Query(0, ge=0),
    order_by: Optional[str] = None,
    desc: bool = True,
):
    """Lecture des données avec détection dynamique de la PK."""
    # Sécurisation des noms de table/schéma avec sql.Identifier
    query = sql.SQL("SELECT * FROM {}.{}").format(
        sql.Identifier(schema), sql.Identifier(table)
    )
    
    if order_by:
        query += sql.SQL(" ORDER BY {} {}").format(
            sql.Identifier(order_by),
            sql.SQL("DESC" if desc else "ASC")
        )
    
    query += sql.SQL(" LIMIT %s OFFSET %s")

    try:
        with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, (limit, offset))
            rows = cur.fetchall()
            pk = _primary_key_column(schema, table)
            return {
                "rows": rows,
                "primary_key": pk,
                "limit": limit,
                "offset": offset
            }
    except Exception as e:
        logger.error(f"Erreur rows {schema}.{table}: {e}")
        raise HTTPException(500, f"Erreur lecture : {e}")

@router.post("/{schema}/{table}")
def create_row(schema: str, table: str, data: Dict[str, Any] = Body(...)):
    if not data:
        raise HTTPException(400, "Données vides")

    # Nettoyage des colonnes géométriques (gérées par ailleurs ou PostGIS auto)
    clean_data = {k: (None if v == "" else v) for k, v in data.items()}
    for field in ["geom", "geometry", "the_geom", "shape"]:
        clean_data.pop(field, None)

    try:
        with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
            cols = list(clean_data.keys())
            if not cols:
                q = sql.SQL("INSERT INTO {}.{} DEFAULT VALUES RETURNING *").format(
                    sql.Identifier(schema), sql.Identifier(table)
                )
                cur.execute(q)
            else:
                q = sql.SQL("INSERT INTO {}.{} ( {cols} ) VALUES ( {vals} ) RETURNING *").format(
                    sql.Identifier(schema),
                    sql.Identifier(table),
                    cols=sql.SQL(", ").join(map(sql.Identifier, cols)),
                    vals=sql.SQL(", ").join(sql.Placeholder() * len(cols))
                )
                cur.execute(q, [clean_data[c] for c in cols])
            
            created = cur.fetchone()
            return {"status": "ok", "created": created}
    except Exception as e:
        logger.error(f"Erreur post {schema}.{table}: {e}")
        raise HTTPException(400, f"Insertion échouée : {e}")

@router.put("/{schema}/{table}/{row_id}")
def update_row(schema: str, table: str, row_id: str, data: Dict[str, Any] = Body(...)):
    pk_col = _primary_key_column(schema, table)
    if not pk_col:
        raise HTTPException(400, "Aucune clé primaire détectée pour cette table")

    clean_data = {k: (None if v == "" else v) for k, v in data.items() if k != pk_col}
    if not clean_data:
        raise HTTPException(400, "Aucune donnée à modifier")

    try:
        with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
            set_clause = sql.SQL(", ").join(
                sql.SQL("{} = {}").format(sql.Identifier(k), sql.Placeholder())
                for k in clean_data.keys()
            )
            q = sql.SQL("UPDATE {}.{} SET {set} WHERE {pk} = {val} RETURNING *").format(
                sql.Identifier(schema),
                sql.Identifier(table),
                set=set_clause,
                pk=sql.Identifier(pk_col),
                val=sql.Placeholder()
            )
            params = list(clean_data.values()) + [row_id]
            cur.execute(q, params)
            updated = cur.fetchone()
            if not updated:
                raise HTTPException(404, "Enregistrement non trouvé")
            return {"status": "ok", "updated": updated}
    except Exception as e:
        logger.error(f"Erreur update {schema}.{table}: {e}")
        raise HTTPException(400, f"Mise à jour échouée : {e}")

@router.delete("/{schema}/{table}/{row_id}")
def delete_row(schema: str, table: str, row_id: str):
    pk_col = _primary_key_column(schema, table)
    if not pk_col:
        raise HTTPException(400, "Aucune clé primaire détectée")

    try:
        with connection() as cx, cx.cursor(cursor_factory=RealDictCursor) as cur:
            q = sql.SQL("DELETE FROM {}.{} WHERE {} = {} RETURNING *").format(
                sql.Identifier(schema),
                sql.Identifier(table),
                sql.Identifier(pk_col),
                sql.Placeholder()
            )
            cur.execute(q, (row_id,))
            deleted = cur.fetchone()
            if not deleted:
                raise HTTPException(404, "Enregistrement non trouvé")
            return {"status": "ok", "deleted": deleted}
    except Exception as e:
        logger.error(f"Erreur delete {schema}.{table}: {e}")
        raise HTTPException(400, f"Suppression échouée : {e}")
