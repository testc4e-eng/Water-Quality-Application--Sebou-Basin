# Corrections appliquées

## Principe

Aucune fonctionnalité métier nouvelle n’a été développée.

Seules des corrections minimales de connexion API et de robustesse runtime ont été appliquées.

## Fichiers modifiés

### Frontend

- `frontend/.env`
- `frontend/src/config/api.ts`
- `frontend/vite.config.ts`

### Backend

- `backend/app/services/admin_data_scan_service.py`

## Détail des corrections

### 1. Alignement du frontend local sur la vraie API SAD

Avant :

- `frontend/.env` pointait vers `127.0.0.1:8000`

Après :

- `frontend/.env` pointe vers `localhost:8010`

Effet :

- le frontend local cible désormais `sad-backend` au lieu de `agent-swat-api`

### 2. Alignement des fallbacks runtime

Modifications :

- `frontend/src/config/api.ts` fallback -> `127.0.0.1:8010/api/v1`
- `frontend/vite.config.ts` fallback proxy -> `127.0.0.1:8010`

Effet :

- en cas d’absence d’env locale, la pile reste alignée sur la vraie stack SAD Docker

### 3. Correction backend mineure sur `admin/data-availability`

Problème identifié :

- le service QA interrogeait `api.v_station_dimension.nom_station`
- la vue réelle expose `station_nom`
- l’erreur SQL laissait la transaction en état abort, ce qui cassait ensuite le reste du scan

Correction appliquée :

- remplacement de `nom_station` par `station_nom`
- ajout de `db.rollback()` dans les captures d’erreur du service pour éviter une transaction bloquée

Effet :

- `GET /api/v1/admin/data-availability` passe de `500` à `200`

### 4. Reconstruction du backend Docker

Commande utilisée :

```bash
docker compose up -d --build sad-backend
```

Effet :

- image SAD backend reconstruite à partir du dépôt courant
- service `sad-backend` republié correctement sur `8010`

## Correction non appliquée volontairement

Observation :

- `DELETE /api/v1/users/{id}` retourne un `500` si l’utilisateur supprimé est aussi l’acteur de la suppression, car l’audit tente d’écrire un `auth_log` avec une FK déjà supprimée

Décision :

- non corrigé ici
- hors périmètre strict “connexion API / contrat mineur dashboards”
- à traiter dans un correctif RBAC dédié
