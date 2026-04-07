from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from pyproj import Transformer
from app.db.session import SessionLocal

router = APIRouter(prefix="/api/v1", tags=["stations"])

# --- DB Session ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Endpoint principal ---
@router.get("/stations")
def get_stations(db: Session = Depends(get_db)):
    """
    Retourne la liste des stations avec coordonnées WGS84 (EPSG:4326)
    sous la forme attendue par le front-end Dashboard.
    """
    try:
        sql = text("""
            SELECT id_station, nom_station, coord_x, coord_y, region, nom_oued
            FROM public.stations_abhs
            WHERE (coord_x IS NOT NULL AND coord_y IS NOT NULL)
        """)
        rows = db.execute(sql).fetchall()

        # Transformer Lambert (EPSG:26191) → WGS84 (EPSG:4326)
        transformer = Transformer.from_crs("EPSG:26191", "EPSG:4326", always_xy=True)

        stations = []
        for r in rows:
            try:
                lon, lat = transformer.transform(r.coord_x, r.coord_y)
                # Vérifie qu’on a bien des valeurs numériques
                if lon is None or lat is None:
                    continue
                stations.append({
                    "id": str(r.id_station),
                    "name": r.nom_station or "",
                    "region": r.region or "",
                    "river": r.nom_oued or "",
                    "coords": {"lat": lat, "lon": lon}
                })
            except Exception:
                continue  # ignore la station si erreur de conversion

        return stations

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {e}")
