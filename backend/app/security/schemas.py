from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class RoleOut(BaseModel):
    id: int
    code: str
    label: str
    description: str | None = None


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str | None = None
    role: RoleOut
    is_active: bool
    must_change_password: bool
    failed_login_attempts: int
    last_login_at: datetime | None = None
    last_login_ip: str | None = None

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    email: EmailStr
    full_name: str | None = None
    password: str = Field(min_length=8)
    role_code: str = Field(default="viewer")


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=100)
    email: EmailStr | None = None
    full_name: str | None = None
    role_code: str | None = None


class UserStatusUpdate(BaseModel):
    is_active: bool


class ResetPasswordRequest(BaseModel):
    new_password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str | None = None
    email: EmailStr
    username: str
    role: str
    is_superuser: bool
    must_change_password: bool | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


class ForgotPasswordRequest(BaseModel):
    username_or_email: str = Field(min_length=3, max_length=255)


class PasswordResetRequestOut(BaseModel):
    id: int
    user_id: int | None = None
    username_requested: str | None = None
    email_requested: EmailStr | None = None
    status: str
    requested_at: datetime
    processed_at: datetime | None = None
    processed_by: int | None = None
    notes: str | None = None

    class Config:
        from_attributes = True


class PasswordResetDecision(BaseModel):
    notes: str | None = None
