# backend/app/routers/layers.py
from typing import Dict, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal

router = APIRouter(tags=["layers"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

LayerCfg = Dict[str, str]

LAYER_MAP: Dict[str, LayerCfg] = {
    "bassin_sebou": {
        "table": "public.bassin_sebou",
        "id_col": "id",
        "name_col": "nom",
        "geom_col": "geom",
    },
    "sous_bassin_sebou": {
        "table": "public.sous_bassin_sebou",
        "id_col": "id",
        "name_col": "nom_sous_bassin",
        "geom_col": "geom",
    },
    "reseau_hydro_abhs": {
        "table": "public.reseau_hydro_abhs",
        "id_col": "id",
        "name_col": "nom_oued",
        "geom_col": "geom",
    },
    "barrages_abhs": {
        "table": "public.barrages_abhs",
        "id_col": "id",
        "name_col": "nom_barrage",
        "geom_col": "geom",
    },
    "stations_abhs": {
        "table": "public.stations_abhs",
        "id_col": "id_station",
        "name_col": "nom_station",
        "geom_col": "geom",
    },
    "adm_regions_abhs": {
        "table": "public.adm_regions_abhs",
        "id_col": "code_region",
        "name_col": "region_fr",
        "geom_col": "geom",
    },
    "adm_provinces_abhs": {
        "table": "public.adm_provinces_abhs",
        "id_col": "code_province",
        "name_col": "province_fr",
        "geom_col": "geom",
    },
    "adm_cercles_abhs": {
        "table": "public.adm_cercles_abhs",
        "id_col": "code_cercle",
        "name_col": "cercle_fr",
        "geom_col": "geom",
    },
    "adm_communes_abhs": {
        "table": "public.adm_communes_abhs",
        "id_col": "code_commune",
        "name_col": "commune_fr",
        "geom_col": "geom",
    },
    "adm_villes_abhs": {
        "table": "public.adm_villes_abhs",
        "id_col": "id",
        "name_col": "nom_ville",
        "geom_col": "geom",
    },
    "adm_douars_abhs": {
        "table": "public.adm_douars_abhs",
        "id_col": "code_douar",
        "name_col": "douar_fr",
        "geom_col": "geom",
    },
}

ALIASES: Dict[str, str] = {
    "bassin": "bassin_sebou",
    "sous-bassin": "sous_bassin_sebou",
    "sous-bassins": "sous_bassin_sebou",
    "reseau": "reseau_hydro_abhs",
    "barrages": "barrages_abhs",
    "stations": "stations_abhs",
    "regions": "adm_regions_abhs",
    "provinces": "adm_provinces_abhs",
    "cercles": "adm_cercles_abhs",
    "communes": "adm_communes_abhs",
    "villes": "adm_villes_abhs",
    "douars": "adm_douars_abhs",
}

def _resolve_key(key: str) -> str:
    key = key.strip().lower().replace("-", "_")
    if key in LAYER_MAP:
        return key
    if key in ALIASES:
        return ALIASES[key]
    raise HTTPException(status_code=404, detail=f"Couche inconnue : {key}")

# ✅ ICI la seule correction importante : on enlève "/layers" (déjà mis dans api_v1.py)
@router.get("/{layer_key}")
def get_layer(
    layer_key: str,
    ids: Optional[str] = Query(None, description="Liste d'IDs séparés par des virgules"),
    db: Session = Depends(get_db),
):
    try:
        key = _resolve_key(layer_key)
        cfg = LAYER_MAP[key]
        table = cfg["table"]
        id_col = cfg["id_col"]
        geom_col = cfg["geom_col"]

        sql = f"""
        SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', COALESCE(jsonb_agg(features.feature), '[]'::jsonb)
        )
        FROM (
            SELECT jsonb_build_object(
                'type', 'Feature',
                'geometry',
                    CASE
                        WHEN ST_SRID({geom_col}) = 4326 THEN ST_AsGeoJSON({geom_col})::jsonb
                        ELSE ST_AsGeoJSON(ST_Transform({geom_col}, 4326))::jsonb
                    END,
                'properties', to_jsonb(t) - '{geom_col}'
            ) AS feature
            FROM {table} AS t
            WHERE {geom_col} IS NOT NULL
        """

        params = {}
        if ids:
            id_list = [i.strip() for i in ids.split(",") if i.strip()]
            if id_list:
                are_all_numeric = all(x.replace(".", "", 1).isdigit() for x in id_list)
                placeholders = ", ".join([f":id{i}" for i in range(len(id_list))])
                sql += f" AND {id_col} IN ({placeholders})"
                for i, val in enumerate(id_list):
                    params[f"id{i}"] = int(val) if are_all_numeric else val

        sql += ") AS features;"

        result = db.execute(text(sql), params).scalar()
        print(f"✅ Couche {key} chargée depuis {table} ({'filtrée' if ids else 'complète'})")

        if not result:
            return {"type": "FeatureCollection", "features": []}
        return result

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erreur chargement couche {layer_key}: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur base de données: {e}")
