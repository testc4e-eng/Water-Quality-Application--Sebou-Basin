# backend/app/routers/measurements.py

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal

router = APIRouter(prefix="/stations", tags=["measurements"])


# ---------------- DB SESSION ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- MESURES ----------------
@router.get("/{station_id}/measurements", summary="Mesures qualité par station")
def get_measurements(
    station_id: str,  # ⚠️ ire_station est TEXT (ex: '1000/23')
    from_date: str | None = Query(None, alias="from"),
    to_date: str | None = Query(None, alias="to"),
    db: Session = Depends(get_db),
):
    """
    Retourne une série temporelle des paramètres qualité
    pour une station donnée (NO3, pH, DBO5, DCO, O2 dissous).
    """

    try:
        sql = """
            SELECT
                date_prelevement AS date,
                MAX(CASE WHEN parametre_qualite ILIKE 'NO3%' THEN val_qual_riv END) AS no3,
                MAX(CASE WHEN parametre_qualite ILIKE 'ph%' THEN val_qual_riv END) AS ph,
                MAX(CASE WHEN parametre_qualite ILIKE 'DBO%' THEN val_qual_riv END) AS dbo5,
                MAX(CASE WHEN parametre_qualite ILIKE 'DCO%' THEN val_qual_riv END) AS dco,
                MAX(CASE WHEN parametre_qualite ILIKE 'O2%' THEN val_qual_riv END) AS o2
            FROM public.mesures_qualite_rivieres
            WHERE ire_station = :station_id
        """

        params = {"station_id": station_id}

        if from_date:
            sql += " AND date_prelevement >= :from_date"
            params["from_date"] = from_date

        if to_date:
            sql += " AND date_prelevement <= :to_date"
            params["to_date"] = to_date

        sql += """
            GROUP BY date_prelevement
            ORDER BY date_prelevement ASC
        """

        rows = db.execute(text(sql), params).fetchall()

        return [
            {
                "date": str(r.date),
                "no3": r.no3,
                "ph": r.ph,
                "dbo5": r.dbo5,
                "dco": r.dco,
                "o2": r.o2,
            }
            for r in rows
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur base de données : {e}",
        )
