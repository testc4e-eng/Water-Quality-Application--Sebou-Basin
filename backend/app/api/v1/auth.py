# backend/app/api/v1/auth.py
from datetime import datetime, timezone
from fastapi import APIRouter, Body, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.security.deps import get_db, get_current_user
from app.security.models import RefreshToken, Role, SecurityUser
from app.security.schemas import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    TokenResponse,
    UserCreate,
    UserOut,
)
from app.security.services import (
    SecurityError,
    authenticate_user,
    change_password,
    create_user,
    create_password_reset_request,
    get_user_permissions,
    get_user_role,
    get_user_role_code,
    is_superuser_role,
    log_event,
)
from app.security.jwt_service import create_access_token, decode_token
from app.security.passwords import verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])


def _attach_user_auth_context(user: SecurityUser, db: Session) -> SecurityUser:
    role = get_user_role(db, user)
    permissions = get_user_permissions(db, user)
    user.role = role  # type: ignore[attr-defined]
    user.permissions = permissions  # type: ignore[attr-defined]
    user.rbac_status = "RBAC_REAL"  # type: ignore[attr-defined]
    return user

# ---------- REGISTER ----------
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        user = create_user(
            db=db,
            username=user_in.username,
            email=user_in.email,
            full_name=user_in.full_name,
            password=user_in.password,
            role_code=user_in.role_code,
            created_by=None,
        )
        log_event(db, action="USER_CREATED", status="SUCCESS", user_id=user.id, details=user.email)
    except SecurityError as exc:
        log_event(db, action="USER_CREATED", status="FAIL", user_id=None, details=str(exc))
        raise HTTPException(status_code=400, detail=str(exc))

    return _attach_user_auth_context(user, db)
# ---------- LOGIN ----------
@router.post("/login")
async def login(request: Request, db: Session = Depends(get_db)):
    content_type = (request.headers.get("content-type") or "").lower()
    email: str | None = None
    password: str | None = None

    if "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
        form = await request.form()
        email = str(form.get("username") or form.get("email") or "").strip() or None
        password = str(form.get("password") or "")
    else:
        try:
            body = await request.json()
            if not isinstance(body, dict):
                raise HTTPException(status_code=422, detail="Invalid login payload")
            email = str(body.get("email") or body.get("username") or "").strip() or None
            password = str(body.get("password") or "")
        except Exception:
            raise HTTPException(status_code=422, detail="Invalid login payload")

    if not email or not password:
        raise HTTPException(status_code=422, detail="Email et mot de passe requis")

    try:
        user, access_token, refresh_token = authenticate_user(
            db=db,
            username_or_email=email,
            password=password,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
    except SecurityError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    role = get_user_role(db, user)
    permissions = get_user_permissions(db, user)
    role_code = role.code if role else "viewer"
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token,
        email=user.email,
        username=user.username,
        role=role_code,
        role_label=role.label if role else None,
        permissions=permissions,
        rbac_status="RBAC_REAL",
        is_superuser=is_superuser_role(role_code, permissions),
        must_change_password=user.must_change_password,
    )


@router.post("/logout")
def logout(
    request: Request,
    token: str | None = Body(default=None, embed=True),
    db: Session = Depends(get_db),
):
    if token:
        stored = db.query(RefreshToken).filter(RefreshToken.revoked_at.is_(None)).all()
        for item in stored:
            if verify_password(token, item.token_hash):
                item.revoked_at = datetime.now(timezone.utc)
                db.commit()
                break
    log_event(
        db,
        action="LOGOUT",
        status="SUCCESS",
        user_id=None,
        username_attempted=None,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return {"status": "OK"}


@router.get("/me", response_model=UserOut)
def me(current_user: SecurityUser = Depends(get_current_user), db: Session = Depends(get_db)):
    return _attach_user_auth_context(current_user, db)


@router.post("/change-password")
def change_password_endpoint(
    payload: ChangePasswordRequest,
    current_user: SecurityUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        change_password(
            db=db,
            user=current_user,
            current_password=payload.current_password,
            new_password=payload.new_password,
            changed_by=current_user.id,
        )
        log_event(
            db,
            action="PASSWORD_CHANGED",
            status="SUCCESS",
            user_id=current_user.id,
            username_attempted=current_user.email,
        )
    except SecurityError as exc:
        log_event(
            db,
            action="PASSWORD_CHANGED",
            status="FAIL",
            user_id=current_user.id,
            username_attempted=current_user.email,
            details=str(exc),
        )
        raise HTTPException(status_code=400, detail=str(exc))
    return {"status": "OK"}


@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    create_password_reset_request(
        db=db,
        username_or_email=payload.username_or_email,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return {"message": "Si le compte existe, la demande a Ã©tÃ© envoyÃ©e."}


@router.post("/refresh-token")
def refresh_token(token: str = Body(embed=True), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Refresh token invalide")

    user = db.query(SecurityUser).filter(SecurityUser.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")

    stored = db.query(RefreshToken).filter(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None)).all()
    if not any(verify_password(token, t.token_hash) for t in stored):
        raise HTTPException(status_code=401, detail="Refresh token invalide")

    role_code = get_user_role_code(db, user)
    access_token = create_access_token(subject=user.email, role=role_code)
    return {"access_token": access_token, "token_type": "bearer"}
