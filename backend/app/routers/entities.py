# backend/app/routers/entities.py
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------- Stations -------
@router.get("/stations", summary="Stations (format simple)")
def get_stations(db: Session = Depends(get_db)):
    sql = text("""
    SELECT
        id_station::text AS id,
        COALESCE(nom_station,'') AS name,
        NULL::text AS river,
        ST_Y(geom)::float8 AS lat,
        ST_X(geom)::float8 AS lon
    FROM public.stations_abhs
    WHERE geom IS NOT NULL
""")

    try:
        rows = db.execute(sql).fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    out: List[Dict[str, Any]] = []
    for r in rows:
        out.append({
            "id": r.id,
            "name": r.name,
            "river": None,
            "lat": float(r.lat) if r.lat is not None else None,
            "lon": float(r.lon) if r.lon is not None else None,
        })
    return out

# ------- Barrages -------
@router.get("/barrages", summary="Barrages (format simple)")
def get_barrages(db: Session = Depends(get_db)):
    sql = text("""
        SELECT
            id::int AS id,
            COALESCE(nom_barrage,'') AS nom_barrage,
            nom_oued::text,
            statut::text,
            type_barrage::text,
            hauteur::float8,
            apports_hm::float8,
            mise_en_se::text,
            coord_x::float8,
            coord_y::float8
        FROM public.barrages_abhs
    """)
    try:
        rows = db.execute(sql).fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    out: List[Dict[str, Any]] = []
    for r in rows:
        out.append({
            "id": int(r.id),
            "nom_barrage": r.nom_barrage,
            "nom_oued": r.nom_oued,
            "statut": r.statut,
            "type_barrage": r.type_barrage,
            "hauteur": float(r.hauteur) if r.hauteur is not None else None,
            "apports_hm": float(r.apports_hm) if r.apports_hm is not None else None,
            "mise_en_se": r.mise_en_se,
            "coord_x": float(r.coord_x) if r.coord_x is not None else None,
            "coord_y": float(r.coord_y) if r.coord_y is not None else None,
        })
    return out

# ------- Alerts (placeholder) -------
@router.get("/alerts", summary="Alertes")
def get_alerts():
    # Branchez vos vraies alertes ici. On renvoie une liste vide pour éviter les 404.
    return []
