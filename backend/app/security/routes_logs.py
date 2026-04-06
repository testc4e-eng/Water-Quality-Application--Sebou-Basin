from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.security.deps import get_db, require_roles
from app.security.models import AuthLog, SecurityUser
router = APIRouter(prefix="/security", tags=["Security"])


@router.get("/logs")
def list_logs(
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
    return [
        {
            "id": l.id,
            "user_id": l.user_id,
            "username_attempted": l.username_attempted,
            "action": l.action,
            "status": l.status,
            "ip_address": l.ip_address,
            "user_agent": l.user_agent,
            "details": l.details,
            "created_at": l.created_at,
        }
        for l in logs
    ]
