from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.analysis_models import (
    BatchSeriesRequest,
    BatchSeriesResponse,
    CorrelationRequest,
    CorrelationResponse,
    CorrelationMatrixRequest,
    CorrelationMatrixResponse,
)
from app.services import analysis_service

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

@router.post("/series/batch", response_model=BatchSeriesResponse, summary="Batch fetch multiple analytical series")
def get_batch_series(request: BatchSeriesRequest, db: Session = Depends(get_db)):
    """
    Fetch multiple analytical series in a single request.
    Supports downsampling, deterministic IDs, and detailed status/warnings.
    Maximum of 20 series per batch.
    """
    return analysis_service.process_batch_series(db, request)


@router.post(
    "/correlation",
    response_model=CorrelationResponse,
    summary="Corrélation entre deux séries temporelles",
)
def post_correlation(request: CorrelationRequest, db: Session = Depends(get_db)):
    """
    Calcule la corrélation de Pearson, R² et la régression linéaire entre deux séries temporelles.
    Retourne une erreur métier si les séries ne se chevauchent pas ou si elles sont ponctuelles.
    """
    return analysis_service.calculate_correlation(db, request)


@router.post(
    "/correlation/matrix",
    response_model=CorrelationMatrixResponse,
    summary="Matrice de corrélation entre 3 à 5 séries temporelles",
)
def post_correlation_matrix(request: CorrelationMatrixRequest, db: Session = Depends(get_db)):
    """
    Calcule une matrice N×N de corrélations de Pearson entre 3 et 5 séries temporelles.
    """
    return analysis_service.calculate_correlation_matrix(db, request)
