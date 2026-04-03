# backend/app/routers/layers.py
from typing import Dict, Optional
import re
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
    "stms": {
        "table": "public.stms",
        "id_col": "id",
        "name_col": "Nom",
        "geom_col": "geom",
    },
    "steps": {
        "table": "public.steps",
        "id_col": "id",
        "name_col": "Code_STEP",
        "geom_col": "geom",
    },
    "steps_industrielles": {
        "table": "public.steps_industrielles",
        "id_col": "id",
        "name_col": "Nom",
        "geom_col": "geom",
    },
    "decharges": {
        "table": "public.decharges",
        "id_col": "id",
        "name_col": "nom",
        "geom_col": "geom",
    },
    "decharges_abandonnees": {
        "table": "public.decharges_Abondonees",
        "id_col": "id",
        "name_col": "Nom",
        "geom_col": "geom",
    },
    "rejets_brutes": {
        "table": "public.rejets_brutes",
        "id_col": "id",
        "name_col": "Code_rejet",
        "geom_col": "geom",
    },
    "rejet_abattoir": {
        "table": "public.rejet_abattoir",
        "id_col": "id",
        "name_col": "id",
        "geom_col": "geom",
    },
    "huileries": {
        "table": "public.Huileries",
        "id_col": "id",
        "name_col": "Nom",
        "geom_col": "geom",
    },
    "mines": {
        "table": "public.mines",
        "id_col": "id",
        "name_col": "Nom",
        "geom_col": "geom",
    },
}

ALIASES: Dict[str, str] = {
    "stations": "stms",
    "step": "steps",
    "steps": "steps",
    "steps-industrielles": "steps_industrielles",
    "decharges-abandonnees": "decharges_abandonnees",
    "rejets": "rejets_brutes",
    "abattoir": "rejet_abattoir",
    "huileries": "huileries",
    "mines": "mines",
}


def _q_ident(name: str) -> str:
    if re.match(r"^[a-z_][a-z0-9_]*$", name):
        return name
    return f'"{name.replace("\"", "\"\"")}"'


def _q_table(fullname: str) -> str:
    if "." in fullname:
        schema, table = fullname.split(".", 1)
        return f"{_q_ident(schema)}.{_q_ident(table)}"
    return _q_ident(fullname)

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
        table_sql = _q_table(table)
        id_sql = _q_ident(id_col)
        geom_sql = _q_ident(geom_col)

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
                        WHEN ST_SRID(t.{geom_sql}) = 4326 THEN ST_AsGeoJSON(t.{geom_sql})::jsonb
                        ELSE ST_AsGeoJSON(ST_Transform(t.{geom_sql}, 4326))::jsonb
                    END,
                'properties', to_jsonb(t) - '{geom_col}'
            ) AS feature
            FROM {table_sql} AS t
            WHERE t.{geom_sql} IS NOT NULL
        """

        params = {}
        if ids:
            id_list = [i.strip() for i in ids.split(",") if i.strip()]
            if id_list:
                are_all_numeric = all(x.replace(".", "", 1).isdigit() for x in id_list)
                placeholders = ", ".join([f":id{i}" for i in range(len(id_list))])
                sql += f" AND t.{id_sql} IN ({placeholders})"
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
