from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.security.deps import get_db, require_permissions
from app.security.models import PasswordResetRequest, SecurityUser
from app.security.schemas import PasswordResetDecision, PasswordResetRequestOut
from app.security.services import (
    SecurityError,
    approve_password_reset_request,
    list_password_reset_requests,
    reject_password_reset_request,
)

router = APIRouter(prefix="/password-reset-requests", tags=["admin"])

PASSWORD_RESET_MANAGE_PERMISSION = "security.password_reset.manage"


@router.get("", response_model=list[PasswordResetRequestOut])
def list_requests(
    status: str | None = None,
    db: Session = Depends(get_db),
    _: SecurityUser = Depends(require_permissions(PASSWORD_RESET_MANAGE_PERMISSION)),
):
    return list_password_reset_requests(db, status=status)


@router.patch("/{request_id}/approve")
def approve_request(
    request_id: int,
    payload: PasswordResetDecision,
    db: Session = Depends(get_db),
    admin_user: SecurityUser = Depends(require_permissions(PASSWORD_RESET_MANAGE_PERMISSION)),
):
    req = db.query(PasswordResetRequest).filter(PasswordResetRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    try:
        temp_password = approve_password_reset_request(db, req, admin_user, notes=payload.notes)
    except SecurityError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return {"status": "OK", "temporary_password": temp_password}


@router.patch("/{request_id}/reject")
def reject_request(
    request_id: int,
    payload: PasswordResetDecision,
    db: Session = Depends(get_db),
    admin_user: SecurityUser = Depends(require_permissions(PASSWORD_RESET_MANAGE_PERMISSION)),
):
    req = db.query(PasswordResetRequest).filter(PasswordResetRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    try:
        reject_password_reset_request(db, req, admin_user, notes=payload.notes)
    except SecurityError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return {"status": "OK"}
