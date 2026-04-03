# backend/app/api/v1/stations.py
import os
from fastapi import APIRouter, HTTPException, Query
from app.db_raw import conn
from app.util_dbmeta import (
    get_geom_column, pick_first_existing, get_primary_key,
    table_exists, find_candidate_station_table
)

router = APIRouter(prefix="/stations")

# 1) table depuis variable d'env, sinon auto-détection
TABLE = os.getenv("STATIONS_TABLE")
if TABLE is None:
    for candidate in ("api.v_station_dimension", "api.v_profils_stations", find_candidate_station_table()):
        if candidate and table_exists(candidate):
            TABLE = candidate
            break
TBL_DEBIT = os.getenv("TBL_DEBIT", "public.mesures_debit_jr")
TBL_TEMP = os.getenv("TBL_TEMP", "public.mesures_temperatures_jr")
TBL_QUAL = os.getenv("TBL_QUAL", "public.mesures_qualite_rivieres")
STATION_COL_CANDIDATES = ["ire_station", "station_id", "id_station", "station_code", "code_station"]

@router.get("")
def list_stations(
    limit: int = 1000,
    with_data: bool = Query(True, description="Ne retourner que les stations avec mesures"),
):
    if not TABLE or not table_exists(TABLE):
        raise HTTPException(500, "Table des stations introuvable. Définis STATIONS_TABLE ou renomme la table.")

    pk = get_primary_key(TABLE) or "id"
    id_col = pick_first_existing(TABLE, ["legacy_station_id", "station_id", "id_station", "id"]) or pk
    name_col = pick_first_existing(
        TABLE,
        ["station_nom", "nom_station", "name", "nom", "libelle", "libelle_station", "station", "label"],
    ) or id_col
    river_col = pick_first_existing(TABLE, ["river","riviere","cours_eau","oued","nom_oued","bassin","sous_bassin"])
    ire_col = pick_first_existing(TABLE, ["ire_station", "legacy_code_station", "code_station"])
    geom_col = get_geom_column(TABLE)
    if not geom_col:
        raise HTTPException(500, f"Colonne géométrique introuvable sur {TABLE}")

    if river_col:
        river_sql = f"{river_col} AS river"
    else:
        river_sql = "NULL AS river"

    with_data_sql = ""
    join_data_sql = ""
    if with_data and ire_col:
        debit_station_col = pick_first_existing(TBL_DEBIT, STATION_COL_CANDIDATES) if table_exists(TBL_DEBIT) else None
        temp_station_col = pick_first_existing(TBL_TEMP, STATION_COL_CANDIDATES) if table_exists(TBL_TEMP) else None
        qual_station_col = pick_first_existing(TBL_QUAL, STATION_COL_CANDIDATES) if table_exists(TBL_QUAL) else None
        unions = []

        if debit_station_col:
            unions.append(f"SELECT DISTINCT trim({debit_station_col}::text) AS ire FROM {TBL_DEBIT}")
        if temp_station_col:
            unions.append(f"SELECT DISTINCT trim({temp_station_col}::text) AS ire FROM {TBL_TEMP}")
        if qual_station_col:
            unions.append(f"SELECT DISTINCT trim({qual_station_col}::text) AS ire FROM {TBL_QUAL}")

        if unions:
            with_data_sql = "WITH station_data AS (\n" + "\nUNION\n".join(unions) + "\n)"
            join_data_sql = f"JOIN station_data sd ON sd.ire = trim(s.{ire_col}::text)"

    sql = f"""
        {with_data_sql}
        SELECT
          {id_col} AS id,
          {name_col} AS name,
          {river_sql},
          ST_Y({geom_col}::geometry) AS lat,
          ST_X({geom_col}::geometry) AS lon
        FROM {TABLE} s
        {join_data_sql}
        WHERE s.{geom_col} IS NOT NULL
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
