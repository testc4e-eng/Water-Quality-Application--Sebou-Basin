# backend/app/routers/layers.py
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.util_dbmeta import (
    get_geojson_column,
    get_geom_column,
    get_primary_key,
    pick_first_existing,
    table_exists,
)

router = APIRouter(tags=["layers"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


LayerCfg = Dict[str, Any]

LAYER_MAP: Dict[str, LayerCfg] = {
    "bassin_sebou": {
        "sources": ["api.v_bassin_geojson"],
        "id_candidates": ["bassin_id", "id"],
        "name_candidates": ["nom", "bassin", "name", "label"],
    },
    "sous_bassin_sebou": {
        "sources": ["api.v_sous_bassin_geojson"],
        "id_candidates": ["sous_bassin_id", "id"],
        "name_candidates": ["nom_sous_bassin", "sous_bassin", "name", "label"],
    },
    "reseau_hydro_abhs": {
        "sources": ["public.reseau_hydro_abhs"],
        "id_candidates": ["id"],
        "name_candidates": ["nom_oued", "name", "label"],
    },
    "barrages_abhs": {
        "sources": ["api.v_barrage_dimension"],
        "id_candidates": ["barrage_id", "id"],
        "name_candidates": ["nom_barrage", "name", "label"],
    },
    "stations_abhs": {
        "sources": ["api.v_station_dimension", "api.v_profils_stations"],
        "id_candidates": ["legacy_station_id", "station_id", "id_station", "id"],
        "name_candidates": ["station_nom", "nom_station", "name", "label"],
    },
    "points_eau": {
        "sources": ["api.v_points_eau"],
        "id_candidates": ["point_eau_id", "id"],
        "name_candidates": ["nom_pt_eau", "code_pt_eau", "name", "label"],
    },
    "step_industrielles": {
        "sources": ["api.v_step_industrielles"],
        "id_candidates": ["step_id", "id", "code_step"],
        "name_candidates": ["nom_step", "code_step", "name", "label"],
    },
    "stm": {
        "sources": ["api.v_stm"],
        "id_candidates": ["stm_id", "id", "code_stm"],
        "name_candidates": ["nom_stm", "code_stm", "name", "label"],
    },
    "adm_regions_abhs": {
        "sources": ["public.adm_regions_abhs"],
        "id_candidates": ["code_region", "id"],
        "name_candidates": ["region_fr", "name", "label"],
    },
    "adm_provinces_abhs": {
        "sources": ["public.adm_provinces_abhs"],
        "id_candidates": ["code_province", "id"],
        "name_candidates": ["province_fr", "name", "label"],
    },
    "adm_cercles_abhs": {
        "sources": ["public.adm_cercles_abhs"],
        "id_candidates": ["code_cercle", "id"],
        "name_candidates": ["cercle_fr", "name", "label"],
    },
    "adm_communes_abhs": {
        "sources": ["public.adm_communes_abhs"],
        "id_candidates": ["code_commune", "id"],
        "name_candidates": ["commune_fr", "name", "label"],
    },
    "adm_villes_abhs": {
        "sources": ["public.adm_villes_abhs"],
        "id_candidates": ["id"],
        "name_candidates": ["nom_ville", "name", "label"],
    },
    "adm_douars_abhs": {
        "sources": ["public.adm_douars_abhs"],
        "id_candidates": ["code_douar", "id"],
        "name_candidates": ["douar_fr", "name", "label"],
    },
}

ALIASES: Dict[str, str] = {
    "bassin": "bassin_sebou",
    "sous-bassin": "sous_bassin_sebou",
    "sous-bassins": "sous_bassin_sebou",
    "reseau": "reseau_hydro_abhs",
    "barrages": "barrages_abhs",
    "stations": "stations_abhs",
    "points-eau": "points_eau",
    "points_eau": "points_eau",
    "step": "step_industrielles",
    "step-industrielles": "step_industrielles",
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


def _resolve_source(cfg: LayerCfg) -> tuple[str, str, str, str]:
    for source in cfg["sources"]:
        if not table_exists(source):
            continue

        geom_col = get_geom_column(source)
        id_col = pick_first_existing(source, cfg["id_candidates"]) or get_primary_key(source) or "id"
        if geom_col:
            return source, id_col, geom_col, "postgis"

        geojson_col = get_geojson_column(source)
        if geojson_col:
            return source, id_col, geojson_col, "geojson"

    raise HTTPException(
        status_code=404,
        detail="Aucune source cartographique compatible n'a ete trouvee pour cette couche",
    )


@router.get("/{layer_key}")
def get_layer(
    layer_key: str,
    ids: Optional[str] = Query(None, description="Liste d'IDs separes par des virgules"),
    db: Session = Depends(get_db),
):
    try:
        key = _resolve_key(layer_key)
        cfg = LAYER_MAP[key]
        table, id_col, geom_col, geom_mode = _resolve_source(cfg)

        if geom_mode == "geojson":
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
                            WHEN jsonb_typeof({geom_col}::jsonb) = 'object'
                                 AND ({geom_col}::jsonb ? 'type')
                                 AND ({geom_col}::jsonb ? 'coordinates' OR {geom_col}::jsonb ? 'geometries')
                            THEN {geom_col}::jsonb
                            WHEN jsonb_typeof({geom_col}::jsonb) = 'object'
                                 AND ({geom_col}::jsonb ? 'type')
                                 AND {geom_col}::jsonb ? 'geometry'
                            THEN ({geom_col}::jsonb -> 'geometry')
                            ELSE NULL
                        END,
                    'properties', to_jsonb(t) - '{geom_col}'
                ) AS feature
                FROM {table} AS t
                WHERE {geom_col} IS NOT NULL
            """
        else:
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
            id_list = [item.strip() for item in ids.split(",") if item.strip()]
            if id_list:
                are_all_numeric = all(value.replace(".", "", 1).isdigit() for value in id_list)
                placeholders = ", ".join([f":id{i}" for i in range(len(id_list))])
                sql += f" AND {id_col} IN ({placeholders})"
                for index, value in enumerate(id_list):
                    params[f"id{index}"] = int(value) if are_all_numeric else value

        if geom_mode == "geojson":
            sql += " AND ("
            sql += f"jsonb_typeof({geom_col}::jsonb) = 'object'"
            sql += f" AND ({geom_col}::jsonb ? 'type')"
            sql += ")"

        sql += ") AS features;"

        result = db.execute(text(sql), params).scalar()

        if not result:
            return {"type": "FeatureCollection", "features": []}
        return result

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erreur base de donnees: {exc}")
