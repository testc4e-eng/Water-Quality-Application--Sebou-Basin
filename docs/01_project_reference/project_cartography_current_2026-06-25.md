# Cartographie Projet - Clone Actuel 2026-06-25

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Perimetre | cartographie technique du clone actuel, ecarts runtime, backend, frontend, BD et documentation |
| Source de verite | Oui |
| Documents lies | [../00_SOURCE_OF_TRUTH_MASTER.md](../00_SOURCE_OF_TRUTH_MASTER.md), [DOCUMENT_MAP.md](./DOCUMENT_MAP.md), [backend/backend_overview.md](./backend/backend_overview.md), [frontend/frontend_reference.md](./frontend/frontend_reference.md) |
| Derniere mise a jour | 2026-06-25 |

## 1. Objectif

Ce document cartographie la version actuellement presente dans le clone :

- code reel du depot ;
- configuration de connexion ;
- runtime observe sur la machine au 2026-06-25 ;
- ecarts entre documentation, passation et code reel.

Regle de lecture :

1. code du clone courant ;
2. ports et services reellement observes ;
3. documentation active ;
4. documentation de passation.

## 2. Vue d'ensemble du depot

### Racine

| Dossier | Role reel |
|---|---|
| `backend/` | application FastAPI, services metier, acces PostgreSQL, ingestion, securite |
| `frontend/` | application React + Vite + TypeScript |
| `docs/` | referentiel documentaire principal |
| `sandbox/` | experimentation ML et travaux non critiques de prod |

### Diagnostic de maturite

| Zone | Statut |
|---|---|
| Documentation de reference | `usable_but_divergent_on_runtime` |
| Backend clone courant | `present_but_runtime_not_verified_for_this_clone` |
| Frontend clone courant | `present_but_config_diverges_from_standard_docs` |
| Connexion base de donnees | `configured_and_port_reachable_but_not_verified_via_this_backend_runtime` |
| Dossier de passation | `valuable_but_not_authoritative_over_current_clone` |

## 3. Backend actuel

### Point d'entree

- entree FastAPI : `backend/app/main.py`
- agregateur de routeurs : `backend/app/api/api_v1.py`
- session SQLAlchemy : `backend/app/db/session.py`
- connecteur brut et health DB : `backend/app/db_raw.py`

### Sous-modules applicatifs presents

`backend/app/` contient actuellement :

- `api`
- `core`
- `db`
- `etl`
- `models`
- `repositories`
- `routers`
- `routers_legacy_public`
- `schemas`
- `scripts`
- `security`
- `services`

### Groupes fonctionnels montes dans `api_v1.py`

Le backend monte reellement les familles suivantes :

- `auth`
- `stations`
- `geojson`
- `measurements`
- `alerts`
- `meta`
- `raw`
- `data_admin/*`
- `entities`
- `layers`
- `names`
- `users`
- `security`
- `admin/*`
- `climate`
- `hydro`
- `quality`
- `pollution`
- `map`
- `propagation`
- `kpi`
- `recommendations`
- `dashboard`
- `observatory`
- `analytics`
- `swat`
- `layer_configs`

### Ecart critique backend

Les modules de continuite cites dans la passation ne sont pas presents dans ce clone :

- `backend/app/routers/business_map.py` : absent
- `backend/app/routers/analysis.py` : absent

Consequence :

- la Carte Metier documentee dans la passation n'est pas cablee ici sous la forme backend attendue ;
- le commit/patche de continuite mentionne en passation semble ne pas etre applique dans ce clone.

## 4. Frontend actuel

### Socle

- framework : React 18
- bundler : Vite
- langage : TypeScript
- donnees : `@tanstack/react-query`
- cartographie : `maplibre-gl`, `react-map-gl`, `leaflet` present en dependance

### Dossiers frontend presents

`frontend/src/` contient actuellement :

- `api`
- `assets`
- `charts`
- `components`
- `config`
- `hooks`
- `layers`
- `lib`
- `mocks`
- `pages`
- `services`
- `types`

### Routes UI visibles dans `frontend/src/App.tsx`

Routes metier/principales :

- `/`
- `/dashboard`
- `/dashboard-cartographique`
- `/dashboard-carto-metier`
- `/dashboard-qualite-reglementaire`
- `/dashboard-data-qa`
- `/dashboard-scenarios`
- `/dashboard-pollution`
- `/pollution`
- `/pollution-idp-dev`
- `/administration`
- `/data`

Routes admin :

- `/admin/data-governance/audit`
- `/admin/data-scan`
- `/admin/gestion-users`
- `/admin/users`
- `/admin/password-resets`
- `/admin/audit`
- `/admin/ingestion`
- `/admin/popup-rules`

Routes support :

- `/about`
- `/contact`
- `/login`
- `/register`
- `/change-password`

### Ecart critique frontend

Les modules frontend de continuite cites dans la passation ne sont pas presents dans ce clone :

- `frontend/src/api/businessMapV1.ts` : absent
- `frontend/src/api/analysis.ts` : absent
- `frontend/src/components/DashboardMetier/V1/` : absent
- `frontend/src/components/analysis-workspace/` : absent

Consequence :

- les routes UI de la Carte Metier existent, mais pas le socle frontend de continuite annonce dans la passation ;
- la passation decrit un etat de travail plus avance que ce qui est visible dans ce clone.

## 5. Base de donnees et connectivite

### Configuration observee sans secrets

Le backend est configure pour viser :

- `DB_HOST=127.0.0.1`
- `DB_PORT=5432`
- `DB_NAME=abh_sad`

Base climat secondaire :

- `CLIMATE_DB_HOST=127.0.0.1`
- `CLIMATE_DB_PORT=5432`
- `CLIMATE_DB_NAME=abh_sad`

### Chemins de connexion dans le code

- `backend/app/db/session.py` construit un `DATABASE_URL` PostgreSQL `psycopg2`
- `backend/app/db_raw.py` gere le pool psycopg2 et le `ping()`
- `backend/app/main.py` declare :
  - `/health`
  - test DB au startup via `SELECT 1`

### Verification machine au 2026-06-25

Tests reseau locaux :

- port `5432` : accessible
- port `8000` : accessible
- port `8010` : refuse

Reponses HTTP observees :

- `http://127.0.0.1:8000/` renvoie `{"message":"C4E ET Pipeline API","docs":"/docs"}`
- `http://127.0.0.1:8000/health` renvoie `{"status":"ok","version":"0.1.0","subsystems":{"database":"not_checked"}}`

Conclusion operative :

- PostgreSQL local semble joignable sur `5432`
- un service HTTP ecoute sur `8000`
- ce service ne correspond pas au `backend/app/main.py` de ce depot
- le backend de ce clone n'est donc pas verifie comme demarre au moment de l'audit
- la connexion BD est configuree dans le code, mais pas confirmee par le runtime de ce clone

## 6. Topologie runtime et ecarts de ports

### Documentation de reference

Le `README.md` du depot documente :

- backend natif : `8000`
- frontend natif : `3001`
- backend Docker : `8010 -> 8000`
- frontend Docker : `5174 -> 5173`

### Configuration frontend reelle du clone

Le frontend pointe actuellement sur :

- `frontend/.env` :
  - `VITE_API_BASE_URL=http://localhost:8010/api/v1`
  - `VITE_API_BASE=http://localhost:8010/api/v1`
  - `VITE_API_PROXY=http://localhost:8010`
- `frontend/src/config/api.ts` :
  - fallback : `http://127.0.0.1:8010/api/v1`

### Ecart critique de cablage

Au 2026-06-25 :

- la documentation de reference normalise `8000`
- le frontend du clone cible `8010`
- aucun service n'ecoute sur `8010`
- un autre service occupe `8000`

Conclusion :

- frontend et backend ne sont pas alignes operativement sur cette machine
- avant tout test fonctionnel, il faut choisir un seul mode d'execution et revalider les ports

## 7. Docker / orchestration

La documentation et la passation referencent un `docker-compose.yml`.

Constat dans ce clone :

- aucun fichier `docker-compose.yml`
- aucun `compose.yml`
- aucun `compose.yaml`

Conclusion :

- la documentation de deploiement parle d'une orchestration qui n'est pas presente dans cette version du depot
- il faut considerer la passation Docker comme une reference de contexte, pas comme une preuve que ce clone est directement demarrable en `docker compose`

## 8. Cartographie documentaire utile pour comprendre le projet

### Documents maitres a lire en premier

1. `docs/00_SOURCE_OF_TRUTH_MASTER.md`
2. `docs/README.md`
3. `docs/01_project_reference/DOCUMENT_MAP.md`
4. `docs/01_project_reference/backend/backend_overview.md`
5. `docs/01_project_reference/frontend/frontend_reference.md`

### Dossier de passation externe fourni par l'utilisateur

Ordre utile :

1. `passation_developpeuse_20260623/01_note_cadrage_deploiement_et_reprise.md`
2. `passation_developpeuse_20260623/04_synthese_passation_conge_chef_projet_20260623.md`
3. `passation_developpeuse_20260623/02_etat_global_projet_20260622.md`
4. `passation_developpeuse_20260623/03_rapport_passation_conge_chef_projet_20260623.md`
5. `passation_developpeuse_20260623/08_commit_code_continuite_resume.md`

### Comment classer ces documents

| Document | Role |
|---|---|
| `docs/00_SOURCE_OF_TRUTH_MASTER.md` | source de verite transverse du depot |
| `docs/01_project_reference/*` | references techniques maitres |
| dossier `passation_developpeuse_20260623/` | documentation de relais projet, utile mais non souveraine sur le clone courant |

## 9. Ce que vous faites depuis le debut jusqu'a maintenant

Lecture consolidee de la trajectoire :

1. le socle plateforme `backend + frontend + base abh_sad + docs` a deja ete construit
2. le projet est ensuite entre en phase de stabilisation preprod et d'assainissement metier
3. la passation decrit un chantier Carte Metier / Workspace de continuite plus avance
4. le clone audite aujourd'hui ne contient pas cette continuite sous forme de fichiers presents
5. la documentation reste riche, mais le clone, le runtime et la passation ne sont pas strictement alignes

## 10. Actions recommandees

### Quick check

1. decider si le clone courant est bien le clone de travail cible
2. identifier si le patch `2221edf` doit etre applique dans ce depot
3. verifier quel service occupe actuellement `8000`
4. choisir un standard unique de port backend entre `8000` et `8010`

### Remise en coherence minimale

1. realigner `frontend/.env` et `frontend/src/config/api.ts` avec le backend reel vise
2. confirmer si un fichier compose doit etre restitue ou si la doc Docker doit etre revue
3. comparer ce clone avec le patch `09_patch_commit_local_2221edf.patch`

### Preproduction

1. demarrer explicitement le backend de ce depot
2. tester son `/health`
3. confirmer la connexion reelle a `abh_sad`
4. seulement ensuite auditer Carte Metier, Dashboard Qualite et Home DG
