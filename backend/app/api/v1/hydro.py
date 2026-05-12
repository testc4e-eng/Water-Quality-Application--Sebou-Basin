# backend/app/api/v1/hydro.py
# LEGACY — route GeoJSON barrages.
# Correction 2026-04-14 : la table `barrages_abhs` n'existe plus dans le schéma `public`.
# Les données sont dans `infra.barrages`. Correction de la requête + compatibilité SQLAlchemy 2.x.

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter()


@router.get("/geojson/barrages", tags=["geojson"])
def get_barrages(db: Session = Depends(get_db)):
    """
    Retourne les barrages du bassin en GeoJSON.
    Source : infra.barrages (remplace l'ancienne table barrages_abhs du schéma public).
    """
    sql = text("""
        SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', COALESCE(jsonb_agg(
                jsonb_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(geom)::jsonb,
                    'properties', jsonb_build_object(
                        'id',           id,
                        'nom_barrage',  nom_barrage,
                        'nom_oued',     nom_oued,
                        'statut',       statut,
                        'type_barrage', type_barrage,
                        'hauteur',      hauteur,
                        'apports_hm',   apports_hm,
                        'mise_en_se',   mise_en_se
                    )
                )
            ), '[]'::jsonb)
        ) AS geojson
        FROM infra.barrages
        WHERE geom IS NOT NULL;
    """)
    row = db.execute(sql).scalar()
    return row
