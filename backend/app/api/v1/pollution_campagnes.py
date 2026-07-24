from __future__ import annotations

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.climate_database import get_climate_db
from app.models import pollution_campagnes_models as models
from app.services import pollution_campagnes_service as service

router = APIRouter(prefix="/pollution", tags=["Pollution Campagnes"])


@router.get("/campagnes", response_model=list[models.CampagneSummary])
def get_campagnes(db: Session = Depends(get_climate_db)) -> list[dict]:
    """Synthèse des campagnes de prélèvement (déduction provisoire par date)."""
    return service.list_campagnes(db)


@router.get("/prelevements", response_model=list[models.PrelevementListItem])
def get_prelevements(
    date_from: Optional[date] = Query(None, description="Date de début (YYYY-MM-DD)"),
    date_to: Optional[date] = Query(None, description="Date de fin (YYYY-MM-DD)"),
    campagne: Optional[str] = Query(None, description="ID de campagne, ex: IDP_GLOBALE_2024"),
    site: Optional[str] = Query(None, description="Recherche libre sur le nom du point"),
    parametre: Optional[str] = Query(None, description="Code paramètre, ex: Cd"),
    limit: int = Query(500, ge=1, le=2000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_climate_db),
) -> list[dict]:
    """Liste des prélèvements de campagne, filtrable."""
    return service.list_prelevements(
        db,
        date_from=date_from,
        date_to=date_to,
        campagne=campagne,
        site=site,
        parametre=parametre,
        limit=limit,
        offset=offset,
    )


@router.get("/prelevements/{id_prelevement}", response_model=models.PrelevementDetail)
def get_prelevement_detail(id_prelevement: str, db: Session = Depends(get_climate_db)) -> dict:
    """Détail d'un prélèvement."""
    detail = service.get_prelevement_detail(db, id_prelevement)
    if not detail:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prélèvement non trouvé")
    return detail


@router.get("/prelevements/{id_prelevement}/mesures", response_model=models.PrelevementMesuresResponse)
def get_prelevement_mesures(id_prelevement: str, db: Session = Depends(get_climate_db)) -> dict:
    """Fiche détail : prélèvement + ses mesures paramétrées."""
    prelevement = service.get_prelevement_detail(db, id_prelevement)
    if not prelevement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prélèvement non trouvé")
    mesures = service.get_prelevement_mesures(db, id_prelevement)
    return {"prelevement": prelevement, "mesures": mesures}


@router.get("/prelevements/{id_prelevement}/liens", response_model=models.PrelevementLiensResponse)
def get_prelevement_liens(id_prelevement: str, db: Session = Depends(get_climate_db)) -> dict:
    """Entités d'inventaire pollution liées au prélèvement."""
    # Vérifier l'existence du prélèvement
    if not service.get_prelevement_detail(db, id_prelevement):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prélèvement non trouvé")
    entites = service.get_prelevement_liens(db, id_prelevement)
    return {"entites": entites}


@router.get("/alerts", response_model=list[models.PollutionAlert])
def get_pollution_alerts(
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    parametre: Optional[str] = Query(None),
    level: Optional[str] = Query(None, pattern="^(WARNING|CRITICAL)$"),
    campagne: Optional[str] = Query(None),
    limit: int = Query(500, ge=1, le=2000),
    db: Session = Depends(get_climate_db),
) -> list[dict]:
    """Dépassements des seuils provisoires sur métaux lourds.

    Les seuils sont provisoires et doivent être validés par le service qualité.
    """
    return service.list_alerts(
        db,
        date_from=date_from,
        date_to=date_to,
        parametre=parametre,
        level=level,
        campagne=campagne,
        limit=limit,
    )
