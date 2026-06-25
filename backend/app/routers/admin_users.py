from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.security.deps import get_db, require_permissions
from app.security.models import SecurityUser
from app.security.services import SecurityError, force_reset_user_password

router = APIRouter(prefix="/users", tags=["admin"])

USER_MANAGE_PERMISSION = "security.users.manage"


@router.patch("/{user_id}/reset-password")
def admin_reset_password(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: SecurityUser = Depends(require_permissions(USER_MANAGE_PERMISSION)),
):
    user = db.query(SecurityUser).filter(SecurityUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    try:
        temp_password = force_reset_user_password(db, user, admin_user)
    except SecurityError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return {"status": "OK", "temporary_password": temp_password}
