# Deployment and Operations

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | déploiement local, exploitation, maintenance et opérations courantes |
| Source de vérité | Oui |
| Documents liés | [backend_overview](../backend/backend_overview.md), [frontend_reference](../frontend/frontend_reference.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Objet

Ce document regroupe dans une seule référence :

- le démarrage local du projet ;
- les variables d’environnement nécessaires ;
- l’exploitation des vues matérialisées ;
- les opérations courantes de maintenance, monitoring et sauvegarde.

## 2. Prérequis techniques

### Backend

- Python 3.10+
- dépendances `backend/requirements.txt`
- accès PostgreSQL/PostGIS/TimescaleDB

### Frontend

- Node.js 20+
- npm

### Base de données

- PostgreSQL
- extension PostGIS
- extension TimescaleDB

## 3. Configuration locale

### Backend

Renseigner `backend/.env` avec au minimum :

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `SECRET_KEY`

Variables complémentaires selon contexte :

- `BACKEND_CORS_ORIGINS`
- variables de sécurité JWT ou d’hébergement selon environnement cible

### Frontend

Renseigner `frontend/.env` avec :

- `VITE_API_BASE_URL`
- `VITE_API_BASE`
- `VITE_API_PROXY`

## 4. Démarrage local

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

## 5. Endpoints opérationnels utiles

- santé API : `GET /health`
- swagger : `/docs`
- statut des materialized views : `GET /api/v1/observatory/mviews/status`
- refresh des materialized views : `POST /api/v1/observatory/mviews/refresh`

## 6. Industrialisation analytique

Le projet intègre déjà des mécanismes dédiés au refresh et au suivi des vues matérialisées :

- script Python : `backend/scripts/refresh_mviews.py`
- script Windows : `backend/scripts/register_mv_refresh_task.ps1`
- pack SQL : `backend/sql/2026_04_mv_perf_pack.sql`
- suivi en base : `metadata.mv_refresh_status`

## 7. Monitoring recommandé

| Axe | Élément à suivre |
|---|---|
| API | temps de réponse, taux d’erreur, saturation éventuelle |
| Base | retard de refresh des MVs, volumétrie, santé TimescaleDB |
| Frontend | échecs d’appel API, volumétrie des jeux rendus, erreurs UX bloquantes |
| Sécurité | journaux d’authentification, logs d’activité, demandes de reset |

## 8. Sauvegarde et restauration

### Sauvegarde logique complète

```bash
pg_dump -Fc -U <user> -d <database> -f backup_<database>_<date>.dump
```

### Sauvegarde ciblée par schéma

```bash
pg_dump -U <user> -d <database> -n api -f api_schema_backup.sql
```

### Restauration

```bash
pg_restore -U <user> -d <database> --clean --if-exists backup_<database>_<date>.dump
```

## 9. Maintenance courante

### Base de données

- vérification du refresh des vues matérialisées ;
- contrôle des logs de sécurité ;
- suivi de la volumétrie des objets majeurs ;
- opérations `VACUUM ANALYZE` sur les tables sensibles si nécessaire ;
- validation des règles popup et des mappings dans `metadata`.

### Application

- contrôle des parcours critiques backend/frontend après évolution ;
- vérification des écrans d’administration ;
- contrôle des modules d’ingestion, d’audit et d’exploration des données.

## 10. Points d’attention

- ne jamais exposer de secrets dans les documents de référence ;
- utiliser la couche `api` et les vues matérialisées chaque fois que cela évite des scans bruts volumineux ;
- maintenir la cohérence entre documentation opérationnelle, scripts SQL et scripts backend.
