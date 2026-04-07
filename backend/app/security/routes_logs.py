from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.security.deps import get_db, require_roles
from app.security.models import AuthLog, SecurityUser, ActivityLog
router = APIRouter(prefix="/security", tags=["Security"])


@router.get("/logs/auth")
def list_auth_logs(
    limit: int = 200,
    db: Session = Depends(get_db),
    _: SecurityUser = Depends(require_roles("admin")),
):
    logs = (
        db.query(AuthLog)
        .order_by(AuthLog.created_at.desc())
        .limit(limit)
        .all()
    )
    return logs


@router.get("/logs/activity")
def list_activity_logs(
    limit: int = 200,
    username: str | None = None,
    db: Session = Depends(get_db),
    _: SecurityUser = Depends(require_roles("admin")),
):
    query = db.query(ActivityLog).order_by(ActivityLog.created_at.desc())
    if username:
        query = query.filter(ActivityLog.username == username)
    
    logs = query.limit(limit).all()
    return logs
