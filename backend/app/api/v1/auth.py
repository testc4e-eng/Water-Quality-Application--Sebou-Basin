# backend/app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut
from app.schemas.auth import LoginRequest   # ✅ import du nouveau schéma
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_db

router = APIRouter(tags=["Auth"])

# ---------- REGISTER ----------
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        first_name=getattr(user_in, "firstName", None),  # si tu ajoutes ces champs
        last_name=getattr(user_in, "lastName", None),
        role=getattr(user_in, "role", None),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# ---------- LOGIN ----------
@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Email ou mot de passe incorrect")
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}
