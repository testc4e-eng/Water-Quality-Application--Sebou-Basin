from __future__ import annotations

from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.security.deps import get_current_user, get_db
from app.security.models import Role, SecurityUser
from app.security.services import get_permissions_for_role


CAPABILITY_VIEW_AUDIT = "view_audit"
CAPABILITY_GENERATE_TEMPLATE = "generate_template"
CAPABILITY_UPLOAD_FILE = "upload_file"
CAPABILITY_CREATE_CHANGE_REQUEST = "create_change_request"
CAPABILITY_SUBMIT_CHANGE_REQUEST = "submit_change_request"
CAPABILITY_APPROVE_CHANGE_REQUEST = "approve_change_request"
CAPABILITY_APPLY_CHANGE_REQUEST = "apply_change_request"
CAPABILITY_APPLY_ROLLBACK = "apply_rollback"

CAPABILITY_PERMISSION_MAP: dict[str, set[str]] = {
    CAPABILITY_VIEW_AUDIT: {"data_admin.audit.read"},
    CAPABILITY_GENERATE_TEMPLATE: {"data_admin.template.generate"},
    CAPABILITY_UPLOAD_FILE: {"data_admin.upload"},
    CAPABILITY_CREATE_CHANGE_REQUEST: {"data_admin.change_request.create"},
    CAPABILITY_SUBMIT_CHANGE_REQUEST: {"data_admin.change_request.submit"},
    CAPABILITY_APPROVE_CHANGE_REQUEST: {"data_admin.change_request.approve"},
    CAPABILITY_APPLY_CHANGE_REQUEST: {"data_admin.change_request.apply"},
    CAPABILITY_APPLY_ROLLBACK: {"data_admin.rollback.apply"},
}


@dataclass(frozen=True)
class DataAdminAccessContext:
    user_id: int
    email: str
    username: str
    role_code: str
    role_label: str | None
    permissions: tuple[str, ...]
    rbac_status: str

    @property
    def actor(self) -> str:
        return f"user:{self.user_id}:{self.email}"


def get_data_admin_access_context(
    current_user: SecurityUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DataAdminAccessContext:
    role = db.query(Role).filter(Role.id == current_user.role_id).first()
    role_code = role.code if role else "viewer"
    permissions = tuple(sorted(set(get_permissions_for_role(db, current_user.role_id))))
    return DataAdminAccessContext(
        user_id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        role_code=role_code,
        role_label=role.label if role else None,
        permissions=permissions,
        rbac_status="RBAC_REAL",
    )


def require_data_admin_capability(capability: str):
    def _checker(
        access: DataAdminAccessContext = Depends(get_data_admin_access_context),
    ) -> DataAdminAccessContext:
        required_permissions = CAPABILITY_PERMISSION_MAP.get(capability, set())
        granted_permissions = set(access.permissions)
        if not required_permissions.issubset(granted_permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"DATA_ADMIN_PERMISSION_DENIED:{capability}:role={access.role_code}:"
                    f"required={','.join(sorted(required_permissions))}"
                ),
            )
        return access

    return _checker
