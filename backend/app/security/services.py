from __future__ import annotations

from datetime import datetime, timedelta, timezone
import secrets
from typing import Iterable

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.security.models import (
    AuthLog,
    PasswordHistory,
    PasswordResetRequest,
    Permission,
    RefreshToken,
    Role,
    RolePermission,
    SecurityUser,
    ActivityLog,
)
from app.security.passwords import hash_password, verify_password, validate_password_strength
from app.security.jwt_service import create_access_token, create_refresh_token


class SecurityError(Exception):
    pass


def log_event(
    db: Session,
    action: str,
    status: str,
    user_id: int | None = None,
    username_attempted: str | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
    details: str | None = None,
) -> None:
    db.add(
        AuthLog(
            user_id=user_id,
            username_attempted=username_attempted,
            action=action,
            status=status,
            ip_address=ip_address,
            user_agent=user_agent,
            details=details,
        )
    )
    db.commit()


def get_role_by_code(db: Session, code: str) -> Role | None:
    return db.query(Role).filter(Role.code == code).first()


def get_permissions_for_role(db: Session, role_id: int) -> list[str]:
    rows = (
        db.query(Permission.code)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .filter(RolePermission.role_id == role_id)
        .all()
    )
    return [r[0] for r in rows]


def create_user(
    db: Session,
    username: str,
    email: str,
    full_name: str | None,
    password: str,
    role_code: str,
    created_by: int | None = None,
) -> SecurityUser:
    if db.query(SecurityUser).filter(SecurityUser.email == email).first():
        raise SecurityError("Email déjà utilisé")
    if db.query(SecurityUser).filter(SecurityUser.username == username).first():
        raise SecurityError("Username déjà utilisé")

    role = get_role_by_code(db, role_code)
    if not role:
        raise SecurityError("Rôle inconnu")

    issues = validate_password_strength(password)
    if issues:
        raise SecurityError("Mot de passe faible: " + ", ".join(issues))

    user = SecurityUser(
        username=username,
        email=email,
        full_name=full_name,
        password_hash=hash_password(password),
        role_id=role.id,
        is_active=True,
        created_by=created_by,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    db.add(PasswordHistory(user_id=user.id, password_hash=user.password_hash, changed_by=created_by))
    db.commit()

    return user


def authenticate_user(
    db: Session,
    username_or_email: str,
    password: str,
    ip_address: str | None,
    user_agent: str | None,
) -> tuple[SecurityUser, str, str]:
    user = (
        db.query(SecurityUser)
        .filter((SecurityUser.email == username_or_email) | (SecurityUser.username == username_or_email))
        .first()
    )
    if not user:
        log_event(
            db,
            action="LOGIN_FAILED",
            status="FAIL",
            username_attempted=username_or_email,
            ip_address=ip_address,
            user_agent=user_agent,
            details="Utilisateur introuvable",
        )
        raise SecurityError("Email ou mot de passe incorrect")

    if not user.is_active:
        log_event(
            db,
            action="LOGIN_FAILED",
            status="FAIL",
            user_id=user.id,
            username_attempted=username_or_email,
            ip_address=ip_address,
            user_agent=user_agent,
            details="Compte désactivé",
        )
        raise SecurityError("Compte désactivé")

    if not verify_password(password, user.password_hash):
        user.failed_login_attempts += 1
        db.commit()
        log_event(
            db,
            action="LOGIN_FAILED",
            status="FAIL",
            user_id=user.id,
            username_attempted=username_or_email,
            ip_address=ip_address,
            user_agent=user_agent,
            details="Mot de passe incorrect",
        )
        raise SecurityError("Email ou mot de passe incorrect")

    user.failed_login_attempts = 0
    user.last_login_at = datetime.now(timezone.utc)
    user.last_login_ip = ip_address
    db.commit()

    role = get_role_by_code(db, "viewer")
    if user.role_id:
        role = db.query(Role).filter(Role.id == user.role_id).first() or role
    role_code = role.code if role else "viewer"

    access_token = create_access_token(subject=user.email, role=role_code)
    refresh_token = create_refresh_token(subject=user.email, role=role_code)

    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=hash_password(refresh_token),
            expires_at=datetime.now(timezone.utc) + timedelta(days=7),
        )
    )
    db.commit()

    log_event(
        db,
        action="LOGIN_SUCCESS",
        status="SUCCESS",
        user_id=user.id,
        username_attempted=username_or_email,
        ip_address=ip_address,
        user_agent=user_agent,
    )

    if user.must_change_password:
        log_event(
            db,
            action="LOGIN_TEMP_PASSWORD",
            status="SUCCESS",
            user_id=user.id,
            username_attempted=username_or_email,
            ip_address=ip_address,
            user_agent=user_agent,
            details="Mot de passe temporaire / changement requis",
        )

    return user, access_token, refresh_token


def change_password(
    db: Session,
    user: SecurityUser,
    current_password: str,
    new_password: str,
    changed_by: int | None,
):
    if not verify_password(current_password, user.password_hash):
        raise SecurityError("Ancien mot de passe incorrect")

    issues = validate_password_strength(new_password)
    if issues:
        raise SecurityError("Mot de passe faible: " + ", ".join(issues))

    history = (
        db.query(PasswordHistory)
        .filter(PasswordHistory.user_id == user.id)
        .order_by(PasswordHistory.changed_at.desc())
        .limit(5)
        .all()
    )
    for entry in history:
        if verify_password(new_password, entry.password_hash):
            raise SecurityError("Mot de passe déjà utilisé récemment")

    user.password_hash = hash_password(new_password)
    user.must_change_password = False
    user.updated_at = datetime.now(timezone.utc)
    user.updated_by = changed_by
    db.commit()

    db.add(PasswordHistory(user_id=user.id, password_hash=user.password_hash, changed_by=changed_by))
    db.commit()

    db.query(PasswordResetRequest).filter(
        PasswordResetRequest.user_id == user.id,
        PasswordResetRequest.status == "APPROVED",
    ).update(
        {
            "status": "COMPLETED",
            "processed_at": datetime.now(timezone.utc),
            "notes": "Mot de passe changÃ© par l'utilisateur",
        }
    )
    db.commit()


def reset_password(
    db: Session,
    user: SecurityUser,
    new_password: str,
    changed_by: int | None,
):
    issues = validate_password_strength(new_password)
    if issues:
        raise SecurityError("Mot de passe faible: " + ", ".join(issues))

    user.password_hash = hash_password(new_password)
    user.must_change_password = True
    user.updated_at = datetime.now(timezone.utc)
    user.updated_by = changed_by
    db.commit()

    db.add(PasswordHistory(user_id=user.id, password_hash=user.password_hash, changed_by=changed_by))
    db.commit()


def create_password_reset_request(
    db: Session,
    username_or_email: str,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> None:
    user = (
        db.query(SecurityUser)
        .filter((SecurityUser.email == username_or_email) | (SecurityUser.username == username_or_email))
        .first()
    )

    db.add(
        PasswordResetRequest(
            user_id=user.id if user else None,
            username_requested=username_or_email if user is None else user.username,
            email_requested=user.email if user else None,
            status="PENDING",
        )
    )
    db.commit()

    log_event(
        db,
        action="PASSWORD_RESET_REQUESTED",
        status="SUCCESS",
        user_id=user.id if user else None,
        username_attempted=username_or_email,
        ip_address=ip_address,
        user_agent=user_agent,
    )


def list_password_reset_requests(db: Session, status: str | None = None) -> list[PasswordResetRequest]:
    query = db.query(PasswordResetRequest).order_by(PasswordResetRequest.requested_at.desc())
    if status:
        query = query.filter(PasswordResetRequest.status == status)
    return query.all()


def approve_password_reset_request(
    db: Session,
    request: PasswordResetRequest,
    admin_user: SecurityUser,
    notes: str | None = None,
) -> str:
    if request.status != "PENDING":
        raise SecurityError("Demande dÃ©jÃ  traitÃ©e")

    if not request.user_id:
        request.status = "REJECTED"
        request.processed_at = datetime.now(timezone.utc)
        request.processed_by = admin_user.id
        request.notes = notes or "Utilisateur introuvable"
        db.commit()
        log_event(
            db,
            action="PASSWORD_RESET_REJECTED",
            status="SUCCESS",
            user_id=admin_user.id,
            details="Utilisateur introuvable",
        )
        raise SecurityError("Utilisateur introuvable")

    user = db.query(SecurityUser).filter(SecurityUser.id == request.user_id).first()
    if not user:
        raise SecurityError("Utilisateur introuvable")

    temp_password = generate_temporary_password()
    user.password_hash = hash_password(temp_password)
    user.must_change_password = True
    user.updated_at = datetime.now(timezone.utc)
    user.updated_by = admin_user.id
    db.commit()

    db.add(PasswordHistory(user_id=user.id, password_hash=user.password_hash, changed_by=admin_user.id))
    db.commit()

    request.status = "APPROVED"
    request.processed_at = datetime.now(timezone.utc)
    request.processed_by = admin_user.id
    request.notes = notes
    db.commit()

    log_event(
        db,
        action="PASSWORD_RESET_APPROVED",
        status="SUCCESS",
        user_id=admin_user.id,
        details=f"request_id={request.id}",
    )
    log_event(
        db,
        action="TEMP_PASSWORD_GENERATED",
        status="SUCCESS",
        user_id=user.id,
        details=f"request_id={request.id}",
    )

    return temp_password


def reject_password_reset_request(
    db: Session,
    request: PasswordResetRequest,
    admin_user: SecurityUser,
    notes: str | None = None,
) -> None:
    if request.status != "PENDING":
        raise SecurityError("Demande dÃ©jÃ  traitÃ©e")
    request.status = "REJECTED"
    request.processed_at = datetime.now(timezone.utc)
    request.processed_by = admin_user.id
    request.notes = notes
    db.commit()
    log_event(
        db,
        action="PASSWORD_RESET_REJECTED",
        status="SUCCESS",
        user_id=admin_user.id,
        details=f"request_id={request.id}",
    )


def force_reset_user_password(
    db: Session,
    user: SecurityUser,
    admin_user: SecurityUser,
) -> str:
    temp_password = generate_temporary_password()
    user.password_hash = hash_password(temp_password)
    user.must_change_password = True
    user.updated_at = datetime.now(timezone.utc)
    user.updated_by = admin_user.id
    db.commit()
    db.add(PasswordHistory(user_id=user.id, password_hash=user.password_hash, changed_by=admin_user.id))
    db.commit()

    log_event(
        db,
        action="PASSWORD_RESET_FORCED",
        status="SUCCESS",
        user_id=admin_user.id,
        details=f"user_id={user.id}",
    )
    log_event(
        db,
        action="TEMP_PASSWORD_GENERATED",
        status="SUCCESS",
        user_id=user.id,
        details="forced",
    )
    return temp_password


def generate_temporary_password(length: int = 12) -> str:
    alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#%?*"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def disable_user(db: Session, user: SecurityUser, updated_by: int | None):
    user.is_active = False
    user.updated_at = datetime.now(timezone.utc)
    user.updated_by = updated_by
    db.commit()


def enable_user(db: Session, user: SecurityUser, updated_by: int | None):
    user.is_active = True
    user.updated_at = datetime.now(timezone.utc)
    user.updated_by = updated_by
    db.commit()


def ensure_admin_exists(db: Session, user_to_delete: SecurityUser):
    role = db.query(Role).filter(Role.id == user_to_delete.role_id).first()
    if role and role.code == "admin":
        admin_count = (
            db.query(SecurityUser)
            .filter(SecurityUser.role_id == role.id, SecurityUser.is_active == True)
            .count()
        )
        if admin_count <= 1:
            raise SecurityError("Impossible de supprimer le dernier admin actif")


def update_user_role(db: Session, user: SecurityUser, role_code: str | None):
    if not role_code:
        return
    role = get_role_by_code(db, role_code)
    if not role:
        raise SecurityError("Rôle inconnu")
    user.role_id = role.id
    user.updated_at = datetime.now(timezone.utc)
    db.commit()


def log_activity(
    db: Session,
    method: str,
    path: str,
    status_code: int,
    duration_ms: int,
    user_id: int | None = None,
    username: str | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
    query_params: str | None = None,
    request_payload: str | None = None,
) -> None:
    # Masquage des champs sensibles dans le payload
    if request_payload and "password" in request_payload.lower():
        import json
        try:
            data = json.loads(request_payload)
            def mask_recursive(d):
                if isinstance(d, dict):
                    for k, v in d.items():
                        if "password" in k.lower():
                            d[k] = "********"
                        else:
                            mask_recursive(v)
                elif isinstance(d, list):
                    for item in d:
                        mask_recursive(item)
            mask_recursive(data)
            request_payload = json.dumps(data)
        except:
            request_payload = "[SENSITIVE DATA MASKED]"

    db.add(
        ActivityLog(
            user_id=user_id,
            username=username,
            method=method,
            path=path,
            status_code=status_code,
            duration_ms=duration_ms,
            ip_address=ip_address,
            user_agent=user_agent,
            query_params=query_params,
            request_payload=request_payload,
        )
    )
    db.commit()
