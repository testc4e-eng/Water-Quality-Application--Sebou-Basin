# 116 — Durcissement sécurité (pré-livraison)

**Contexte** : passe de sécurité avant la version quasi-finale (échéance
2026-07-28). Basée sur un audit défensif complet du backend FastAPI, du
frontend React et du docker-compose (2026-07-24).

## Correctifs appliqués

| # | Gravité | Constat | Correctif | Statut |
|---|---------|---------|-----------|--------|
| S1 | CRITIQUE | `/api/v1/raw/*` : CRUD + DELETE sur n'importe quelle table **sans authentification** | `dependencies=[Depends(require_roles("admin"))]` au niveau du routeur (`backend/app/api/v1/raw.py`) | ✅ |
| S2 | HAUTE | `/auth/register` acceptait le `role_code` du client → escalade de privilèges (création directe d'un compte admin) | Rôle forcé à `viewer` côté serveur ; l'élévation passe par `/admin/users` (protégé par `security.users.manage`) | ✅ |
| S3 | CRITIQUE | `backend/.env` (mot de passe DB + SECRET_KEY JWT) et `frontend/.env` (clé MapTiler) **suivis par git** — la faute aux négations `!backend/**`/`!frontend/**` du `.gitignore` qui écrasaient le pattern `.env` | `git rm --cached` des deux fichiers ; ré-exclusions explicites en fin de `.gitignore` (après les négations) ; `.env.example` fournis sans valeurs réelles | ✅ |

## ⚠️ Actions restantes côté exploitation (à faire manuellement)

Les secrets ont été retirés du **suivi** git, mais restent dans **l'historique**
(commits antérieurs, y compris sur `origin`). Le retrait du suivi ne protège
pas rétroactivement. Avant toute diffusion du dépôt :

1. **Régénérer la SECRET_KEY JWT** :
   `python -c "import secrets; print(secrets.token_hex(32))"` → remplacer dans
   `backend/.env` (local) et dans l'environnement de déploiement. Tous les
   tokens en cours seront invalidés (reconnexion requise).
2. **Changer le mot de passe PostgreSQL** (`abh_sad`, utilisateur postgres) et
   répercuter dans `backend/.env` + variables Docker.
3. **Régénérer la clé MapTiler** sur cloud.maptiler.com et mettre à jour
   `frontend/.env`.
4. Optionnel (si le dépôt doit être diffusé au client) : purge de l'historique
   (`git filter-repo --path backend/.env --invert-paths` etc.) — opération
   destructive à coordonner, ne pas faire pendant la stabilisation.

## Constats vérifiés sans objet (faux positifs)

- `wqss.env.txt` (racine) : **non suivi** par git (contrairement au premier
  rapport d'audit) — désormais explicitement ignoré par précaution.
- Injection SQL dans `/raw/*` : **non** — les identifiants passent par
  `psycopg2.sql.Identifier` (paramétrage correct).
- Sourcemaps en production : non activées (RAS).
- `dangerouslySetInnerHTML` (`ui/chart.tsx`) : CSS de config développeur, pas
  d'entrée utilisateur — risque faible, non traité.

## Reste à traiter (voir fiches suivantes)

- Durcissement `main.py` : headers de sécurité, `/docs` conditionnés par l'env,
  `DEBUG=false` par défaut → fiche [01](01_hardening_main.md).
- Auth globale sur les routeurs de données publics (stations, measurements,
  dashboard, quality…) : **décision produit requise** (l'app doit-elle exposer
  la donnée en lecture anonyme ?).
- Politique de mot de passe (longueur seule), durée de token 120 min,
  `admin_data_scan_service` (f-strings SQL à valider), fallback
  `SECRET_KEY` faible dans docker-compose.
