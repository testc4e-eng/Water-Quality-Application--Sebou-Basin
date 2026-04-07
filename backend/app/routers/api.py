# backend/app/routers/api.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from pyproj import Transformer
from app.db.session import SessionLocal

router = APIRouter(prefix="/api/v1", tags=["api"])

# ✅ Gestion de la session SQLAlchemy
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- STATIONS --------------------
@router.get("/stations", summary="Liste des stations hydrologiques et piézométriques")
def get_stations(db: Session = Depends(get_db)):
    try:
        sql = text("""
            SELECT id_station, nom_station, type_station, coord_x, coord_y
            FROM public.stations_abhs
            WHERE coord_x IS NOT NULL AND coord_y IS NOT NULL
        """)
        rows = db.execute(sql).fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="Aucune station trouvée dans la base")

        # ✅ Conversion Lambert Maroc (EPSG:26191) → WGS84
        transformer = Transformer.from_crs("EPSG:26191", "EPSG:4326", always_xy=True)
        stations = []

        for r in rows:
            try:
                lon, lat = transformer.transform(r.coord_x, r.coord_y)
            except Exception:
                lon, lat = None, None

            stations.append({
                "id": r.id_station,
                "nom_station": r.nom_station,
                "type_station": r.type_station,
                "longitude": lon,
                "latitude": lat
            })

        return stations

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {e}")


# -------------------- BARRAGES --------------------
@router.get("/barrages", summary="Liste des barrages")
def get_barrages(db: Session = Depends(get_db)):
    try:
        sql = text("""
            SELECT
                id,
                nom_barrage,
                nom_oued,
                statut,
                type_barrage,
                hauteur,
                apports_hm,
                vrn_hm3,
                mise_en_se,
                coord_x,
                coord_y
            FROM public.barrages_abhs
            WHERE coord_x IS NOT NULL AND coord_y IS NOT NULL
            ORDER BY id
        """)
        rows = db.execute(sql).fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="Aucun barrage trouvé dans la base")

        # ✅ Conversion Lambert → WGS84 (EPSG:26191)
        transformer = Transformer.from_crs("EPSG:26191", "EPSG:4326", always_xy=True)
        barrages = []

        for r in rows:
            try:
                lon, lat = transformer.transform(r.coord_x, r.coord_y)
            except Exception:
                lon, lat = None, None

            barrages.append({
                "id": r.id,
                "nom_barrage": r.nom_barrage,
                "nom_oued": r.nom_oued,
                "statut": r.statut,
                "type_barrage": r.type_barrage,
                "hauteur": r.hauteur,
                "apports_hm": r.apports_hm,
                "vrn_hm3": r.vrn_hm3,
                "mise_en_se": r.mise_en_se,
                "longitude": lon,
                "latitude": lat
            })

        return barrages

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {e}")


# -------------------- ALERTES --------------------
@router.get("/alerts", summary="Liste des alertes actives")
def get_alerts(limit: int = 50):
    # 🔸 Ici, on simule encore des alertes, mais tu pourras ensuite les lier à ta BD
    return [
        {
            "id": 1,
            "stationId": 13,
            "stationName": "Sebou Fez",
            "type": "Alerte test",
            "date": "2025-10-07T08:00:00",
            "message": "Débit anormal détecté",
        },
        {
            "id": 2,
            "stationId": 34,
            "stationName": "Oulad Yaacoub",
            "type": "Alerte débit",
            "date": "2025-10-10T10:30:00",
            "message": "Débit inférieur à la normale",
        }
    ][:limit]
