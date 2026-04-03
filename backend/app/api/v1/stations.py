# backend/app/api/v1/stations.py
import os
import re
from fastapi import APIRouter, HTTPException, Query
from app.db_raw import conn
from app.util_dbmeta import (
    get_geom_column, pick_first_existing, get_primary_key,
    table_exists, find_candidate_station_table
)

router = APIRouter(prefix="/stations")

def _q_ident(name: str) -> str:
    if re.match(r"^[a-z_][a-z0-9_]*$", name):
        return name
    return f'"{name.replace("\"", "\"\"")}"'

# 1) table depuis variable d'env, sinon auto-détection
TABLE = os.getenv("STATIONS_TABLE")
if TABLE is None or not table_exists(TABLE):
    if table_exists("public.stms"):
        TABLE = "public.stms"
    else:
        TABLE = find_candidate_station_table()
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
    id_col = pick_first_existing(TABLE, ["id_station", "id", "Id", "ID"]) or pk
    name_col = pick_first_existing(
        TABLE,
        ["nom_station", "name", "nom", "Nom", "libelle", "libelle_station", "station", "label"],
    ) or id_col
    river_col = pick_first_existing(TABLE, ["river","riviere","cours_eau","oued","nom_oued"])
    ire_col = pick_first_existing(TABLE, ["ire_station", "code_station"])
    geom_col = get_geom_column(TABLE)
    x_col = pick_first_existing(TABLE, ["x", "X"])
    y_col = pick_first_existing(TABLE, ["y", "Y"])
    if not geom_col and not (x_col and y_col):
        raise HTTPException(500, f"Colonne géométrique introuvable sur {TABLE}")

    id_sql = _q_ident(id_col)
    name_sql = _q_ident(name_col)
    river_sql = f"{_q_ident(river_col)} AS river" if river_col else "NULL AS river"
    ire_sql = _q_ident(ire_col) if ire_col else None
    geom_sql = _q_ident(geom_col) if geom_col else None
    x_sql = _q_ident(x_col) if x_col else None
    y_sql = _q_ident(y_col) if y_col else None

    if river_col:
        river_sql = f"{_q_ident(river_col)} AS river"
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
            unions.append(f"SELECT DISTINCT trim({_q_ident(debit_station_col)}::text) AS ire FROM {TBL_DEBIT}")
        if temp_station_col:
            unions.append(f"SELECT DISTINCT trim({_q_ident(temp_station_col)}::text) AS ire FROM {TBL_TEMP}")
        if qual_station_col:
            unions.append(f"SELECT DISTINCT trim({_q_ident(qual_station_col)}::text) AS ire FROM {TBL_QUAL}")

        if unions:
            with_data_sql = "WITH station_data AS (\n" + "\nUNION\n".join(unions) + "\n)"
            join_data_sql = f"JOIN station_data sd ON sd.ire = trim(s.{ire_sql}::text)"

    if geom_col:
        lat_sql = f"ST_Y(s.{geom_sql}::geometry)"
        lon_sql = f"ST_X(s.{geom_sql}::geometry)"
        where_sql = f"WHERE s.{geom_sql} IS NOT NULL"
    else:
        lat_sql = f"s.{y_sql}"
        lon_sql = f"s.{x_sql}"
        where_sql = f"WHERE s.{x_sql} IS NOT NULL AND s.{y_sql} IS NOT NULL"

    sql = f"""
        {with_data_sql}
        SELECT
          s.{id_sql} AS id,
          s.{name_sql} AS name,
          {river_sql},
          {lat_sql} AS lat,
          {lon_sql} AS lon
        FROM {TABLE} s
        {join_data_sql}
        {where_sql}
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
