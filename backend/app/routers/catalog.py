from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal

router = APIRouter(prefix="/catalog", tags=["catalog"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _fetch_pairs(db: Session, table: str, id_col: str, name_col: str):
    sql = text(f"SELECT {id_col}::text AS id, {name_col}::text AS name FROM {table} ORDER BY {name_col}")
    return [dict(r) for r in db.execute(sql).mappings().all()]

@router.get("/sous-bassins")
def catalog_sous_bassins(db: Session = Depends(get_db)):
    return _fetch_pairs(db, "public.sous_bassin_sebou", "id", "COALESCE(nom, libelle, name)")

@router.get("/barrages")
def catalog_barrages(db: Session = Depends(get_db)):
    return _fetch_pairs(db, "public.barrages_abhs", "id", "COALESCE(nom_barrage, nom, name)")

@router.get("/stations")
def catalog_stations(db: Session = Depends(get_db)):
    return _fetch_pairs(db, "public.stations_abhs", "id", "COALESCE(name, nom)")

@router.get("/zones-admin")
def catalog_zones_admin(db: Session = Depends(get_db)):
    # renvoie des groupes prédéfinis (régions, provinces, cercles, communes, villes, douars)
    return {
        "regions": _fetch_pairs(db, "public.adm_regions_abhs", "id", "COALESCE(nom, name)"),
        "provinces": _fetch_pairs(db, "public.adm_provinces_abhs", "id", "COALESCE(nom, name)"),
        "cercles": _fetch_pairs(db, "public.adm_cercles_abhs", "id", "COALESCE(nom, name)"),
        "communes": _fetch_pairs(db, "public.adm_communes_abhs", "id", "COALESCE(nom, name)"),
        "villes": _fetch_pairs(db, "public.adm_villes_abhs", "id", "COALESCE(nom, name)"),
        "douars": _fetch_pairs(db, "public.adm_douars_abhs", "id", "COALESCE(nom, name)"),
    }
