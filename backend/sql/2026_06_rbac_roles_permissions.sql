BEGIN;

CREATE SCHEMA IF NOT EXISTS security;

INSERT INTO security.roles (code, label, description, created_at)
VALUES
    ('ROLE_DECIDEUR', 'Décideur', 'Consultation dashboards et audit data-admin', now()),
    ('ROLE_EXPERT', 'Expert', 'Validation métier et approbation des flux data-admin', now()),
    ('ROLE_CONSULTANT', 'Consultant', 'Consultation, canevas et upload contrôlé', now()),
    ('ROLE_DATA_ADMIN', 'Data Admin', 'Administration opérationnelle du module data-admin', now()),
    ('ROLE_SYS_ADMIN', 'System Admin', 'Administration sécurité et supervision complète', now()),
    ('ROLE_AI_AGENT', 'AI Agent', 'Compte automatisé limité à l’audit et à l’upload contrôlé', now())
ON CONFLICT (code) DO UPDATE
SET
    label = EXCLUDED.label,
    description = EXCLUDED.description;

INSERT INTO security.permissions (code, label, description)
VALUES
    ('dashboard.read', 'Lecture dashboards', 'Consulter les dashboards applicatifs'),
    ('data_admin.audit.read', 'Lecture audit data-admin', 'Consulter le registre, les runs, les change requests et les logs data-admin'),
    ('data_admin.template.generate', 'Génération canevas', 'Générer les canevas métier data-admin'),
    ('data_admin.upload', 'Upload staging', 'Téléverser des fichiers vers le staging data-admin'),
    ('data_admin.validation.review', 'Validation métier', 'Revoir les validations métier et référentielles data-admin'),
    ('data_admin.change_request.create', 'Créer change request', 'Créer une demande de promotion data-admin'),
    ('data_admin.change_request.submit', 'Soumettre change request', 'Soumettre une demande de promotion data-admin'),
    ('data_admin.change_request.approve', 'Approuver change request', 'Approuver ou rejeter une demande de promotion data-admin'),
    ('data_admin.change_request.apply', 'Appliquer promotion', 'Appliquer une promotion INSERT_ONLY data-admin'),
    ('data_admin.rollback.apply', 'Appliquer rollback', 'Appliquer un rollback logique INSERT_ONLY data-admin'),
    ('data_admin.reference.manage', 'Gérer référentiels data-admin', 'Gérer les référentiels et règles du module data-admin'),
    ('security.users.manage', 'Gérer utilisateurs', 'Créer, modifier, désactiver et supprimer les utilisateurs'),
    ('security.password_reset.manage', 'Gérer resets mot de passe', 'Traiter les demandes de réinitialisation de mot de passe'),
    ('security.logs.read', 'Lire logs sécurité', 'Consulter les logs sécurité et activité')
ON CONFLICT (code) DO UPDATE
SET
    label = EXCLUDED.label,
    description = EXCLUDED.description;

WITH desired(role_code, permission_code) AS (
    VALUES
        ('ROLE_DECIDEUR', 'dashboard.read'),
        ('ROLE_DECIDEUR', 'data_admin.audit.read'),

        ('ROLE_EXPERT', 'dashboard.read'),
        ('ROLE_EXPERT', 'data_admin.audit.read'),
        ('ROLE_EXPERT', 'data_admin.template.generate'),
        ('ROLE_EXPERT', 'data_admin.upload'),
        ('ROLE_EXPERT', 'data_admin.validation.review'),
        ('ROLE_EXPERT', 'data_admin.change_request.create'),
        ('ROLE_EXPERT', 'data_admin.change_request.submit'),
        ('ROLE_EXPERT', 'data_admin.change_request.approve'),
        ('ROLE_EXPERT', 'data_admin.reference.manage'),

        ('ROLE_CONSULTANT', 'dashboard.read'),
        ('ROLE_CONSULTANT', 'data_admin.audit.read'),
        ('ROLE_CONSULTANT', 'data_admin.template.generate'),
        ('ROLE_CONSULTANT', 'data_admin.upload'),
        ('ROLE_CONSULTANT', 'data_admin.change_request.create'),
        ('ROLE_CONSULTANT', 'data_admin.change_request.submit'),

        ('ROLE_DATA_ADMIN', 'dashboard.read'),
        ('ROLE_DATA_ADMIN', 'data_admin.audit.read'),
        ('ROLE_DATA_ADMIN', 'data_admin.template.generate'),
        ('ROLE_DATA_ADMIN', 'data_admin.upload'),
        ('ROLE_DATA_ADMIN', 'data_admin.validation.review'),
        ('ROLE_DATA_ADMIN', 'data_admin.change_request.create'),
        ('ROLE_DATA_ADMIN', 'data_admin.change_request.submit'),
        ('ROLE_DATA_ADMIN', 'data_admin.change_request.approve'),
        ('ROLE_DATA_ADMIN', 'data_admin.change_request.apply'),
        ('ROLE_DATA_ADMIN', 'data_admin.rollback.apply'),
        ('ROLE_DATA_ADMIN', 'data_admin.reference.manage'),

        ('ROLE_SYS_ADMIN', 'dashboard.read'),
        ('ROLE_SYS_ADMIN', 'data_admin.audit.read'),
        ('ROLE_SYS_ADMIN', 'data_admin.template.generate'),
        ('ROLE_SYS_ADMIN', 'data_admin.upload'),
        ('ROLE_SYS_ADMIN', 'data_admin.validation.review'),
        ('ROLE_SYS_ADMIN', 'data_admin.change_request.create'),
        ('ROLE_SYS_ADMIN', 'data_admin.change_request.submit'),
        ('ROLE_SYS_ADMIN', 'data_admin.change_request.approve'),
        ('ROLE_SYS_ADMIN', 'data_admin.change_request.apply'),
        ('ROLE_SYS_ADMIN', 'data_admin.rollback.apply'),
        ('ROLE_SYS_ADMIN', 'data_admin.reference.manage'),
        ('ROLE_SYS_ADMIN', 'security.users.manage'),
        ('ROLE_SYS_ADMIN', 'security.password_reset.manage'),
        ('ROLE_SYS_ADMIN', 'security.logs.read'),

        ('ROLE_AI_AGENT', 'dashboard.read'),
        ('ROLE_AI_AGENT', 'data_admin.audit.read'),
        ('ROLE_AI_AGENT', 'data_admin.template.generate'),
        ('ROLE_AI_AGENT', 'data_admin.upload'),

        ('viewer', 'dashboard.read'),
        ('viewer', 'data_admin.audit.read'),

        ('manager', 'dashboard.read'),
        ('manager', 'data_admin.audit.read'),
        ('manager', 'data_admin.template.generate'),
        ('manager', 'data_admin.upload'),
        ('manager', 'data_admin.validation.review'),
        ('manager', 'data_admin.change_request.create'),
        ('manager', 'data_admin.change_request.submit'),
        ('manager', 'data_admin.change_request.approve'),
        ('manager', 'data_admin.reference.manage'),

        ('admin', 'dashboard.read'),
        ('admin', 'data_admin.audit.read'),
        ('admin', 'data_admin.template.generate'),
        ('admin', 'data_admin.upload'),
        ('admin', 'data_admin.validation.review'),
        ('admin', 'data_admin.change_request.create'),
        ('admin', 'data_admin.change_request.submit'),
        ('admin', 'data_admin.change_request.approve'),
        ('admin', 'data_admin.change_request.apply'),
        ('admin', 'data_admin.rollback.apply'),
        ('admin', 'data_admin.reference.manage'),
        ('admin', 'security.users.manage'),
        ('admin', 'security.password_reset.manage'),
        ('admin', 'security.logs.read')
)
INSERT INTO security.role_permissions (role_id, permission_id)
SELECT DISTINCT r.id, p.id
FROM desired d
JOIN security.roles r ON r.code = d.role_code
JOIN security.permissions p ON p.code = d.permission_code
ON CONFLICT DO NOTHING;

WITH demo_accounts(username, email, full_name, role_code, password_hash) AS (
    VALUES
        ('demo_decideur', 'demo_decideur@example.com', 'Demo Décideur', 'ROLE_DECIDEUR', '$pbkdf2-sha256$29000$o3SuVSrl/H.P8Z4zRkgpJQ$jeK0V.hap7VAG6lWff9eK9cunNnLy.Z/AdS90hUzFBw'),
        ('demo_expert', 'demo_expert@example.com', 'Demo Expert', 'ROLE_EXPERT', '$pbkdf2-sha256$29000$mTMmJKS0tnYupdQaY.xdSw$vflNUKU5KCli.2k2S7/BFvLEni3NZDroD7A./Jx4EbE'),
        ('demo_consultant', 'demo_consultant@example.com', 'Demo Consultant', 'ROLE_CONSULTANT', '$pbkdf2-sha256$29000$fm.NESKk9B7DmBMCgJASQg$il2f7Gvk2zrudzBMoaT0ow/M8Yydr8UtKJpGgEPwv1A'),
        ('demo_data_admin', 'demo_data_admin@example.com', 'Demo Data Admin', 'ROLE_DATA_ADMIN', '$pbkdf2-sha256$29000$DWEsJUQI4RxDSOm9957zfg$R0ecNGw5N.sb.gBb/WFSh/fWnRok3xPdZS8TqOw3f7g'),
        ('demo_sys_admin', 'demo_sys_admin@example.com', 'Demo Sys Admin', 'ROLE_SYS_ADMIN', '$pbkdf2-sha256$29000$KcXYOydEaC1lzFnrXYsRYg$IxGImooFwzc99.Ezfm2C431VarlgwZhrMUoqMw4edxo'),
        ('demo_ai_agent', 'demo_ai_agent@example.com', 'Demo AI Agent', 'ROLE_AI_AGENT', '$pbkdf2-sha256$29000$WEuptVbqnRNirFWqtdaa0w$tOQu/pjWeOYOC9YqJSZrzMcagN4tSsVrersgKe4XO7s')
)
UPDATE security.users u
SET
    email = a.email,
    full_name = a.full_name,
    password_hash = a.password_hash,
    role_id = r.id,
    is_active = true,
    must_change_password = false,
    failed_login_attempts = 0,
    updated_at = now()
FROM demo_accounts a
JOIN security.roles r ON r.code = a.role_code
WHERE u.username = a.username;

WITH demo_accounts(username, email, full_name, role_code, password_hash) AS (
    VALUES
        ('demo_decideur', 'demo_decideur@example.com', 'Demo Décideur', 'ROLE_DECIDEUR', '$pbkdf2-sha256$29000$o3SuVSrl/H.P8Z4zRkgpJQ$jeK0V.hap7VAG6lWff9eK9cunNnLy.Z/AdS90hUzFBw'),
        ('demo_expert', 'demo_expert@example.com', 'Demo Expert', 'ROLE_EXPERT', '$pbkdf2-sha256$29000$mTMmJKS0tnYupdQaY.xdSw$vflNUKU5KCli.2k2S7/BFvLEni3NZDroD7A./Jx4EbE'),
        ('demo_consultant', 'demo_consultant@example.com', 'Demo Consultant', 'ROLE_CONSULTANT', '$pbkdf2-sha256$29000$fm.NESKk9B7DmBMCgJASQg$il2f7Gvk2zrudzBMoaT0ow/M8Yydr8UtKJpGgEPwv1A'),
        ('demo_data_admin', 'demo_data_admin@example.com', 'Demo Data Admin', 'ROLE_DATA_ADMIN', '$pbkdf2-sha256$29000$DWEsJUQI4RxDSOm9957zfg$R0ecNGw5N.sb.gBb/WFSh/fWnRok3xPdZS8TqOw3f7g'),
        ('demo_sys_admin', 'demo_sys_admin@example.com', 'Demo Sys Admin', 'ROLE_SYS_ADMIN', '$pbkdf2-sha256$29000$KcXYOydEaC1lzFnrXYsRYg$IxGImooFwzc99.Ezfm2C431VarlgwZhrMUoqMw4edxo'),
        ('demo_ai_agent', 'demo_ai_agent@example.com', 'Demo AI Agent', 'ROLE_AI_AGENT', '$pbkdf2-sha256$29000$WEuptVbqnRNirFWqtdaa0w$tOQu/pjWeOYOC9YqJSZrzMcagN4tSsVrersgKe4XO7s')
)
INSERT INTO security.users (
    username,
    email,
    full_name,
    password_hash,
    role_id,
    is_active,
    must_change_password,
    failed_login_attempts,
    created_at,
    updated_at
)
SELECT
    a.username,
    a.email,
    a.full_name,
    a.password_hash,
    r.id,
    true,
    false,
    0,
    now(),
    now()
FROM demo_accounts a
JOIN security.roles r ON r.code = a.role_code
ON CONFLICT (email) DO UPDATE
SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    password_hash = EXCLUDED.password_hash,
    role_id = EXCLUDED.role_id,
    is_active = true,
    must_change_password = false,
    failed_login_attempts = 0,
    updated_at = now();

INSERT INTO security.password_history (user_id, password_hash, changed_at, changed_by)
SELECT u.id, a.password_hash, now(), NULL
FROM (
    VALUES
        ('demo_decideur@example.com', '$pbkdf2-sha256$29000$o3SuVSrl/H.P8Z4zRkgpJQ$jeK0V.hap7VAG6lWff9eK9cunNnLy.Z/AdS90hUzFBw'),
        ('demo_expert@example.com', '$pbkdf2-sha256$29000$mTMmJKS0tnYupdQaY.xdSw$vflNUKU5KCli.2k2S7/BFvLEni3NZDroD7A./Jx4EbE'),
        ('demo_consultant@example.com', '$pbkdf2-sha256$29000$fm.NESKk9B7DmBMCgJASQg$il2f7Gvk2zrudzBMoaT0ow/M8Yydr8UtKJpGgEPwv1A'),
        ('demo_data_admin@example.com', '$pbkdf2-sha256$29000$DWEsJUQI4RxDSOm9957zfg$R0ecNGw5N.sb.gBb/WFSh/fWnRok3xPdZS8TqOw3f7g'),
        ('demo_sys_admin@example.com', '$pbkdf2-sha256$29000$KcXYOydEaC1lzFnrXYsRYg$IxGImooFwzc99.Ezfm2C431VarlgwZhrMUoqMw4edxo'),
        ('demo_ai_agent@example.com', '$pbkdf2-sha256$29000$WEuptVbqnRNirFWqtdaa0w$tOQu/pjWeOYOC9YqJSZrzMcagN4tSsVrersgKe4XO7s')
) AS a(email, password_hash)
JOIN security.users u ON u.email = a.email
WHERE NOT EXISTS (
    SELECT 1
    FROM security.password_history ph
    WHERE ph.user_id = u.id
      AND ph.password_hash = a.password_hash
);

COMMIT;
