# backend/app/routers/layers.py
from typing import Annotated, Any, Dict, Optional, Tuple, Union

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

# Geometry simplification tolerances (in source SRID units) to keep responses fast.
# 0 disables simplification for that layer.
SIMPLIFY_TOLERANCE: Dict[str, float] = {
    "bassin_sebou": 0.0,
    "sous_bassin_sebou": 0.0,
    "sous_bassins_swat": 0.0015,
    "nappes": 0.0,
    "sources": 0.0,
    "reseau_hydro_abhs": 8.0,
    "barrages_abhs": 0.0,
    "stations_abhs": 0.0,
    "points_eau": 0.0,
    "decharges_abhs": 0.0,
    "huileries_abhs": 0.0,
    "mines_abhs": 0.0,
    "rejets_industriels_abhs": 0.0,
    "rejets_domestiques_abhs": 0.0,
    "step_abhs": 0.0,
    "fosses_septiques_abhs": 0.0,
    "step_industrielles": 0.0,
    "stm": 0.0,
    "adm_regions_abhs": 80.0,
    "adm_provinces_abhs": 40.0,
    "adm_cercles_abhs": 20.0,
    "adm_communes_abhs": 12.0,
    "adm_villes_abhs": 0.0,
    "adm_douars_abhs": 0.0,
}

LAYER_MAX_FEATURE_CAP: Dict[str, int] = {
    "bassin_sebou": 200,
    "sous_bassin_sebou": 800,
    "sous_bassins_swat": 900,
    "nappes": 1200,
    "sources": 1200,
    "reseau_hydro_abhs": 3500,
    "barrages_abhs": 1200,
    "stations_abhs": 1200,
    "points_eau": 1200,
    "decharges_abhs": 1200,
    "huileries_abhs": 1200,
    "mines_abhs": 1200,
    "rejets_industriels_abhs": 1200,
    "rejets_domestiques_abhs": 1200,
    "step_abhs": 1200,
    "fosses_septiques_abhs": 1200,
    "step_industrielles": 1200,
    "stm": 1200,
    "adm_regions_abhs": 80,
    "adm_provinces_abhs": 300,
    "adm_cercles_abhs": 1000,
    "adm_communes_abhs": 1500,
    "adm_villes_abhs": 800,
    "adm_douars_abhs": 1500,
}

GLOBAL_COORD_PRECISION = 5
MAX_FEATURES_WITHOUT_FILTER = 900

LAYER_MAP: Dict[str, LayerCfg] = {
    "bassin_sebou": {
        "sources": ["api.mv_bassin_geojson", "api.v_bassin_geojson"],
        "id_candidates": ["bassin_id", "id"],
        "name_candidates": ["nom", "bassin", "name", "label"],
    },
    "sous_bassin_sebou": {
        "sources": ["api.mv_sous_bassin_geojson", "api.v_sous_bassin_geojson"],
        "id_candidates": ["sous_bassin_id", "id"],
        "name_candidates": ["nom_sous_bassin", "sous_bassin", "name", "label"],
    },
    "sous_bassins_swat": {
        "sources": ["api.mv_sous_bassin_swat_geom_4326", "api.mv_sous_bassin_swat_geojson", "api.v_sous_bassin_swat_geojson"],
        "id_candidates": ["subbasin_id", "id"],
        "name_candidates": ["name", "label"],
    },
    "nappes": {
        "sources": ["api.mv_nappes_geojson", "api.v_nappes_geojson"],
        "id_candidates": ["code", "id"],
        "name_candidates": ["name", "nom_nappe", "label"],
    },
    "sources": {
        "sources": ["api.mv_sources_geojson", "api.v_sources_geojson"],
        "id_candidates": ["code", "id"],
        "name_candidates": ["name", "nom_source", "label"],
    },
    "reseau_hydro_abhs": {
        "sources": ["api.mv_reseau_hydrographique", "api.v_reseau_hydrographique_geojson", "geo.reseau_hydrographique"],
        "id_candidates": ["id", "id_oued", "objectid"],
        "name_candidates": ["nom_oued", "nom", "name", "label"],
    },
    "barrages_abhs": {
        "sources": ["api.mv_barrage_dimension", "api.v_barrage_dimension"],
        "id_candidates": ["barrage_id", "id"],
        "name_candidates": ["nom_barrage", "name", "label"],
    },
    "stations_abhs": {
        "sources": ["api.mv_station_dimension", "api.v_station_dimension", "api.v_profils_stations", "infra.stations_mesure"],
        "id_candidates": ["legacy_station_id", "station_id", "id_station", "id"],
        "name_candidates": ["station_nom", "nom_station", "name", "label"],
    },
    "points_eau": {
        "sources": ["api.mv_points_eau", "api.v_points_eau"],
        "id_candidates": ["point_eau_id", "id"],
        "name_candidates": ["nom_pt_eau", "code_pt_eau", "name", "label"],
    },
    "decharges_abhs": {
        "sources": ["api.v_inventaire_pollution_decharges_consolide", "infra.decharge_inventaire_pollution_general", "infra.decharge"],
        "id_candidates": ["decharge_id", "id", "source_row_id"],
        "name_candidates": ["nom_decharge", "nom_site", "code_decharge", "name", "label"],
    },
    "huileries_abhs": {
        "sources": ["api.v_inventaire_pollution_huileries_detail", "infra.huilerie_inventaire_pollution", "infra.huilerie"],
        "id_candidates": ["huilerie_id", "id", "source_row_id"],
        "name_candidates": ["nom_huilerie", "code_huilerie", "name", "label"],
    },
    "mines_abhs": {
        "sources": ["api.v_inventaire_pollution_mines_detail", "infra.mine_inventaire_pollution", "infra.mine"],
        "id_candidates": ["mine_id", "id", "source_row_id"],
        "name_candidates": ["nom_mine", "code_mine", "name", "label"],
    },
    "rejets_industriels_abhs": {
        "sources": ["infra.rejet_industriel"],
        "id_candidates": ["id", "code_rejet"],
        "name_candidates": ["nom_rejet", "code_rejet", "name", "label"],
    },
    "rejets_domestiques_abhs": {
        "sources": ["api.v_inventaire_pollution_rejets_bruts_detail", "infra.rejet_domestique"],
        "id_candidates": ["rejet_domestique_id", "id", "source_row_id", "code_rejet"],
        "name_candidates": ["code_rejet", "name", "label"],
    },
    "step_abhs": {
        "sources": ["api.v_inventaire_pollution_steps_detail", "infra.step"],
        "id_candidates": ["step_id", "id", "source_row_id", "code_step"],
        "name_candidates": ["code_step", "nom_step", "name", "label"],
    },
    "fosses_septiques_abhs": {
        "sources": ["api.v_infra_fosses_septiques_geojson", "infra.fosses_septiques_abhs"],
        "id_candidates": ["id", "gid"],
        "name_candidates": ["name", "commune_fr", "centre_fr", "label"],
    },
    "step_industrielles": {
        "sources": ["api.v_step_industrielles", "api.v_inventaire_pollution_steps_industrielles_detail", "infra.step_industrielle"],
        "id_candidates": ["step_id", "id", "code_step"],
        "name_candidates": ["nom_step", "code_step", "name", "label"],
    },
    "stm": {
        "sources": ["api.v_stm"],
        "id_candidates": ["stm_id", "id", "code_stm"],
        "name_candidates": ["nom_stm", "code_stm", "name", "label"],
    },
    "adm_regions_abhs": {
        "sources": ["admin.regions"],
        "id_candidates": ["code_region", "id"],
        "name_candidates": ["region_fr", "name", "label"],
    },
    "adm_provinces_abhs": {
        "sources": ["admin.provinces"],
        "id_candidates": ["code_province", "id"],
        "name_candidates": ["province_fr", "name", "label"],
    },
    "adm_cercles_abhs": {
        "sources": ["admin.cercle"],
        "id_candidates": ["code_cercle", "id"],
        "name_candidates": ["cercle_fr", "name", "label"],
    },
    "adm_communes_abhs": {
        "sources": ["admin.communes"],
        "id_candidates": ["code_commune", "id"],
        "name_candidates": ["commune_fr", "name", "label"],
    },
    "adm_villes_abhs": {
        "sources": ["api.mv_admin_villes_points", "admin.villes", "admin.localite", "admin.communes"],
        "id_candidates": ["code_ville", "code_commune", "code_commu", "id"],
        "name_candidates": ["ville_fr", "commune_fr", "douar_fr", "name", "label"],
    },
    "adm_douars_abhs": {
        "sources": ["admin.localite"],
        "id_candidates": ["code_douar", "id"],
        "name_candidates": ["douar_fr", "name", "label"],
    },
}

ALIASES: Dict[str, str] = {
    "bassin": "bassin_sebou",
    "sous-bassin": "sous_bassin_sebou",
    "sous-bassins": "sous_bassin_sebou",
    "sous-bassins-swat": "sous_bassins_swat",
    "swat": "sous_bassins_swat",
    "reseau": "reseau_hydro_abhs",
    "barrages": "barrages_abhs",
    "stations": "stations_abhs",
    "nappes": "nappes",
    "sources": "sources",
    "points-eau": "points_eau",
    "points_eau": "points_eau",
    "decharges": "decharges_abhs",
    "huileries": "huileries_abhs",
    "mines": "mines_abhs",
    "rejets-industriels": "rejets_industriels_abhs",
    "rejets-domestiques": "rejets_domestiques_abhs",
    "rejets": "rejets_domestiques_abhs",
    "step-abhs": "step_abhs",
    "fosses-septiques": "fosses_septiques_abhs",
    "fosses_septiques": "fosses_septiques_abhs",
    "step": "step_industrielles",
    "step-industrielles": "step_industrielles",
    "regions": "adm_regions_abhs",
    "provinces": "adm_provinces_abhs",
    "cercles": "adm_cercles_abhs",
    "communes": "adm_communes_abhs",
    "villes": "adm_villes_abhs",
    "douars": "adm_douars_abhs",
}


def _build_postgis_sql(table: str, geom_col: str, simplify_tolerance: float = 0.0) -> str:
    """Builds SQL for PostGIS geometry sources as FeatureCollection."""
    geom_expr = f"{geom_col}"
    if simplify_tolerance and simplify_tolerance > 0:
        geom_expr = f"ST_SimplifyPreserveTopology({geom_col}, {simplify_tolerance})"

    return f"""
SELECT jsonb_build_object(
  'type', 'FeatureCollection',
  'features', COALESCE(jsonb_agg(feature), '[]'::jsonb)
)
FROM (
  SELECT jsonb_build_object(
    'type', 'Feature',
    'id', row_number() OVER (),
    'geometry', ST_AsGeoJSON(ST_Transform({geom_expr}, 4326), {GLOBAL_COORD_PRECISION})::jsonb,
    'properties', to_jsonb(t) - '{geom_col}'
  ) AS feature
  FROM {table} t
  WHERE {geom_col} IS NOT NULL
    AND ST_IsValid({geom_col})
"""


def _build_geojson_sql(table: str, geojson_col: str) -> str:
    """Builds SQL for native GeoJSON/jsonb geometry sources as FeatureCollection."""
    return f"""
SELECT jsonb_build_object(
  'type', 'FeatureCollection',
  'features', COALESCE(jsonb_agg(feature), '[]'::jsonb)
)
FROM (
  SELECT jsonb_build_object(
    'type', 'Feature',
    'id', row_number() OVER (),
    'geometry', {geojson_col}::jsonb,
    'properties', to_jsonb(t) - '{geojson_col}'
  ) AS feature
  FROM {table} t
  WHERE {geojson_col} IS NOT NULL
"""


def _apply_geo_sanity_filter(sql: str, geom_mode: str, geom_col: str) -> str:
    """
    Filters out obviously invalid coordinates for point geometries.
    Keeps non-point geometries untouched.
    """
    if geom_mode == "postgis":
        sql += f"""
        AND (
          GeometryType({geom_col}) NOT IN ('POINT', 'MULTIPOINT')
          OR (
            ST_X(ST_Transform(ST_Centroid({geom_col}), 4326)) BETWEEN -180 AND 180
            AND ST_Y(ST_Transform(ST_Centroid({geom_col}), 4326)) BETWEEN -90 AND 90
            AND ST_X(ST_Transform(ST_Centroid({geom_col}), 4326)) <> 0
            AND ST_Y(ST_Transform(ST_Centroid({geom_col}), 4326)) <> 0
          )
        )
        """
        return sql

    sql += f"""
    AND (
      ({geom_col}::jsonb ->> 'type') IS NULL
      OR lower({geom_col}::jsonb ->> 'type') <> 'point'
      OR (
        (({geom_col}::jsonb -> 'coordinates' ->> 0)::double precision BETWEEN -180 AND 180)
        AND (({geom_col}::jsonb -> 'coordinates' ->> 1)::double precision BETWEEN -90 AND 90)
        AND (({geom_col}::jsonb -> 'coordinates' ->> 0)::double precision <> 0)
        AND (({geom_col}::jsonb -> 'coordinates' ->> 1)::double precision <> 0)
      )
    )
    """
    return sql


def _resolve_key(key: str) -> str:
    """Resolves a layer key or its alias to its internal mapping key."""
    key = key.strip().lower().replace("-", "_")
    if key in LAYER_MAP:
        return key
    if key in ALIASES:
        return ALIASES[key]
    raise HTTPException(status_code=404, detail=f"Couche inconnue : {key}")


def _resolve_source(cfg: LayerCfg) -> Tuple[str, str, str, str]:
    """Finds the first valid table source and its geometry configuration."""
    for source in cfg["sources"]:
        if not table_exists(source):
            continue

        geom_col = get_geom_column(source)
        id_col = (
            pick_first_existing(source, cfg["id_candidates"])
            or get_primary_key(source)
            or "id"
        )
        if geom_col:
            return source, id_col, geom_col, "postgis"

        geojson_col = get_geojson_column(source)
        if geojson_col:
            return source, id_col, geojson_col, "geojson"

    raise HTTPException(
        status_code=404,
        detail="Aucune source cartographique compatible n'a été trouvée pour cette couche",
    )


def _resolve_name_source(cfg: LayerCfg) -> Tuple[str, str, str]:
    for source in cfg["sources"]:
        if not table_exists(source):
            continue
        id_col = pick_first_existing(source, cfg["id_candidates"]) or get_primary_key(source) or "id"
        label_col = pick_first_existing(source, cfg.get("name_candidates", [])) or id_col
        return source, id_col, label_col
    raise HTTPException(status_code=404, detail="Aucune source de nommage trouvée pour cette couche")


def _apply_id_filter(sql: str, ids: Optional[str], id_col: str) -> Tuple[str, Dict[str, Union[str, int]]]:
    """Applies ID filtering to the SQL query if ids are provided."""
    params: Dict[str, Union[str, int]] = {}
    if not ids:
        return sql, params

    id_list = [item.strip() for item in ids.split(",") if item.strip()]
    if not id_list:
        return sql, params

    are_all_numeric = all(value.replace(".", "", 1).isdigit() for value in id_list)
    placeholders = ", ".join([f":id{i}" for i in range(len(id_list))])
    sql += f" AND {id_col} IN ({placeholders})"
    for index, value in enumerate(id_list):
        params[f"id{index}"] = int(value) if are_all_numeric else value

    return sql, params


def _parse_bbox(bbox: str) -> Tuple[float, float, float, float]:
    raw = [part.strip() for part in bbox.split(",")]
    if len(raw) != 4:
        raise HTTPException(status_code=422, detail="bbox doit contenir 4 valeurs: minx,miny,maxx,maxy")
    try:
        minx, miny, maxx, maxy = [float(v) for v in raw]
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="bbox invalide (valeurs non numériques)") from exc
    if minx >= maxx or miny >= maxy:
        raise HTTPException(status_code=422, detail="bbox invalide: min doit être < max")
    return minx, miny, maxx, maxy


def _apply_bbox_filter(
    sql: str,
    bbox: Optional[str],
    geom_col: str,
) -> Tuple[str, Dict[str, Union[str, int, float]]]:
    params: Dict[str, Union[str, int, float]] = {}
    if not bbox:
        return sql, params

    minx, miny, maxx, maxy = _parse_bbox(bbox)
    sql += f"""
      AND (
        CASE
          WHEN ST_SRID({geom_col}) = 0 THEN TRUE
          ELSE (
            {geom_col} && ST_Transform(
              ST_MakeEnvelope(:_minx, :_miny, :_maxx, :_maxy, 4326),
              ST_SRID({geom_col})
            )
            AND ST_Intersects(
              {geom_col},
              ST_Transform(
                ST_MakeEnvelope(:_minx, :_miny, :_maxx, :_maxy, 4326),
                ST_SRID({geom_col})
              )
            )
          )
        END
      )
    """
    params["_minx"] = minx
    params["_miny"] = miny
    params["_maxx"] = maxx
    params["_maxy"] = maxy
    return sql, params


def _apply_bbox_filter_geojson(
    sql: str,
    bbox: Optional[str],
    geojson_col: str,
) -> Tuple[str, Dict[str, Union[str, int, float]]]:
    """
    BBOX filter for GeoJSON/jsonb geometry sources.
    Parses geometry safely then applies ST_Intersects in WGS84.
    """
    params: Dict[str, Union[str, int, float]] = {}
    if not bbox:
        return sql, params

    minx, miny, maxx, maxy = _parse_bbox(bbox)
    sql += f"""
      AND ST_Intersects(
        ST_SetSRID(ST_GeomFromGeoJSON({geojson_col}::text), 4326),
        ST_MakeEnvelope(:_minx, :_miny, :_maxx, :_maxy, 4326)
      )
    """
    params["_minx"] = minx
    params["_miny"] = miny
    params["_maxx"] = maxx
    params["_maxy"] = maxy
    return sql, params


def _resolve_effective_max_features(
    layer_key: str,
    requested_max: int,
    bbox: Optional[str],
    ids: Optional[str],
) -> int:
    layer_cap = LAYER_MAX_FEATURE_CAP.get(layer_key, 3000)
    capped = min(requested_max, layer_cap)
    if not bbox and not ids:
        return min(capped, MAX_FEATURES_WITHOUT_FILTER)
    return capped


@router.get("/{layer_key}/names")
def get_layer_names(
    layer_key: str,
    limit: Annotated[int, Query(ge=1, le=10000, description="Max éléments renvoyés")] = 2000,
    offset: Annotated[int, Query(ge=0, description="Décalage pagination")] = 0,
    q: Annotated[Optional[str], Query(description="Filtre texte (label)")] = None,
    db: Annotated[Session, Depends(get_db)] = None,
):
    key = _resolve_key(layer_key)
    cfg = LAYER_MAP[key]
    table, id_col, label_col = _resolve_name_source(cfg)
    try:
        sql = text(
            f"""
            SELECT DISTINCT {id_col}::text AS id, {label_col}::text AS label
            FROM {table}
            WHERE {label_col} IS NOT NULL
              AND btrim({label_col}::text) <> ''
              AND (:q IS NULL OR lower({label_col}::text) LIKE '%' || lower(:q) || '%')
            ORDER BY {label_col}::text
            OFFSET :_offset
            LIMIT :_limit
            """
        )
        rows = db.execute(sql, {"_limit": limit, "_offset": offset, "q": q}).mappings().all()
        return [{"id": r["id"], "label": r["label"]} for r in rows]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erreur base de données: {exc}") from exc


@router.get(
    "/{layer_key}",
    responses={
        404: {"description": "Layer not found or no valid source found"},
        500: {"description": "Database or internal server error"},
    },
)
def get_layer(
    layer_key: str,
    ids: Annotated[
        Optional[str], Query(description="Liste d'IDs séparés par des virgules")
    ] = None,
    bbox: Annotated[
        Optional[str],
        Query(
            description="Emprise WGS84 minx,miny,maxx,maxy pour filtrer au viewport",
            examples=["-6.8,33.7,-4.2,35.3"],
        ),
    ] = None,
    max_features: Annotated[
        int, Query(ge=1, le=50000, description="Nombre max d'entités renvoyées")
    ] = 3000,
    db: Annotated[Session, Depends(get_db)] = None,
):
    """
    Récupère une couche cartographique au format GeoJSON.
    La couche peut être filtrée par une liste d'IDs.
    """
    try:
        key = _resolve_key(layer_key)
        cfg = LAYER_MAP[key]
        table, id_col, geom_col, geom_mode = _resolve_source(cfg)
        simplify_tolerance = SIMPLIFY_TOLERANCE.get(key, 0.0)

        if geom_mode == "geojson":
            sql = _build_geojson_sql(table, geom_col)
        else:
            sql = _build_postgis_sql(table, geom_col, simplify_tolerance=simplify_tolerance)

        sql = _apply_geo_sanity_filter(sql, geom_mode, geom_col)
        sql, params = _apply_id_filter(sql, ids, id_col)

        if geom_mode == "postgis":
            sql, bbox_params = _apply_bbox_filter(sql, bbox, geom_col)
            params.update(bbox_params)
        elif geom_mode == "geojson":
            sql, bbox_params = _apply_bbox_filter_geojson(sql, bbox, geom_col)
            params.update(bbox_params)

        if geom_mode == "geojson":
            sql += f" AND (jsonb_typeof({geom_col}::jsonb) = 'object' AND ({geom_col}::jsonb ? 'type'))"

        effective_max = _resolve_effective_max_features(
            layer_key=key,
            requested_max=max_features,
            bbox=bbox,
            ids=ids,
        )
        sql += " LIMIT :_max_features) AS features;"
        params["_max_features"] = effective_max

        result = db.execute(text(sql), params).scalar()
        return result or {"type": "FeatureCollection", "features": []}

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Erreur base de données: {exc}"
        ) from exc


@router.get("/{layer_key}/entity/{entity_id}")
def get_layer_entity_details(
    layer_key: str,
    entity_id: str,
    db: Annotated[Session, Depends(get_db)] = None,
):
    """
    Returns one entity attribute payload by layer and id for right-side details panel.
    """
    key = _resolve_key(layer_key)
    cfg = LAYER_MAP[key]
    table, id_col, geom_col, geom_mode = _resolve_source(cfg)
    geom_drop_col = geom_col
    sql = text(
        f"""
        SELECT to_jsonb(t) - :_geom_col AS properties
        FROM {table} t
        WHERE {id_col}::text = :_entity_id
        LIMIT 1
        """
    )
    row = db.execute(
        sql,
        {"_entity_id": entity_id, "_geom_col": geom_drop_col},
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Entité introuvable")

    return {
        "layer_key": key,
        "entity_id": entity_id,
        "properties": row["properties"] or {},
        "geom_mode": geom_mode,
    }

