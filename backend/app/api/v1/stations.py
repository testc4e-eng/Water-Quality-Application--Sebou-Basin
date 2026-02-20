# backend/app/api/v1/stations.py
import os
from fastapi import APIRouter, HTTPException
from app.db_raw import conn
from app.util_dbmeta import (
    get_geom_column, pick_first_existing, get_primary_key,
    table_exists, find_candidate_station_table
)

router = APIRouter(prefix="/stations")

# 1) table depuis variable d'env, sinon auto-détection
TABLE = os.getenv("STATIONS_TABLE")
if TABLE is None:
    TABLE = find_candidate_station_table()

@router.get("")
def list_stations(limit: int = 1000):
    if not TABLE or not table_exists(TABLE):
        raise HTTPException(500, "Table des stations introuvable. Définis STATIONS_TABLE ou renomme la table.")

    pk = get_primary_key(TABLE) or "id"
    name_col = pick_first_existing(TABLE, ["name","nom","libelle","libelle_station","station","label"]) or pk
    river_col = pick_first_existing(TABLE, ["river","riviere","cours_eau","oued","nom_oued"])
    geom_col = get_geom_column(TABLE)
    if not geom_col:
        raise HTTPException(500, f"Colonne géométrique introuvable sur {TABLE}")

    if river_col:
        river_sql = f"{river_col} AS river"
    else:
        river_sql = "NULL AS river"

    sql = f"""
        SELECT
          {pk} AS id,
          {name_col} AS name,
          {river_sql},
          ST_Y({geom_col}::geometry) AS lat,
          ST_X({geom_col}::geometry) AS lon
        FROM {TABLE}
        WHERE {geom_col} IS NOT NULL
        LIMIT %s
        """


    with conn() as cx:
        with cx.cursor() as cur:
            cur.execute(sql, (limit,))
            rows = cur.fetchall()
            return [
                {"id": r[0], "name": r[1], "river": r[2], "lat": float(r[3]), "lon": float(r[4])}
                for r in rows
            ]
