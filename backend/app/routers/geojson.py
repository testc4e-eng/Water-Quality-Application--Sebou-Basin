# backend/app/routers/geojson.py
from __future__ import annotations

from typing import Optional, Dict, Tuple
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal

router = APIRouter(prefix="/geojson", tags=["geojson"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------------------------------------------------
# Catalogue des couches (layer_key -> (schema.table, pk, label, geom_col))
# Adapte les noms ci-dessous à ta BD. Si la colonne geom est différente,
# change "geom" par le bon nom.
# ------------------------------------------------------------
CATALOG: Dict[str, Tuple[str, str, str, str]] = {
    #  key                    table                       pk        label_prop           geom
    "stations":            ("public.stations_abh",       "id",     "nom",               "geom"),
    "barrages":            ("public.barrages_abh",       "id",     "nom_barrage",       "geom"),
    "bassin":              ("public.bassin_sebou",       "id",     "nom",               "geom"),
    "sous_bassin":         ("public.sous_bassin_sebou",  "id",     "nom",               "geom"),
    "adm_regions":         ("public.adm_regions_abhs",   "id",     "nom",               "geom"),
    "adm_provinces":       ("public.adm_provinces_abhs", "id",     "nom",               "geom"),
    "adm_communes":        ("public.adm_communes_abhs",  "id",     "nom",               "geom"),
    "adm_cercles":         ("public.adm_cercles_abhs",   "id",     "nom",               "geom"),
    "adm_douars":          ("public.adm_douars_abhs",    "id",     "nom",               "geom"),
    "adm_villes":          ("public.adm_villes_abhs",    "id",     "nom",               "geom"),
    "reseau_hydro":        ("public.reseau_hydro_abhs",  "id",     "nom",               "geom"),
    "step":                ("public.step_abhs",          "id",     "nom",               "geom"),
    "step_ind":            ("public.step_ind_abhs",      "id",     "nom",               "geom"),
    "stm":                 ("public.stm_abhs",           "id",     "nom",               "geom"),
}

@router.get("/_catalog", summary="Liste des couches disponibles")
def list_layers():
    return {"layers": list(CATALOG.keys())}

@router.get("/_ping", summary="GeoJSON de test")
def ping_geojson():
    return {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {"name": "Point test"},
            "geometry": {"type": "Point", "coordinates": [-5.0, 34.0]}
        }]
    }

def _sql_bbox(bbox: Optional[str], geom_col: str) -> Optional[str]:
    """
    bbox = "minx,miny,maxx,maxy" en EPSG:4326
    Construit un filtre ST_Intersects.
    """
    if not bbox:
        return None
    parts = bbox.split(",")
    if len(parts) != 4:
        return None
    try:
        minx, miny, maxx, maxy = [float(x) for x in parts]
    except Exception:
        return None
    # BOX en 4326 → on transformera la géométrie avant l’intersection
    return f"ST_Intersects(ST_Transform({geom_col}, 4326), ST_MakeEnvelope({minx},{miny},{maxx},{maxy}, 4326))"

@router.get("/{layer_key}", summary="Renvoie un FeatureCollection (GeoJSON)")
def get_layer_geojson(
    layer_key: str,
    db: Session = Depends(get_db),
    limit: int = Query(0, ge=0, le=100000),
    simplify: float = Query(0.0, ge=0.0, description="Tolérance simplification (m) en SRID de la table"),
    bbox: Optional[str] = Query(None, description="minx,miny,maxx,maxy en EPSG:4326"),
    where: Optional[str] = Query(None, description="Filtre SQL sûr (ex: statut='Actif')"),
):
    if layer_key not in CATALOG:
        raise HTTPException(status_code=404, detail=f"Layer inconnu: {layer_key}")

    table, pk, label_prop, geom_col = CATALOG[layer_key]

    # WHERE dynamique sécurisé au minimum : pas de ; ni DROP etc. (soft guard)
    filters = []
    bbox_sql = _sql_bbox(bbox, geom_col)
    if bbox_sql:
        filters.append(bbox_sql)

    if where:
        # très simple garde-fou : refuse quelques mots dangereux
        bad = [";", "--", "/*", "*/", "drop", "delete", "update", "insert", "alter"]
        txt = where.lower()
        if any(w in txt for w in bad):
            raise HTTPException(status_code=400, detail="Paramètre 'where' non autorisé")
        filters.append(where)

    where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

    # Simplification éventuelle (dans le SRID natif de la table)
    geom_expr = geom_col
    if simplify and simplify > 0:
        geom_expr = f"ST_SimplifyPreserveTopology({geom_col}, {simplify})"

    q = f"""
        SELECT {pk} AS gid,
               COALESCE({label_prop}::text, '{layer_key}') AS label,
               ST_AsGeoJSON(ST_Transform({geom_expr}, 4326))::json AS geometry
        FROM {table}
        {where_clause}
        {"LIMIT " + str(limit) if limit else ""}
    """

    try:
        rows = db.execute(text(q)).fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur DB: {e}")

    features = []
    for gid, label, geom in rows:
        if not geom:
            continue
        features.append({
            "type": "Feature",
            "id": gid,
            "properties": {"id": gid, "name": label},
            "geometry": geom
        })

    return {"type": "FeatureCollection", "features": features}
