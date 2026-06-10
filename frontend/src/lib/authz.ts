export const AUTH_STORAGE_KEYS = {
  accessToken: "access_token",
  email: "auth_email",
  username: "auth_username",
  role: "auth_role",
  roleLabel: "auth_role_label",
  permissions: "auth_permissions",
  rbacStatus: "auth_rbac_status",
  isSuperuser: "is_superuser",
  mustChangePassword: "must_change_password",
} as const;

export type AuthSession = {
  accessToken: string | null;
  email: string | null;
  username: string | null;
  role: string | null;
  roleLabel: string | null;
  permissions: string[];
  rbacStatus: string;
  isSuperuser: boolean;
  mustChangePassword: boolean;
};

function decodeTokenPayload(token: string | null): Record<string, unknown> | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "=");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parsePermissions(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function getAuthSession(): AuthSession {
  const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  const payload = decodeTokenPayload(accessToken);
  const roleFromToken = typeof payload?.role === "string" ? payload.role : null;

  return {
    accessToken,
    email: localStorage.getItem(AUTH_STORAGE_KEYS.email),
    username: localStorage.getItem(AUTH_STORAGE_KEYS.username),
    role: localStorage.getItem(AUTH_STORAGE_KEYS.role) ?? roleFromToken,
    roleLabel: localStorage.getItem(AUTH_STORAGE_KEYS.roleLabel),
    permissions: parsePermissions(localStorage.getItem(AUTH_STORAGE_KEYS.permissions)),
    rbacStatus: localStorage.getItem(AUTH_STORAGE_KEYS.rbacStatus) ?? "AUTH_PARTIAL",
    isSuperuser: localStorage.getItem(AUTH_STORAGE_KEYS.isSuperuser) === "true",
    mustChangePassword: localStorage.getItem(AUTH_STORAGE_KEYS.mustChangePassword) === "true",
  };
}

export function storeAuthSession(session: {
  access_token: string;
  email: string;
  username: string;
  role: string;
  role_label?: string | null;
  permissions?: string[];
  rbac_status?: string;
  is_superuser: boolean;
  must_change_password?: boolean | null;
}): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.access_token);
  localStorage.setItem(AUTH_STORAGE_KEYS.email, session.email);
  localStorage.setItem(AUTH_STORAGE_KEYS.username, session.username);
  localStorage.setItem(AUTH_STORAGE_KEYS.role, session.role);
  localStorage.setItem(AUTH_STORAGE_KEYS.roleLabel, session.role_label ?? session.role);
  localStorage.setItem(AUTH_STORAGE_KEYS.permissions, JSON.stringify(session.permissions ?? []));
  localStorage.setItem(AUTH_STORAGE_KEYS.rbacStatus, session.rbac_status ?? "RBAC_REAL");
  localStorage.setItem(AUTH_STORAGE_KEYS.isSuperuser, String(!!session.is_superuser));
  localStorage.setItem(
    AUTH_STORAGE_KEYS.mustChangePassword,
    String(Boolean(session.must_change_password)),
  );
}

export function clearAuthSession(): void {
  Object.values(AUTH_STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function hasPermission(permission: string, permissions?: string[]): boolean {
  const effectivePermissions = permissions ?? getAuthSession().permissions;
  return effectivePermissions.includes(permission);
}

export function hasAnyPermission(required: string[], permissions?: string[]): boolean {
  const effectivePermissions = permissions ?? getAuthSession().permissions;
  return required.some((permission) => effectivePermissions.includes(permission));
}

export function getRoleDisplayName(session?: AuthSession): string {
  const auth = session ?? getAuthSession();
  if (auth.roleLabel) return auth.roleLabel;
  switch ((auth.role ?? "").toUpperCase()) {
    case "ROLE_SYS_ADMIN":
      return "System Admin";
    case "ROLE_DATA_ADMIN":
      return "Data Admin";
    case "ROLE_EXPERT":
      return "Expert";
    case "ROLE_CONSULTANT":
      return "Consultant";
    case "ROLE_DECIDEUR":
      return "Décideur";
    case "ROLE_AI_AGENT":
      return "AI Agent";
    case "ADMIN":
      return "Admin";
    case "MANAGER":
      return "Manager";
    case "VIEWER":
      return "Viewer";
    default:
      return auth.role ?? "Utilisateur";
  }
}
