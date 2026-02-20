#backend/app/api/v1/geojson.py
import os
from fastapi import APIRouter, HTTPException
from app.db_raw import connection
from app.util_dbmeta import get_geom_column, table_exists, find_first_table_like

router = APIRouter(prefix="/geojson")

# Env overrides possibles (sinon on tente une recherche par motif)
ENV_TABLES = {
    "bassin_sebou":      os.getenv("BASSIN_TABLE"),
    "sous_bassin_sebou": os.getenv("SOUSBASSIN_TABLE"),
    "reseau_hydro_abhs":      os.getenv("RESEAU_TABLE"),
    "stations_abh":    os.getenv("STATIONS_TABLE"),
    "barrages":    os.getenv("BARRAGES_TABLE"),
    "points_eau":  os.getenv("POINTSEAU_TABLE"),
    "mines":       os.getenv("MINES_TABLE"),
    "capteurs":    os.getenv("CAPTEURS_TABLE"),
}

FALLBACK_LIKE = {
    "bassin":      ["%.bassin_sebou%", "%.bassin%", "%watershed%", "%bassin%sebou%"],
    "sous_bassin": ["%.sous_bassin_sebou%", "%sub_basin%", "%sousbassin%"],
    "reseau":      ["%.reseau_hydro_abhs%", "%.network%", "%.hydro%"],
    "stations":    ["%.stations_abh%", "%.station%", "%.points%mesure%"],
    "barrages":    ["%.barrages_abhs%", "%.barrages%"],
    "points_eau":  ["%.points_eau%", "%.point_eau%", "%.sources%", "%.puits%"],
    "mines":       ["%.mine%", "%.mines%"],
    "capteurs":    ["%.capteur%", "%.capteurs%", "%.iot%"],
}

def _resolve_table(layer_key: str) -> str:
    env_table = ENV_TABLES.get(layer_key)
    if env_table and table_exists(env_table):
        return env_table
    # fallback par motif
    tbl = find_first_table_like(FALLBACK_LIKE.get(layer_key, []))
    if tbl and table_exists(tbl):
        return tbl
    raise HTTPException(404, f"Couche inconnue: {layer_key}. Renseigne une table via variable d'env.")

@router.get("/{layer_key}")
def layer_geojson(layer_key: str, limit: int = 10000):
    table = _resolve_table(layer_key)
    geom_col = get_geom_column(table)
    if not geom_col:
        raise HTTPException(500, f"Colonne géométrique introuvable sur {table}")

    sql = f"""
      SELECT jsonb_build_object(
        'type','FeatureCollection',
        'features', COALESCE(jsonb_agg(
          jsonb_build_object(
            'type','Feature',
            'geometry', ST_AsGeoJSON({geom_col})::jsonb,
            'properties', to_jsonb(t) - '{geom_col}'
          )
        ), '[]'::jsonb)
      )
      FROM (
        SELECT * FROM {table}
        WHERE {geom_col} IS NOT NULL
        LIMIT %s
      ) AS t
    """
    with connection() as cx:
        with cx.cursor() as cur:
            cur.execute(sql, (limit,))
            (fc,) = cur.fetchone()
            return fc
