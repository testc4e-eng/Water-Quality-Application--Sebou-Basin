# Audit RBAC actuel du module 114

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | audit code + base |
| Source de vérité | Oui pour le lot MVP4 |
| Date | 2026-06-05 |

## Périmètre audité

- `backend/app/security/*`
- `backend/app/api/v1/auth.py`
- `backend/app/api/v1/data_admin/rbac_guard.py`
- `backend/app/security/routes_users.py`
- `backend/app/routers/admin_users.py`
- `backend/app/routers/admin_password_resets.py`
- `backend/app/security/routes_logs.py`
- `frontend/src/pages/Login.tsx`
- `frontend/src/components/Layout/*`
- `frontend/src/pages/admin/DataGovernanceAuditPage.tsx`
- tables `security.*` de `abh_sad`

## Constat avant MVP4

### Authentification

- l'authentification applicative est réelle et repose sur `security.users` ;
- les mots de passe sont stockés hashés ;
- les sessions API utilisent un JWT ;
- `/api/v1/auth/login` et `/api/v1/auth/me` étaient déjà actifs.

### Modèle sécurité observé en base

- `security.users`
- `security.roles`
- `security.permissions`
- `security.role_permissions`
- tables annexes d'activité, password reset et historique mot de passe

Le modèle réel est un modèle **single-role** :

- un utilisateur porte `role_id` dans `security.users` ;
- aucune table `security.user_role` n'existe dans l'état observé ;
- les permissions sont résolues via `security.role_permissions`.

### RBAC data-admin avant MVP4

- le module `data_admin` utilisait une couche `rbac_guard.py` basée sur un mapping simulé ;
- les capacités `viewer / manager / admin` étaient dérivées d'un rôle applicatif simplifié ;
- la traçabilité backend était déjà durcie côté acteur HTTP, mais la matrice d'autorisation restait spécifique à `data_admin` ;
- le frontend pilotait encore une partie de l'affichage via heuristiques locales de rôle.

## Conclusion d'audit

```text
DATA_ADMIN_RBAC_AUDIT = AUTH_AVAILABLE
```

Le projet disposait déjà d'une vraie brique d'authentification et d'un vrai modèle `users -> roles -> permissions`, mais le module 114 n'utilisait pas encore ce modèle comme source officielle pour ses contrôles d'accès métier.

## Contraintes de mise en œuvre retenues

- réutiliser `security.users`, `security.roles`, `security.permissions`, `security.role_permissions` ;
- ne pas introduire de seconde source RBAC concurrente ;
- conserver la compatibilité des rôles legacy `viewer`, `manager`, `admin` ;
- faire porter les décisions d'accès par permissions réelles en base ;
- tracer toutes les actions sensibles avec l'utilisateur authentifié réel.
