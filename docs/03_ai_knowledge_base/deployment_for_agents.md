# Deployment - SAD Sebou 2026

## Etat actuel
Le projet est démarrable localement et dispose d’un socle opérationnel déjà structuré pour le refresh des vues matérialisées, l’exploitation courante et la maintenance documentaire.

## Référence maître
Consulter en priorité :
- `docs/01_project_reference/deployment_operations/deployment_and_operations.md`

## Chaîne minimale à connaître
1. Backend FastAPI lancé localement via `uvicorn`.
2. Frontend Vite lancé via `npm run dev`.
3. Base PostgreSQL/PostGIS/TimescaleDB accessible via `backend/.env`.
4. Refresh des MVs via API et scripts backend.

## Chaîne Docker locale simple

Mise à jour 2026-06-02 :

- un socle Docker Compose pédagogique est ajouté pour le démarrage local reproductible `DB + backend + frontend`
- fichiers d'entrée :
  - `backend/Dockerfile`
  - `frontend/Dockerfile`
  - `docker-compose.yml`
  - `.env.docker.example`
- documentation dédiée :
  - `docs/dockerisation_sad/00_audit_initial.md`
  - `docs/dockerisation_sad/01_guide_lancement_windows_wsl.md`
  - `docs/dockerisation_sad/02_commandes_utiles_docker.md`
  - `docs/dockerisation_sad/03_depannage_erreurs_frequentes.md`
  - `docs/dockerisation_sad/05_audit_objets_sql_attendus.md`
  - `docs/dockerisation_sad/06_audit_base_docker.md`
  - `docs/dockerisation_sad/07_matrice_tests_api_docker.md`
  - `docs/dockerisation_sad/08_strategie_initialisation_db_docker.md`
  - `docs/dockerisation_sad/09_plan_tests_api_docker.md`
- préparation DB Docker :
  - `database/docker_init/00_extensions.sql`
  - `database/docker_init/01_schemas.sql`
  - `database/docker_init/02_empty_views_api.sql`
  - `database/docker_init/03_minimal_seed_demo.sql`
- validation API Docker :
  - `scripts/test_docker_api.ps1`
- convention Docker retenue :
  - PostgreSQL/PostGIS `5432`
  - FastAPI `8000`
  - React/Vite `5173`
- mode de connexion DB ajoute :
  - mode par defaut recommande pour la plateforme complete : `sad-backend` Docker -> PostgreSQL locale Windows `abh_sad` via `host.docker.internal`
  - mode optionnel interne Compose : service `sad-db` lance uniquement avec le profil `docker-db`
- cette chaîne Docker ne remplace pas encore le mode local historique documenté en `8011/3001`
- aucun dump base n'est importé automatiquement dans cette première version
- aucune suppression de volume ne doit être faite sans validation explicite
- l'initialisation SQL Docker doit rester explicite et manuelle tant qu'elle n'a pas été validée

## Points d’attention
- ne jamais exposer les secrets d’environnement dans les documents ou réponses
- vérifier la cohérence entre scripts SQL, scripts backend et documentation d’exploitation
- privilégier la documentation maître plutôt qu’un récit parallèle dans les notes agents
