from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.get("/geojson/barrages")
def get_barrages(db: Session = Depends(get_db)):
    sql = """
    SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(geom)::jsonb,
                'properties', jsonb_build_object(
                    'id', id,
                    'nom_barrage', nom_barrage,
                    'nom_oued', nom_oued,
                    'statut', statut,
                    'type_barrage', type_barrage,
                    'hauteur', hauteur,
                    'apports_hm', apports_hm,
                    'mise_en_se', mise_en_se
                )
            )
        )
    )
    FROM barrages_abhs
    WHERE geom IS NOT NULL;
    """
    row = db.execute(sql).scalar()
    return row
