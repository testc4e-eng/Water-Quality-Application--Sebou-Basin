from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.security.jwt_service import decode_token
from app.security.models import SecurityUser, Role
from app.security.services import get_permissions_for_role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> SecurityUser:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")
    
    if payload.get("error") == "expired":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expirée")

    subject = payload.get("sub")
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

    user = db.query(SecurityUser).filter(SecurityUser.email == subject).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur introuvable")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Compte désactivé")
    return user


def require_roles(*roles: str):
    def _checker(user: SecurityUser = Depends(get_current_user), db: Session = Depends(get_db)) -> SecurityUser:
        role = db.query(Role).filter(Role.id == user.role_id).first()
        if not role or role.code not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
        return user

    return _checker


def require_permissions(*permissions: str):
    def _checker(user: SecurityUser = Depends(get_current_user), db: Session = Depends(get_db)) -> SecurityUser:
        perms = get_permissions_for_role(db, user.role_id)
        if not set(permissions).issubset(set(perms)):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
        return user

    return _checker
