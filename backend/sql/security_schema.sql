-- Security schema for authentication/authorization (abh_sad)
-- Run this once in the database.

CREATE SCHEMA IF NOT EXISTS security;

-- Roles
CREATE TABLE IF NOT EXISTS security.roles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS security.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL REFERENCES security.roles(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  last_login_at TIMESTAMPTZ,
  last_login_ip INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  created_by INT,
  updated_by INT
);

-- Permissions (optional, extensible)
CREATE TABLE IF NOT EXISTS security.permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  label VARCHAR(150) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS security.role_permissions (
  role_id INT NOT NULL REFERENCES security.roles(id) ON DELETE CASCADE,
  permission_id INT NOT NULL REFERENCES security.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Auth logs
CREATE TABLE IF NOT EXISTS security.auth_logs (
  id SERIAL PRIMARY KEY,
  user_id INT NULL REFERENCES security.users(id) ON DELETE SET NULL,
  username_attempted VARCHAR(255),
  action VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Password history
CREATE TABLE IF NOT EXISTS security.password_history (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES security.users(id) ON DELETE CASCADE,
  password_hash VARCHAR(255) NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by INT NULL
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS security.password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES security.users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Password reset requests (admin workflow)
CREATE TABLE IF NOT EXISTS security.password_reset_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NULL REFERENCES security.users(id) ON DELETE SET NULL,
  username_requested VARCHAR(100),
  email_requested VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','COMPLETED')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by INT,
  notes TEXT
);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS security.refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES security.users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON security.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON security.users(username);
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON security.auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON security.auth_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_reset_requests_status ON security.password_reset_requests(status);
CREATE INDEX IF NOT EXISTS idx_reset_requests_requested_at ON security.password_reset_requests(requested_at);

-- Seed roles
INSERT INTO security.roles (code, label, description)
VALUES
  ('viewer', 'Viewer', 'Lecture seule des dashboards'),
  ('manager', 'Manager', 'Lecture dashboards + gestion des données'),
  ('admin', 'Admin', 'Accès total + gestion utilisateurs')
ON CONFLICT (code) DO NOTHING;

-- Seed permissions
INSERT INTO security.permissions (code, label, description)
VALUES
  ('dashboard.read', 'Lecture dashboard', 'Lecture des dashboards'),
  ('data.read', 'Lecture données', 'Lecture des données'),
  ('data.create', 'Création données', 'Création de données'),
  ('data.update', 'Modification données', 'Modification de données'),
  ('data.delete', 'Suppression données', 'Suppression de données'),
  ('user.read', 'Lecture utilisateurs', 'Lecture des utilisateurs'),
  ('user.create', 'Création utilisateurs', 'Création des utilisateurs'),
  ('user.update', 'Modification utilisateurs', 'Modification des utilisateurs'),
  ('user.delete', 'Suppression utilisateurs', 'Suppression des utilisateurs'),
  ('security.logs', 'Logs sécurité', 'Accès aux logs de sécurité')
ON CONFLICT (code) DO NOTHING;

-- Map permissions to roles
-- viewer
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r, security.permissions p
WHERE r.code = 'viewer' AND p.code IN ('dashboard.read')
ON CONFLICT DO NOTHING;

-- manager
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r, security.permissions p
WHERE r.code = 'manager'
  AND p.code IN ('dashboard.read','data.read','data.create','data.update','data.delete')
ON CONFLICT DO NOTHING;

-- admin
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM security.roles r, security.permissions p
WHERE r.code = 'admin'
ON CONFLICT DO NOTHING;
