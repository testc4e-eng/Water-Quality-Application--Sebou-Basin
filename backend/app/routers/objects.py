from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal

router = APIRouter(tags=["objects"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/stations")
def get_stations(db: Session = Depends(get_db)):
    sql = text("""
        SELECT
          id_station::int       AS id,
          COALESCE(nom_station, name, nom) AS name,
          ire_station::text     AS ire_station,
          ST_Y(ST_Transform(COALESCE(ST_PointOnSurface(geom), geom), 4326)) AS lat,
          ST_X(ST_Transform(COALESCE(ST_PointOnSurface(geom), geom), 4326)) AS lon
        FROM public.stations_abhs
        WHERE geom IS NOT NULL
    """)
    return [dict(r) for r in db.execute(sql).mappings().all()]

@router.get("/barrages")
def get_barrages(db: Session = Depends(get_db)):
    sql = text("""
        SELECT
          id::int           AS id,
          COALESCE(nom_barrage, nom, name) AS nom_barrage,
          COALESCE(nom_oued, oued, NULL)   AS nom_oued,
          COALESCE(statut, NULL)           AS statut,
          COALESCE(type_barrage, NULL)     AS type_barrage,
          COALESCE(hauteur, NULL)          AS hauteur,
          COALESCE(apports_hm, NULL)       AS apports_hm,
          COALESCE(capacite, NULL)         AS capacite,
          COALESCE(mise_en_se, NULL)       AS mise_en_se,
          ST_Y(ST_Transform(COALESCE(ST_PointOnSurface(geom), geom), 4326)) AS lat,
          ST_X(ST_Transform(COALESCE(ST_PointOnSurface(geom), geom), 4326)) AS lon
        FROM public.barrages_abhs
        WHERE geom IS NOT NULL
    """)
    return [dict(r) for r in db.execute(sql).mappings().all()]
