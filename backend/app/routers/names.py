from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.util_dbmeta import get_primary_key, pick_first_existing, table_exists

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


NAMES_MAP = {
    "sous-bassins": {
        "sources": ["public.sous_bassin_sebou"],
        "id_candidates": ["id"],
        "label_candidates": ["nom_sous_bassin", "label", "name"],
    },
    "barrages": {
        "sources": ["api.v_barrage_dimension"],
        "id_candidates": ["barrage_id", "id"],
        "label_candidates": ["nom_barrage", "label", "name"],
    },
    "stations": {
        "sources": ["api.v_station_dimension", "api.v_profils_stations"],
        "id_candidates": ["legacy_station_id", "station_id", "id_station", "id"],
        "label_candidates": ["station_nom", "nom_station", "label", "name"],
    },
    "regions": {
        "sources": ["public.adm_regions_abhs"],
        "id_candidates": ["code_region", "id"],
        "label_candidates": ["region_fr", "label", "name"],
    },
    "provinces": {
        "sources": ["public.adm_provinces_abhs"],
        "id_candidates": ["code_province", "id"],
        "label_candidates": ["province_fr", "label", "name"],
    },
    "cercles": {
        "sources": ["public.adm_cercles_abhs"],
        "id_candidates": ["code_cercle", "id"],
        "label_candidates": ["cercle_fr", "label", "name"],
    },
    "communes": {
        "sources": ["public.adm_communes_abhs"],
        "id_candidates": ["code_commune", "id"],
        "label_candidates": ["commune_fr", "label", "name"],
    },
    "villes": {
        "sources": ["public.adm_villes_abhs"],
        "id_candidates": ["id"],
        "label_candidates": ["nom_ville", "label", "name"],
    },
    "douars": {
        "sources": ["public.adm_douars_abhs"],
        "id_candidates": ["code_douar", "id"],
        "label_candidates": ["douar_fr", "label", "name"],
    },
}


def _resolve_source(cfg: dict) -> tuple[str, str, str]:
    for source in cfg["sources"]:
        if not table_exists(source):
            continue
        id_col = pick_first_existing(source, cfg["id_candidates"]) or get_primary_key(source) or "id"
        label_col = pick_first_existing(source, cfg["label_candidates"]) or id_col
        return source, id_col, label_col
    raise HTTPException(status_code=404, detail="Source de nomenclature introuvable")


@router.get("/{entity}")
def get_names(entity: str, db: Session = Depends(get_db)):
    key = entity.strip().lower().replace("_", "-")

    if key not in NAMES_MAP:
        raise HTTPException(status_code=404, detail=f"Type inconnu : {entity}")

    table, id_col, name_col = _resolve_source(NAMES_MAP[key])

    try:
        sql = text(
            f"""
            SELECT {id_col} AS id, {name_col} AS label
            FROM {table}
            WHERE {name_col} IS NOT NULL
            ORDER BY {name_col} ASC;
            """
        )

        rows = db.execute(sql).mappings().all()
        return [{"id": str(row["id"]), "label": row["label"]} for row in rows]

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
