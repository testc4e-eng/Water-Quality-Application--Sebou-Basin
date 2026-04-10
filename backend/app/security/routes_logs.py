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
    offset: int = 0,
    username: str | None = None,
    method: str | None = None,
    db: Session = Depends(get_db),
    _: SecurityUser = Depends(require_roles("admin")),
):
    limit = max(1, min(limit, 1000))
    offset = max(0, offset)

    query = db.query(ActivityLog).order_by(ActivityLog.created_at.desc())
    if username:
        query = query.filter(ActivityLog.username == username)
    if method:
        query = query.filter(ActivityLog.method == method.upper())

    total = query.count()
    logs = query.offset(offset).limit(limit).all()
    return {
        "rows": logs,
        "total": total,
        "limit": limit,
        "offset": offset,
        "has_more": (offset + len(logs)) < total,
    }
