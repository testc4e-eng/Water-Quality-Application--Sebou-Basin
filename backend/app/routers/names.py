from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.util_dbmeta import get_primary_key, pick_first_existing, table_exists

router = APIRouter()
legacy_router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


NAMES_MAP = {
    "sous-bassins": {
        "sources": ["geo.sous_bassin_abh"],
        "id_candidates": ["id"],
        "label_candidates": ["nom", "nom_sous_bassin", "label", "name"],
    },
    "barrages": {
        "sources": ["api.v_barrage_dimension"],
        "id_candidates": ["barrage_id", "legacy_barrage_id", "id"],
        "label_candidates": ["barrage_nom", "nom_barrage", "label", "name"],
    },
    "stations": {
        "sources": ["api.v_station_dimension", "api.v_profils_stations"],
        "id_candidates": ["station_id", "legacy_station_id", "id_station", "id"],
        "label_candidates": ["station_nom", "nom_station", "label", "name"],
    },
    "regions": {
        "sources": ["admin.regions"],
        "id_candidates": ["code_region", "id"],
        "label_candidates": ["region_fr", "label", "name"],
    },
    "provinces": {
        "sources": ["admin.provinces"],
        "id_candidates": ["code_province", "id"],
        "label_candidates": ["province_fr", "label", "name"],
    },
    "cercles": {
        "sources": ["admin.cercle"],
        "id_candidates": ["code_cercle", "id"],
        "label_candidates": ["cercle_fr", "label", "name"],
    },
    "communes": {
        "sources": ["admin.communes"],
        "id_candidates": ["code_commune", "id"],
        "label_candidates": ["commune_fr", "label", "name"],
    },
    "villes": {
        "sources": [],
        "id_candidates": ["id"],
        "label_candidates": ["nom_ville", "label", "name"],
    },
    "douars": {
        "sources": [],
        "id_candidates": ["code_douar", "id"],
        "label_candidates": ["douar_fr", "label", "name"],
    },
}


def _resolve_source(cfg: dict) -> tuple[str, str, str] | None:
    if not cfg["sources"]:
        return None
    for source in cfg["sources"]:
        if not table_exists(source):
            continue
        id_col = pick_first_existing(source, cfg["id_candidates"]) or get_primary_key(source) or "id"
        label_col = pick_first_existing(source, cfg["label_candidates"]) or id_col
        return source, id_col, label_col
    return None


@router.get("/{entity}")
def get_names(entity: str, db: Session = Depends(get_db)):
    key = entity.strip().lower().replace("_", "-")

    if key not in NAMES_MAP:
        raise HTTPException(status_code=404, detail=f"Type inconnu : {entity}")

    resolved = _resolve_source(NAMES_MAP[key])
    if not resolved:
        return []
    table, id_col, name_col = resolved

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


@legacy_router.get("/sous-bassins")
def legacy_catalog_sous_bassins(db: Session = Depends(get_db)):
    return get_names("sous-bassins", db)


@legacy_router.get("/barrages")
def legacy_catalog_barrages(db: Session = Depends(get_db)):
    return get_names("barrages", db)


@legacy_router.get("/stations")
def legacy_catalog_stations(db: Session = Depends(get_db)):
    return get_names("stations", db)


@legacy_router.get("/zones-admin")
def legacy_catalog_zones_admin(db: Session = Depends(get_db)):
    return {
        "regions": get_names("regions", db),
        "provinces": get_names("provinces", db),
        "cercles": get_names("cercles", db),
        "communes": get_names("communes", db),
        "villes": get_names("villes", db),
        "douars": get_names("douars", db),
    }
