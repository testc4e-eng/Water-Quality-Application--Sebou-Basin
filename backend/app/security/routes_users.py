from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.security.deps import get_db, require_roles
from app.security.models import Role, SecurityUser
from app.security.schemas import (
    ResetPasswordRequest,
    UserCreate,
    UserOut,
    UserStatusUpdate,
    UserUpdate,
)
from app.security.services import (
    SecurityError,
    change_password,
    create_user,
    disable_user,
    enable_user,
    ensure_admin_exists,
    log_event,
    reset_password,
    update_user_role,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), _: SecurityUser = Depends(require_roles("admin"))):
    users = db.query(SecurityUser).all()
    roles = {r.id: r for r in db.query(Role).all()}
    for u in users:
        u.role = roles.get(u.role_id)  # type: ignore[attr-defined]
    return users


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db), _: SecurityUser = Depends(require_roles("admin"))):
    user = db.query(SecurityUser).filter(SecurityUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    user.role = db.query(Role).filter(Role.id == user.role_id).first()  # type: ignore[attr-defined]
    return user


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: SecurityUser = Depends(require_roles("admin")),
):
    try:
        user = create_user(
            db=db,
            username=payload.username,
            email=payload.email,
            full_name=payload.full_name,
            password=payload.password,
            role_code=payload.role_code,
            created_by=current_user.id,
        )
        log_event(db, action="USER_CREATED", status="SUCCESS", user_id=current_user.id, details=user.email)
    except SecurityError as exc:
        log_event(db, action="USER_CREATED", status="FAIL", user_id=current_user.id, details=str(exc))
        raise HTTPException(status_code=400, detail=str(exc))
    user.role = db.query(Role).filter(Role.id == user.role_id).first()  # type: ignore[attr-defined]
    return user


@router.put("/{user_id}", response_model=UserOut)
def update_user_endpoint(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: SecurityUser = Depends(require_roles("admin")),
):
    user = db.query(SecurityUser).filter(SecurityUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    if payload.username:
        user.username = payload.username
    if payload.email:
        user.email = payload.email
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.role_code:
        update_user_role(db, user, payload.role_code)

    user.updated_by = current_user.id
    db.commit()

    log_event(db, action="USER_UPDATED", status="SUCCESS", user_id=current_user.id, details=user.email)
    user.role = db.query(Role).filter(Role.id == user.role_id).first()  # type: ignore[attr-defined]
    return user


@router.patch("/{user_id}/status", response_model=UserOut)
def update_status(
    user_id: int,
    payload: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: SecurityUser = Depends(require_roles("admin")),
):
    user = db.query(SecurityUser).filter(SecurityUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    if payload.is_active:
        enable_user(db, user, current_user.id)
        log_event(db, action="USER_ENABLED", status="SUCCESS", user_id=current_user.id, details=user.email)
    else:
        disable_user(db, user, current_user.id)
        log_event(db, action="USER_DISABLED", status="SUCCESS", user_id=current_user.id, details=user.email)

    user.role = db.query(Role).filter(Role.id == user.role_id).first()  # type: ignore[attr-defined]
    return user


@router.patch("/{user_id}/reset-password")
def reset_password_endpoint(
    user_id: int,
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
    current_user: SecurityUser = Depends(require_roles("admin")),
):
    user = db.query(SecurityUser).filter(SecurityUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    try:
        reset_password(db, user, payload.new_password, current_user.id)
        log_event(db, action="PASSWORD_RESET", status="SUCCESS", user_id=current_user.id, details=user.email)
    except SecurityError as exc:
        log_event(db, action="PASSWORD_RESET", status="FAIL", user_id=current_user.id, details=str(exc))
        raise HTTPException(status_code=400, detail=str(exc))
    return {"status": "OK"}


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: SecurityUser = Depends(require_roles("admin")),
):
    user = db.query(SecurityUser).filter(SecurityUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    try:
        ensure_admin_exists(db, user)
    except SecurityError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    db.delete(user)
    db.commit()
    log_event(db, action="USER_DELETED", status="SUCCESS", user_id=current_user.id, details=user.email)
    return {"status": "OK"}
