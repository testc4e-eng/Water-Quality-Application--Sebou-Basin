# Audit Global des Incoherences

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | report |
| Perimetre | coherence croisee documentation / base / backend / frontend / lots |
| Source de verite | Non |
| Documents lies | [00_SOURCE_OF_TRUTH_MASTER](./00_SOURCE_OF_TRUTH_MASTER.md), [31_plan_correction_documentaire](./31_plan_correction_documentaire.md), [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md) |
| Derniere mise a jour | 2026-04-17 |

## 1. Methode

Verification croisee realisee a partir de :

- documentation active `docs/01_project_reference/*` et `docs/03_ai_knowledge_base/*` ;
- code backend `backend/app/main.py`, `backend/app/api/api_v1.py`, `backend/app/api/v1/*`, `backend/app/routers/*`, `backend/app/security/*` ;
- code frontend `frontend/src/App.tsx`, `frontend/src/api/*`, `frontend/src/services/*`, `frontend/src/pages/*` ;
- introspection SQL read-only de la base `abh_sad` via `backend/.env` le `2026-04-17`.

## 2. Inventaire structurel verifie

### Documents structurants controles

- `docs/01_project_reference/SOURCE_OF_TRUTH.md`
- `docs/01_project_reference/DOCUMENT_MAP.md`
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`
- `docs/01_project_reference/architecture/system_architecture.md`
- `docs/01_project_reference/backend/backend_overview.md`
- `docs/01_project_reference/backend/api_contracts.md`
- `docs/01_project_reference/frontend/frontend_reference.md`
- `docs/01_project_reference/LIVRABLES_MATRIX.md`
- `docs/12_plan_execution_par_lots.md`
- `docs/12_*`, `docs/14_*`, `docs/20_*`, `docs/21_*`, `docs/22_*`, `docs/23_*`, `docs/24_*`, `docs/25_*`, `docs/26_*`

### Base reelle `abh_sad` controlee

Schemas applicatifs verifies :

- `admin`, `analytics`, `api`, `audit`, `geo`, `hydro`, `infra`, `metadata`, `meteo`, `modeles`, `monitoring`, `public`, `qa`, `qualite`, `security`, `staging`, `swat_output`, `swat_sebou`, `wasp_output`, `wasp_sebou`

Quelques cardinalites exactes verifiees :

- `infra.stations_mesure` : `390`
- `infra.barrages` : `34`
- `hydro.mesure_debit` : `521433`
- `hydro.mesure_debit_mensuel` : `19316`
- `meteo.mesure_precipitation` : `546007`
- `meteo.mesure_evaporation` : `48900`
- `meteo.mesure_temperature` : `0`
- `qualite.mesure_qualite_riviere` : `60097`
- `qualite.mesure_qualite_nappe` : `63088`
- `qualite.mesure_qualite_barrage` : `15808`
- `qualite.mesure_qualite_sebou` : `51402`
- `qualite.suivi_qualite_barrage_garde_hebdo` : `7094`
- `qualite.source_pollution_prelevement` : `141`
- `qualite.source_pollution_mesure_param` : `7191`
- `security.activity_logs` : `74935`
- `wasp_sebou.wasp_results` : `931770`

### Routeurs FastAPI verifies

Groupes de routes montes sous `/api/v1` :

- `/auth/*`
- `/stations`
- `/stations/{station_id}/measurements`
- `/geojson/*`
- `/alerts`
- `/meta/*`
- `/raw/*`
- `/layers/*`
- `/layers/configs/*`
- `/names/*`
- `/users/*`
- `/security/logs/*`
- `/admin/data-availability`
- `/admin/password-reset-requests/*`
- `/admin/users/{user_id}/reset-password`
- `/climate/*`
- `/hydro/*`
- `/quality/*`
- `/observatory/*`
- `/analytics/*`
- `/swat/*`
- `/ingestion/*`

Routeur a risque structurel :

- `backend/app/api/v1/swat_analysis.py:18` declare `prefix="/api/v1/swat/analysis"` alors qu'il est monte sous `/api/v1`, ce qui cree un double prefix probable.

### Frontend principal verifie

Routes React declarees dans `frontend/src/App.tsx` :

- `/`
- `/dashboard`
- `/dashboard-cartographique`
- `/dashboard-2`
- `/carte`
- `/dashboard-analytique`
- `/dashboard-scenarios`
- `/admin/data-scan`
- `/admin/gestion-users`
- `/admin/users` -> redirection
- `/admin/password-resets`
- `/admin/audit` -> redirection
- `/admin/ingestion`
- `/admin/popup-rules`
- `/about`
- `/contact`
- `/data`
- `/login`
- `/register`
- `/change-password`

## 3. Registre des incoherences

| ID | Type | Source exacte | Description | Impact | Criticite |
|---|---|---|---|---|---|
| `INC-DB-001` | DB / doc | `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md:48` vs DB SQL `2026-04-17` | Le resume IA annonce `security.activity_logs = 71717` alors que la base contient `74935` lignes. | Cardinalites faux-amis pour audit, exploitation et raisonnement agent. | moyen |
| `INC-DB-002` | DB / doc | `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md:12-20` vs DB SQL `2026-04-17` | Le resume IA ne reflete plus le snapshot courant des schemas applicatifs. La base expose `api = 52 vues / 25 MVs`, plus `admin`, `modeles`, `monitoring`, `qa`, `public`. | Vision schema partielle pour les agents et les audits. | moyen |
| `INC-DOC-001` | doc / doc | `docs/01_project_reference/LIVRABLES_MATRIX.md:24` | Le livrable "Dictionnaire de donnees" pointe vers `docs/01_project_reference/data/data_dictionary.md`, fichier absent du referentiel actif. | Brise la navigation et degrade la confiance dans la matrice des livrables. | critique |
| `INC-API-001` | doc / backend | `docs/01_project_reference/backend/backend_overview.md:9-26` | Le document backend decrit encore des routes appuyees sur `public.stations_abhs`, `public.barrages_abhs` et `qualite._legacy_qualite_riviere`. Le code monte aujourd'hui des familles `auth`, `users`, `security`, `observatory`, `analytics`, `ingestion`, `layers/configs`, etc. | Vue backend trompeuse, inadaptee pour maintenance et agents. | critique |
| `INC-API-002` | doc / backend / DB | `docs/01_project_reference/backend/api_contracts.md:3,60,126,223,263,279` | Le catalogue API documente des endpoints non deployes ou non retrouves dans le code (`/infra/stations`, `/meteo/precipitations/timeseries`, `/hydro/debits/timeseries`, `/map/overview`, `/map/layers/quality-status`, `/exports`). Certains objets SQL cites n'existent pas non plus (`admin.catalogue_parametre`, `api.mv_station_latest_status`, `api.v_station_status_geojson`). | Le document ne peut pas etre conserve comme verite de l'API deployee. | critique |
| `INC-FE-001` | doc / frontend | `docs/01_project_reference/frontend/frontend_reference.md:38-48` vs `frontend/src/App.tsx:46-101` | La doc frontend omet les routes reelles `/dashboard-2`, `/carte`, `/about`, `/contact` et ne mentionne pas la route hub `/admin/gestion-users`. | Navigation UI documentee de maniere incomplete. | moyen |
| `INC-FE-002` | doc / frontend | `docs/01_project_reference/frontend/frontend_reference.md:43,45,116` vs `frontend/src/App.tsx:53-80` | La doc presente `/admin/users` et `/admin/audit` comme pages directes, alors que l'application utilise `/admin/gestion-users` et ne garde `/admin/users` et `/admin/audit` que comme redirections. | Mauvaise comprehension du parcours admin et du routage effectif. | moyen |
| `INC-PROJ-001` | doc / projet | `docs/12_plan_execution_par_lots.md:17-43` vs `docs/12_*` et `docs/14_*` | Le plan d'execution parle encore d'un Lot 1 "en attente d'autorisation pour amorcer l'audit", alors que les audits et dry-runs des Lots 1 a 4A-4 existent deja. | Pilotage faux ; le document ne peut plus servir de statut de reference. | critique |
| `INC-BE-DB-001` | backend / DB | `backend/app/api/v1/stations.py:26-28`, `backend/app/api/v1/measurements.py:16`, `backend/app/routers/quality.py`, `backend/app/routers/entities.py` vs DB SQL `2026-04-17` | Une partie du backend pointe encore vers `public.mesures_debit_jr`, `public.mesures_temperatures_jr`, `public.mesures_qualite_rivieres`, `public.stations_abhs`, `public.barrages_abhs`, objets absents de `abh_sad`. | Certaines routes montent bien mais ne sont pas alignees avec la base reelle ; risque d'erreur runtime. | critique |
| `INC-BE-API-001` | backend / frontend | `backend/app/api/v1/swat_analysis.py:18` vs `frontend/src/api/client.ts:445` | Le routeur SWAT analysis declare un prefix incluant deja `/api/v1`, puis il est monte sous `/api/v1`. Le frontend appelle `/swat/analysis/compare`. | Contrat probable casse pour la comparaison SWAT/WASP. | critique |
| `INC-FE-BE-001` | frontend / doc | `frontend/src/api/client.ts:9`, `frontend/src/api/climate.ts:91` vs `README.md:37,52-54` et `frontend/README.md:21` | Le client API par defaut pointe sur `127.0.0.1:8000/api/v1` et `climate.ts` hardcode `http://localhost:8000/api/v1/climate`, alors que la doc de lancement normalise `8011` et l'usage de `VITE_API_BASE_URL`. | Ambiguite de configuration locale ; risque de faux positif en dev. | moyen |
| `INC-DOC-002` | doc / doc / backend | `docs/01_project_reference/SOURCE_OF_TRUTH.md:29-31` | Avant correction, `SOURCE_OF_TRUTH` traite `api_contracts.md` comme document maitre des contrats API, alors que ce fichier diverge fortement du backend deploye. | Mauvaise gouvernance documentaire sur l'API. | critique |
| `INC-DOC-003` | doc / frontend / backend | `docs/01_project_reference/frontend/frontend_reference.md` et `docs/01_project_reference/backend/backend_overview.md` | Les deux documents de reference ne distinguent pas les modules stables et les modules legacy ou a risque (`quality`, `entities`, `swat_analysis`, clients hardcodes frontend). | Encourage des decisions de maintenance sur des hypotheses fausses. | critique |

## 4. Conclusion d'audit

La derive documentaire n'est pas uniforme :

- la structure globale de la documentation est bonne ;
- la base active `abh_sad` est assez stable et bien structuree ;
- la divergence principale porte sur la couche applicative, avec un melange entre routes stables, routes legacy encore montees, et documents backend/API trop anciens ;
- le chantier lots/migration est documente en detail, mais le document de pilotage `12_plan_execution_par_lots.md` n'est plus a jour.

Le plan de correction retenu est formalise dans [31_plan_correction_documentaire](./31_plan_correction_documentaire.md).
