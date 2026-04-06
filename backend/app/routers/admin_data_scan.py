from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.admin_data_scan_service import get_data_availability


router = APIRouter(tags=["admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/data-availability")
def data_availability(
    include_time_stats: bool = Query(False, description="Inclure les stats temporelles"),
    db: Session = Depends(get_db),
):
    return get_data_availability(db, include_time_stats=include_time_stats)
