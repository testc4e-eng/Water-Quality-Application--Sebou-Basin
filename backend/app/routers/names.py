# backend/app/routers/names.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal

router = APIRouter()


# ---------- Session DB ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Tables & colonnes ----------
NAMES_MAP = {
    # Hydrologie
    "sous-bassins": ("public.sous_bassin_sebou", "id", "nom_sous_bassin"),
    "barrages": ("public.barrages_abhs", "id", "nom_barrage"),
    "stations": ("public.stations_abhs", "id_station", "nom_station"),

    # Administratif
    "regions":   ("public.adm_regions_abhs",   "code_region",   "region_fr"),
    "provinces": ("public.adm_provinces_abhs", "code_province", "province_fr"),
    "cercles":   ("public.adm_cercles_abhs",   "code_cercle",   "cercle_fr"),
    "communes":  ("public.adm_communes_abhs",  "code_commune",  "commune_fr"),
    "villes":    ("public.adm_villes_abhs",    "id",            "nom_ville"),
    "douars":    ("public.adm_douars_abhs",    "code_douar",    "douar_fr"),
}


@router.get("/{entity}")
def get_names(entity: str, db: Session = Depends(get_db)):

    # 🔥 NORMALISATION (corrige le problème _ vs -)
    key = entity.strip().lower().replace("_", "-")

    if key not in NAMES_MAP:
        raise HTTPException(status_code=404, detail=f"Type inconnu : {entity}")

    table, id_col, name_col = NAMES_MAP[key]

    try:
        sql = text(f"""
            SELECT {id_col} AS id, {name_col} AS label
            FROM {table}
            WHERE {name_col} IS NOT NULL
            ORDER BY {name_col} ASC;
        """)

        rows = db.execute(sql).mappings().all()

        data = [{"id": str(r["id"]), "label": r["label"]} for r in rows]

        print(f"✅ /names/{key} -> {len(data)} éléments")

        return data

    except Exception as e:
        print(f"❌ Erreur /names/{key}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
