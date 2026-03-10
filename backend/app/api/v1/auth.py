# backend/app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut
from app.models.user import User
import app.models.item  # noqa: F401  # ensure Item mapper is registered
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

# ---------- REGISTER ----------
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

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

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Email ou mot de passe incorrect")
    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": user.email,
        "is_superuser": bool(user.is_superuser),
    }
