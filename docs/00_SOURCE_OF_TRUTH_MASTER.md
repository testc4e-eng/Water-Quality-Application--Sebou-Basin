# SOURCE_OF_TRUTH_MASTER

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Perimetre | vue consolidee et verifiee du projet WQDSS : architecture, DB, API, frontend, lots et blocages |
| Source de verite | Oui |
| Documents lies | [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md), [DOCUMENT_MAP](./01_project_reference/DOCUMENT_MAP.md), [30_audit_incoherences_global](./12_historique_et_archives/root_legacy/30_audit_incoherences_global.md) |
| Derniere mise a jour | 2026-05-22 |

## 1. Finalite

Ce document sert de point d'entree unique quand il existe un doute entre :

- la documentation active ;
- le code backend/frontend ;
- la base `abh_sad` ;
- les dossiers de lots et de dry-run.

La regle de precedence est simple :

1. DB reelle `abh_sad`
2. code monte dans le depot
3. documentation corrigee

## 2. Architecture reelle

### Stack

| Couche | Realite verifiee |
|---|---|
| Frontend | React 18 + Vite + TypeScript + React Query |
| Backend | FastAPI montee sous `/api/v1` via `backend/app/main.py` et `backend/app/api/api_v1.py` |
| Base | PostgreSQL + PostGIS + TimescaleDB |
| Analytique | vues `api.*`, vues materialisees `api.*` et `analytics.*`, service de refresh `metadata.refresh_perf_mviews()` |

### Modules fonctionnels reels

- dashboards cartographiques et analytiques ;
- observatoire et hierarchies metier ;
- administration utilisateurs, audit, password reset, data-scan ;
- ingestion et QA SWAT/WASP ;
- couches SIG et configuration de couches ;
- data viewer CRUD generique ;
- scenarios et resultats WASP/SWAT.

## 3. Base reelle `abh_sad`

### Schemas applicatifs verifies le 2026-04-17

| Schema | Tables | Vues | Vues materialisees |
|---|---:|---:|---:|
| `admin` | 5 | 0 | 0 |
| `analytics` | 0 | 0 | 3 |
| `api` | 0 | 52 | 25 |
| `audit` | 1 | 0 | 0 |
| `geo` | 13 | 0 | 0 |
| `hydro` | 7 | 0 | 0 |
| `infra` | 22 | 0 | 0 |
| `metadata` | 37 | 2 | 3 |
| `meteo` | 5 | 0 | 0 |
| `modeles` | 3 | 0 | 0 |
| `monitoring` | 3 | 0 | 0 |
| `public` | 1 | 2 | 0 |
| `qa` | 1 | 0 | 0 |
| `qualite` | 8 | 0 | 0 |
| `security` | 11 | 0 | 0 |
| `staging` | 35 | 0 | 0 |
| `swat_output` | 8 | 0 | 0 |
| `swat_sebou` | 4 | 0 | 0 |
| `wasp_output` | 5 | 0 | 0 |
| `wasp_sebou` | 3 | 0 | 0 |

### Cardinalites de reference

| Objet | Cardinalite exacte |
|---|---:|
| `infra.stations_mesure` | 390 |
| `infra.barrages` | 34 |
| `hydro.mesure_debit` | 521433 |
| `hydro.mesure_debit_mensuel` | 19316 |
| `meteo.mesure_precipitation` | 546007 |
| `meteo.mesure_evaporation` | 48900 |
| `meteo.mesure_temperature` | 0 |
| `qualite.mesure_qualite_riviere` | 60097 |
| `qualite.mesure_qualite_nappe` | 63088 |
| `qualite.mesure_qualite_barrage` | 15808 |
| `qualite.mesure_qualite_sebou` | 51402 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 7094 |
| `qualite.source_pollution_prelevement` | 141 |
| `qualite.source_pollution_mesure_param` | 7191 |
| `security.activity_logs` | 74935 |
| `wasp_sebou.wasp_results` | 931770 |

### Fait critique

Les objets suivants ne sont pas presents dans `abh_sad` et ne doivent plus etre traites comme tables de production :

- `public.stations_abhs`
- `public.barrages_abhs`
- `public.mesures_debit_jr`
- `public.mesures_temperatures_jr`
- `public.mesures_qualite_rivieres`

## 4. API reelle

### Groupes de routes montes

| Groupe | Prefixe effectif | Statut |
|---|---|---|
| Auth | `/api/v1/auth/*` | stable |
| Stations / mesures | `/api/v1/stations`, `/api/v1/stations/{station_id}/measurements` | mixte |
| GeoJSON | `/api/v1/geojson/*` | stable |
| Meta | `/api/v1/meta/*` | stable |
| Raw data | `/api/v1/raw/*` | stable |
| Layers | `/api/v1/layers/*` | stable |
| Layer configs | `/api/v1/layers/configs/*` | stable |
| Names | `/api/v1/names/*` | stable |
| Users | `/api/v1/users/*` | stable |
| Security logs | `/api/v1/security/logs/*` | stable |
| Admin data-scan | `/api/v1/admin/data-availability` | stable |
| Admin password reset | `/api/v1/admin/password-reset-requests/*` | stable |
| Admin force reset | `/api/v1/admin/users/{user_id}/reset-password` | stable |
| Climate | `/api/v1/climate/*` | stable |
| Hydro | `/api/v1/hydro/*` | stable |
| Quality | `/api/v1/quality/*` | legacy / a verifier |
| Observatory | `/api/v1/observatory/*` | stable |
| Analytics | `/api/v1/analytics/*` | stable |
| SWAT / WASP | `/api/v1/swat/*` | stable |
| Ingestion | `/api/v1/ingestion/*` | stable |

### Zones API a risque

- `app.routers.quality` requete encore `public.mesures_qualite_rivieres`, absent de `abh_sad`.
- `app.routers.entities` expose des routes barrage/alertes basees sur `public.stations_abhs` et `public.barrages_abhs`, absents de `abh_sad`.
- `app.api.v1.stations` et `app.api.v1.measurements` restent partiellement configures via `TBL_* = public.*` dans `backend/.env`.
- `app.api.v1.swat_analysis.py` declare `prefix="/api/v1/swat/analysis"` et est inclus sous `/api/v1` ; le chemin final est donc a normaliser avant de le considerer comme contrat stable.

### Regle documentaire

Pour l'API deployee reelle, ce document et `backend_overview.md` font foi.
`api_contracts.md` doit etre lu comme specification cible / backlog contractuel, pas comme reflet exact des routes montees.

## 5. Frontend reel

### Routes UI verifiees

| Route | Usage | Dependances principales |
|---|---|---|
| `/` | landing page | layout, navigation |
| `/dashboard` | dashboard historique | `api/client`, `geojson`, `raw` |
| `/dashboard-cartographique` | carte principale | `api/client`, `layers`, observatory |
| `/dashboard-2`, `/carte` | dashboard carte / observatory | `api/observatory` |
| `/dashboard-analytique` | analytique multi-domaines | `api/analytics`, `api/observatory`, `api/climate`, `api/hydro`, `api/quality` |
| `/dashboard-scenarios` | scenarios / modeles | `api/client`, `swat`, `swat analysis` |
| `/admin/data-scan` | scan de disponibilite | `services/dataScanService` -> `/admin/data-availability` |
| `/admin/gestion-users` | hub users + audit | `services/userService`, `services/auditService` |
| `/admin/users` | redirection vers hub | redirection |
| `/admin/audit` | redirection vers hub | redirection |
| `/admin/password-resets` | demandes reset | `services/passwordResetService` |
| `/admin/ingestion` | ingestion et QA | `services/ingestionService` |
| `/admin/popup-rules` | configurations de couches | `services/layerConfigApi` |
| `/data` | data viewer CRUD | `api/client` -> `/raw/*` |
| `/login`, `/register`, `/change-password` | auth | `/auth/*` |
| `/about`, `/contact` | pages institutionnelles | contenu statique |

### Faits critiques frontend

- `frontend/src/api/client.ts` utilise encore `127.0.0.1:8000/api/v1` comme fallback, alors que la documentation de lancement normalise `8011`.
- `frontend/src/api/climate.ts` hardcode `http://localhost:8000/api/v1/climate` au lieu d'utiliser `BASE_URL`.
- les composants qualite consomment `/quality/*`, famille actuellement legacy cote backend ;
- le client SWAT analysis consomme `/swat/analysis/compare`, alors que le backend doit etre normalise sur ce prefixe avant d'etre considere stable.

## 6. Statut reel des lots

Taxonomie de statut appliquee : `SYNCED`, `SYNCED_WITH_QA_FLAGS`, `BLOCKED_BY_BUSINESS`, `BLOCKED_BY_MAPPING`, `BLOCKED_BY_INFRA`, `LEGACY_COMPAT_REQUIRED`, `READY_FOR_INGESTION`, `DO_NOT_INGEST`, `ARCHIVED`.

| Lot | Statut reel au 2026-04-17 | TYPE_DE_QA_FLAG | PRIORITE | ACTION_REQUISE | Justification technique courte | Preuve | Dependances restantes | Condition pour passer au statut suivant |
|---|---|---|---|---|---|---|---|---|
| Lot 1 Barrages | `SYNCED` | `N/A` | `MINEURE` | `Data` : cloturer formellement le lot et conserver la trace des exceptions | audits, mapping et dry-run alignes avec `infra.barrages` ; aucun ecart bloquant residuel constate | `12_lot1_*`, `14_lot1_*` | maintien de la trace des exceptions et validation formelle de cloture | passer a `ARCHIVED` apres cloture projet ou gel documentaire explicite |
| Lot 2 Stations | `SYNCED` | `N/A` | `MINEURE` | `Data` : valider la cloture documentaire des dependances aval | referentiels consolides, documentation et dry-run convergents sur le pivot stations | `12_lot2_*`, `14_lot2_*` | validation finale des dependances aval uniquement | passer a `ARCHIVED` apres cloture projet ou gel documentaire explicite |
| Lot 3A Hydro | `SYNCED_WITH_QA_FLAGS` | `NEGATIVE_VALUE` (1931 lignes), `FORMAT_ERROR` (19316 mensuels avant correctif de mois) | `MAJEURE` | `Data` : traiter les flags ; `Backend` : garantir le parsing mensuel et le filtrage analytique dans les modules hydro/observatory | convergence obtenue mais conditionnee par le correctif mensuel et le filtrage analytique des valeurs anormales | `12_lot3a_*`, `14_lot3a_*`, `14_lot3a2_*` | filtrage analytique des debits negatifs et formalisation des regles QA mensuelles | passer a `SYNCED` lorsque les QA flags mensuels sont traites et valides |
| Lot 3B Meteo | `SYNCED` | `N/A` | `MINEURE` | `Data` : maintenir les controles QA documentes | chroniques journalieres synchronisees avec regles de gestion des vides et du QA deja documentees | `12_lot3b_*`, `14_lot3b_*` | maintien des regles de controle sur vides et QA | passer a `ARCHIVED` apres cloture projet ou gel documentaire explicite |
| Lot 4A-1 Dictionnaire qualite | `BLOCKED_BY_MAPPING` | `N/A` | `MAJEURE` | `Metier` : arbitrer les alias ; `Data` : figer le mapping parametrique final | le socle dictionnaire reste bloque par 9 groupes d'alias a arbitrer, impactant deja 3751 lignes gelees en aval sur le lot 4A-2 | `12_lot4a1b_*`, `16_*`, `17_*` | arbitrages sur 9 groupes d'alias ambigus et validation du mapping parametrique final | passer a `READY_FOR_INGESTION` lorsque le dictionnaire de mapping est fige et valide |
| Lot 4A-2 Rivieres / nappes | `SYNCED_WITH_QA_FLAGS` | `NEGATIVE_VALUE` (2 lignes), `PARAM_UNMAPPED` (3751 lignes) | `MAJEURE` | `Data` : traiter les 27 mutations ; `Metier` : valider ou resorber les 3751 cas `PARAM_UNMAPPED` | dry-run abouti mais presence de mutations residuelles et de `qa_flag_param_unmapped` encore assumes en QA | `12_lot4a_qualite_*`, `14_lot4a2_*` | traitement des 27 mutations restantes et resolution des flags parametres non mappes | passer a `SYNCED` lorsque les flags QA sont leves ou explicitement acceptes |
| Lot 4A-3 Barrages / Garde | `BLOCKED_BY_BUSINESS` | `PARAM_UNMAPPED` (251 lignes), `STATION_INFERRED` (3515 lignes sur Garde Sebou) | `CRITIQUE` | `Metier` : trancher l'overwrite ; `Data` : preparer l'application ou l'abandon des 609 updates ; `Backend` : conserver la compatibilite analytique tant que la decision n'est pas prise | la chaine technique existe mais la decision metier d'overwrite des 609 updates n'est pas tranchee | `12_lot4a3_*`, `14_lot4a3_*` | arbitrage metier sur la politique d'overwrite des 609 updates et validation associee | passer a `READY_FOR_INGESTION` lorsque la regle metier de mise a jour est approuvee |
| Lot 4A-4 IDP | `BLOCKED_BY_INFRA` | `NULL_VALUE`, `MISSING_SOURCE`, `ORPHAN_INFRA_REJET_REFERENCE` | `CRITIQUE` | `Client` : decider la topographie cible ; `SIG` : definir le support geospatial ; `Data` : formaliser la cle de fusion ; `Backend` : preparer la chaine d'ingestion et d'exposition IDP | audit disponible mais impossibilite de lancer un dry-run final tant que 2 decisions d'infrastructure logique ne sont pas stabilisees sur 8508 mesures qualite et 391 lignes source pollution | `12_lot4a4_*`, `18_*`, `19_*` | topographie des rejets, logique de fusion 2024 et preconditions d'execution du dry-run final | passer a `READY_FOR_INGESTION` lorsque l'infrastructure logique de rejet est stabilisee et le dry-run final executable |

### ETAT GLOBAL PROJET

| Statut | Nombre de lots |
|---|---:|
| `SYNCED` | 3 |
| `SYNCED_WITH_QA_FLAGS` | 2 |
| `BLOCKED_BY_BUSINESS` | 1 |
| `BLOCKED_BY_MAPPING` | 1 |
| `BLOCKED_BY_INFRA` | 1 |
| `LEGACY_COMPAT_REQUIRED` | 0 |
| `READY_FOR_INGESTION` | 0 |
| `DO_NOT_INGEST` | 0 |
| `ARCHIVED` | 0 |

### LIEN AVEC AUDIT TECHNIQUE

| Anomalie technique | Lots impactes | PRIORITE | ACTION_REQUISE | Modules backend impactes | Quantification ou statut | Source |
|---|---|---|---|---|---|---|
| `FORMAT_ERROR` | Lot 3A | `MAJEURE` | `Data` : normaliser les mois source ; `Backend` : securiser le parsing et la consommation mensuelle | `backend/app/routers/hydro.py`, `backend/app/routers/observatory.py` | 19316 conflits mensuels avant correctif de parsing des mois (`Janvier`, `Fevrier`, `Aout`, etc.) | `12_lot3a2_mensuels_debug.md`, `14_lot3a_debits_dry_run_resultats.md` |
| `NON_NUMERIC` | Lots 4A-2, 4A-3, 4A-4 sous surveillance technique | `MAJEURE` | `Data` : qualifier les valeurs litigieuses ; `Backend` : brancher le controle dans la validation d'ingestion et les routeurs qualite | `backend/app/routers/quality.py`, `backend/app/routers/ingestion.py`, `backend/app/services/ingestion_structural_validation.py` | non quantifie dans les documents de lot actifs ; controle prevu par `lot4a5_total_technical_auditor.py` sur les flux qualite et IDP | `backend/scripts/lot4a5_total_technical_auditor.py` |
| `NULL` | Lots 3A, 4A-2, 4A-3, 4A-4 | `MAJEURE` | `Data` : confirmer les regles `WOULD_SKIP` ; `Backend` : proteger les agrégations et l'exposition API | `backend/app/routers/hydro.py`, `backend/app/routers/quality.py`, `backend/app/routers/ingestion.py`, `backend/app/routers/observatory.py` | Lot 3A : regle `WOULD_SKIP` sur `valeur_m3s` null ; Lot 4A-2 / 4A-3 : 3579 lignes NULL detectees a l'audit qualite ; Lot 4A-4 : 11 NULL sur `mesures_idp_2024_qualite_marche_cadre`, `parametre` NULL a 45.68% sur `src_pollution_globale` et a 100% sur `src_pollution_marche_cadre` | `12_lot3a_debits_audit_ab.md`, `12_lot4a_qualite_audit_ab.md`, `12_lot4a3_barrages_audit_ab.md`, `06_audit_idp_qualite.md`, `12_lot4a4_idp_audit_ab.md` |
| `ORPHAN` | Lots 4A-3, 4A-4 | `CRITIQUE` | `SIG` : stabiliser le support topographique ; `Data` : fiabiliser le rattachement ; `Backend` : maintenir des garde-fous de reference | `backend/app/routers/quality.py`, `backend/app/routers/layers.py`, `backend/app/routers/ingestion.py`, `backend/app/routers/entities.py` | Lot 4A-3 : 7094 releves sans `ire_station` resolus par `qa_flag_station_infered=TRUE` ; Lot 4A-4 : risque de 100% de `WOULD_CONFLICT` si la hierarchie `source_pollution_prelevement` / `infra.rejet_*` n'est pas stabilisee | `12_lot4a_qualite_audit_ab.md`, `14_lot4a3_barrages_dry_run_resultats.md`, `19_synthese_interne_idp.md` |

### Lot 4A-3 - DECISION REQUISE

- Valider ou refuser la politique d'overwrite des `609` mutations `WOULD_UPDATE` sur `mesures_qualite_barrages`.
- Statuer explicitement sur le traitement metier des `251` lignes `PARAM_UNMAPPED` encore hors analytique.

### Lot 4A-3 - IMPACT SI NON TRAITE

- le lot reste bloque en `BLOCKED_BY_BUSINESS` malgre une chaine technique operationnelle ;
- les `609` mutations ne peuvent pas etre appliquees ni archivees comme ecarts assumes ;
- `251` lignes restent exclues de l'analytique, et `3515` lignes Garde Sebou continuent de dependre d'une inference station fixe.

### Lot 4A-4 - DECISION REQUISE

- Trancher les 2 decisions structurantes ouvertes :
  1. les points de prelevement IDP existent-ils deja dans `infra.rejet_*` ou faut-il les creer ;
  2. les 4 tables 2024 (`globale` vs `marche_cadre`, qualite vs source pollution) sont-elles a fusionner, dedoublonner ou conserver comme couches distinctes.
- PRIORITE : `CRITIQUE`.
- ACTION_REQUISE : `Client` + `SIG` + `Data` doivent fixer la topographie cible, la cle de fusion et la strategie de dedoublonnage avant tout dry-run.
- Detail des `5618` conflits IDP :
  - `3067` conflits de doublons metier sur `mesures_idp_2024_qualite_globale` pour la cle (`code_commune`, `date_jr_prelevement`, `parametre_qualite`)
  - `2297` conflits de doublons metier sur `mesures_idp_2024_qualite_marche_cadre` pour la meme cle
  - `139` conflits de doublons metier sur `mesures_idp_2024_src_pollution_globale` pour la cle (`code_commune`, `date_jr_prelevement`, `parametre`)
  - `115` conflits de doublons metier sur `mesures_idp_2024_src_pollution_marche_cadre` pour la meme cle
  - soit `5618` anomalies de duplication/fragmentation semantique a resoudre avant ingestion fiable

### Lot 4A-4 - IMPACT SI NON TRAITE

- le dry-run final reste impossible sur `8508` mesures qualite IDP et `391` lignes source pollution ;
- le rattachement topographique de `434` rejets infra existants ne peut pas etre fiabilise ;
- le flux conserve un risque de `WOULD_CONFLICT` massif par identite spatiale orpheline et de duplication semantique sur `5618` conflits metier detectes dans l'audit IDP 2024.

### RISQUES PROJET

| Risque | PRIORITE | Impact | Action requise |
|---|---|---|---|
| Blocage IDP Lot 4A-4 non tranche | `CRITIQUE` | empeche tout dry-run final et toute fiabilisation du flux pollution ponctuelle | `Client` + `SIG` + `Data` : trancher la topographie cible, la cle de fusion et la logique de dedoublonnage |
| Arbitrage metier absent sur Lot 4A-3 | `CRITIQUE` | bloque l'application ou l'abandon de `609` updates et laisse `251` lignes hors analytique | `Metier` + `Data` : valider la politique d'overwrite et le traitement des `PARAM_UNMAPPED` |
| Dette backend legacy sur references absentes | `MAJEURE` | maintient un risque de divergence entre documentation, DB reelle et API exposee | `Backend` + `Data` : purger les references `public.*`, fiabiliser les routeurs `quality`, `entities`, `stations`, `measurements` |

## 7. Blocages actuels

### Metier / client

- arbitrage chimique sur `H_G`, `sat`, `PTD`, `PTP`, `RS105`, `RS185`, `F_M_mes`, `IP(mgO2/l)` ;
- decision client sur la topographie / creation des rejets IDP ;
- decision client sur la fragmentation IDP 2024 (`globale` vs `marche cadre`).

### Interne technique

- politique d'overwrite a figer pour les `609` updates barrages ;
- normalisation des segments backend encore relies a `public.*` absent ;
- normalisation du prefixe SWAT analysis ;
- unification de la configuration frontend backend (`8000` vs `8011`).

## 8. Pipeline SAD Sebou - Gouvernance scientifique, Model Build et IA

### Vision cible

Le projet SAD Sebou evolue vers une plateforme hydro-spatio-temporelle gouvernee, reproductible, QA-first, ML-ready, Graph-ready et compatible avec un futur jumeau numerique hydro-environnemental.

### Architecture cible du pipeline

```text
SOURCES BRUTES
    ↓
RAW / STAGING
    ↓
CANONICAL REFERENCE
    ↓
MODEL BUILD LAYER
    ↓
QA + LINEAGE + CERTIFICATION
    ↓
FEATURE STORE
    ↓
TRAINING DATASETS
    ↓
ML / Forecasting / Surrogate
    ↓
Future Graph AI / Hybrid GNN+LSTM
```

### Statut des phases de preparation

| Phase | Statut | Document principal | Role |
|---|---|---|---|
| Phase 0 - Audit et etat des lieux | `COMPLETED` | audit en conversation + dossier cible a formaliser | audit documentaire, DB, spatial, temporel, modeles, IA readiness |
| Phase A - Data Governance Foundation | `READY` | `docs/102_preparation_model_build_feature_store/01_data_governance_foundation.md` | canonical reference, temporal policy, data origin, dataset contracts, unit policy, validation authority |
| Phase B - Model Build Specification | `READY` | `docs/102_preparation_model_build_feature_store/06_model_build_specification.md` | couche `model_build`, scenarios, runs, parameter sets, contract bindings |
| Phase C - Feature Store Specification | `READY` | `docs/102_preparation_model_build_feature_store/07_feature_store_specification.md` | features, anti-leakage, freshness, training windows, drift |
| Phase D - QA & Lineage Framework | `READY` | `docs/102_preparation_model_build_feature_store/08_qa_validation_framework.md` | QA rules, blocking, quarantine, certification, reproducibility, lineage |
| Phase D.1 - Graph Ready Integration | `GRAPH_READY_PREPARED` | `docs/102_preparation_model_build_feature_store/13_graph_governance.md`, `14_graph_model_build.md`, `15_graph_feature_store.md` | graph governance, topology QA, graph snapshots, graph windows |
| Phase E - Pre-ML Readiness & First ML Pilot | `PREPARED` | `docs/102_preparation_model_build_feature_store/09_pre_ml_readiness.md` | pipeline ML controle, XGBoost/LightGBM baseline, readiness scoring |
| Phase E1 - First Real ML Sandbox Execution | `SANDBOX_BASELINE_EXECUTED` | `docs/102_preparation_model_build_feature_store/10_ml_sandbox_execution_governance.md` | experimentation gouvernee, freeze minimal, baseline persistence exécutée, feedback D.1 |

### Resultat de la Phase 0

| Domaine | Etat |
|---|---|
| Hydro | fort potentiel |
| Meteo | fort potentiel |
| Reseau hydro | bon, mais direction hydraulique non validee scientifiquement |
| SWAT legacy | exploitable en sandbox, non officiel |
| WASP legacy | exploitable en sandbox, non officiel |
| QA spatial | partiellement bloquant |
| IA readiness | `IN_PROGRESS` |

### Fondations de gouvernance preparees

| Composant | Objectif | Statut |
|---|---|---|
| Canonical Reference | IDs stables, mappings multi-modeles, compatibilite SWAT/WASP/Graph | `SPECIFIED` |
| Temporal Policy | `as_of_date`, `target_date`, horizon, availability, freshness, anti-leakage | `SPECIFIED` |
| Data Origin Policy | separer `observed`, `modeled`, `interpolated`, `corrected`, `expert_estimated`, `legacy_modeling` | `SPECIFIED` |
| Feature Registry | gouverner features, lineage, QA, leakage, freshness, reproductibilite | `SPECIFIED` |
| Dataset Contracts | colonnes obligatoires, unites, QA minimum, regles physiques, temporal policy | `SPECIFIED` |
| Unit Policy | unites, conversions, plages physiques, familles dimensionnelles | `SPECIFIED` |
| Validation Authority | qui valide quoi aux niveaux technique, scientifique, metier et DG | `SPECIFIED` |

### Model Build cible

Objets conceptuels prepares :

- core entities : `build_catchments`, `build_reaches`, `build_hrus` ;
- time series : `build_hydro_series`, `build_meteo_series`, `build_quality_series`, `build_pollution_series` ;
- scenarios : `build_scenarios`, `build_scenario_versions` ;
- runs : `build_model_runs`, `build_run_artifacts` ;
- QA : `build_geometry_status`, `build_quality_flags`, `build_lineage`.

Regle critique : les outputs SWAT/WASP actuels restent `LEGACY_MODELING_TO_REPLACE` tant que Reda et Anas ne les ont pas valides. Ils peuvent servir a des tests sandbox, pas a des runs officiels.

### Feature Store cible

Objets conceptuels prepares :

- daily features : `fs_hydro_daily`, `fs_meteo_daily`, `fs_quality_daily` ;
- spatial features : `fs_reach_features`, `fs_catchment_features` ;
- events : `fs_pollution_events`, `fs_event_features` ;
- training : `fs_training_windows`, `fs_training_datasets` ;
- gouvernance : `fs_feature_registry_bindings`, `fs_feature_quality`, `fs_feature_lineage`, `fs_feature_drift`.

Regles critiques :

- toutes les features temporelles doivent respecter `as_of_date` ;
- `data_available_at` prime sur `event_time` si la disponibilite est retardee ;
- les donnees qualite sparse doivent porter `freshness_class` et `freshness_weight` ;
- aucune feature spatiale ne peut etre `ACTIVE` sans validation SIG/QA ;
- aucune feature legacy SWAT/WASP ne peut etre officialisee sans validation Reda/Anas.

### QA, lineage et certification

Registres conceptuels prepares :

- QA : `qa_rule_registry`, `qa_validation_results`, `qa_data_anomalies` ;
- blocking : `qa_blocking_registry`, `qa_quarantine_registry` ;
- drift : `qa_drift_monitoring` ;
- certification : `qa_certification_registry` ;
- reproductibilite : `qa_reproducibility_registry` ;
- lineage : `qa_lineage_registry` ;
- publication : `qa_dataset_publication_registry`.

Niveaux structurants :

| Famille | Valeurs |
|---|---|
| QA blocking | `INFO`, `WARNING`, `BLOCKING`, `CRITICAL` |
| Certification scope | `SANDBOX_ONLY`, `SCIENTIFIC_USE`, `DECISION_SUPPORT`, `OFFICIAL_REPORTING` |
| Reproducibility level | `NONE`, `PARTIAL`, `CONTROLLED`, `SCIENTIFIC_GRADE` |

### Graph-ready integration

La preparation Graph AI reste conceptuelle. Aucun GNN ou tenseur de propagation officiel ne doit etre produit tant que la topologie et la direction hydraulique ne sont pas validees.

Objets a formaliser plus tard :

- `graph_entity_types` ;
- `graph_relationship_types` ;
- `graph_semantic_rules` ;
- `graph_snapshot_id`, `graph_version`, `topology_hash` ;
- `fs_graph_training_windows`.

Roadmap Graph :

| Horizon | Objectif |
|---|---|
| court terme | graph governance, topology QA, graph features SQL |
| moyen terme | XGBoost spatial, LSTM hydro |
| long terme | GNN, Hybrid Graph+LSTM, causal propagation AI |

### Etat actuel et dependances critiques

| Domaine | Etat |
|---|---|
| Governance | avancee |
| Temporal governance | avancee |
| QA | avancee |
| Model Build | specifie |
| Feature Store | specifie |
| Graph readiness | preparation avancee |
| SWAT industrialisation | en cours, depend Reda |
| WASP industrialisation | en cours, depend Anas |
| ML readiness | bonne |
| Deep Learning readiness | limitee |
| Graph AI readiness | preparation |

Dependances ouvertes :

- SIG/QA : doublons spatiaux, orphelins, topology validation ;
- Reda : validation SWAT, mappings, calibration, unites, runs officiels ;
- Anas : validation WASP, segments, unites, scenarios, surrogate ;
- DG / ABH : certification officielle, publication, reporting.

### Phase E1 - experimentation gouvernee

La phase `PHASE E - PRE-ML READINESS & FIRST ML PILOT` est preparee. Le chantier actif devient `PHASE E1 - FIRST REAL ML SANDBOX EXECUTION`.

Objectif : lancer un premier pipeline ML hydro sandbox pour observer le comportement reel du pipeline, sans produire de modele scientifique ou officiel.

Livrables :

- `docs/102_preparation_model_build_feature_store/09_pre_ml_readiness.md` ;
- `docs/102_preparation_model_build_feature_store/10_ml_sandbox_execution_governance.md` ;
- `sandbox/ml_hydro_baseline/`.

Regles E1 :

- `RUN FIRST BUT TRACE EVERYTHING` ;
- outputs `ML_SANDBOX_ONLY` ;
- freeze minimal obligatoire : dataset hash, feature list hash, split config hash, model config hash, seed, cutoff, run id ;
- split temporel strict, random split interdit ;
- overwrite de run interdit ;
- aucun reporting DG ou metier ;
- aucun GNN, embedding graph ou propagation officielle ;
- outputs SWAT/WASP legacy interdits comme verite officielle.

E1 alimente D.1 via `ML_TO_GRAPH_FEEDBACK` : leakage suspect, feature graph dominante, upstream lag incoherent, station dominante, feature instable ou reach orphelin suspect doivent devenir des observations QA/Graph, pas des corrections automatiques.

E1.1 execute le premier run réel sandbox `run_20260522_143742_hydro_ml_baseline_v0_sandbox` sur le dataset `hydro_ml_baseline_v0_sandbox_20260522_122901.csv`. Le run est strictement `ML_SANDBOX_ONLY`. Seule la baseline persistence a été exécutée, car XGBoost, LightGBM et scikit-learn ne sont pas disponibles dans l'environnement courant et numpy/pandas sont instables à l'import.

## 9. Usage

Avant toute decision :

1. verifier ce document ;
2. verifier le document maitre du domaine ;
3. si un ecart subsiste, verifier la base ou le code ;
4. corriger ensuite `SOURCE_OF_TRUTH.md`, `DOCUMENT_MAP.md` et les resumes IA.

## 10. Réorganisation documentaire consolidée - 2026-05-22

Un audit documentaire et BD read-only a été produit dans `docs/90_reorganisation_documentaire_finale/`.

| Indicateur | Valeur |
|---|---:|
| Documents analysés | 2144 |
| Fichiers code/config analysés | 524 |
| Objets tables/vues inspectés | 339 |
| Vues matérialisées inspectées | 31 |
| Colonnes inspectées | 4554 |
| Fichiers historiques racine déplacés | 50 |
| Références mises à jour pendant le lot A | 216 |

La source de vérité consolidée est désormais `docs/00_source_of_truth/01_source_of_truth_consolidee.md`.

Règles :

- les dossiers historiques ne sont pas supprimés ;
- les dossiers historiques complets ne sont déplacés qu'après validation des liens croisés ;
- les objets documentés mais absents de la BD réelle doivent être classés `legacy`, `proposé`, `historique` ou `contradiction` ;
- les références `public.*` hors archive doivent être considérées comme dette legacy jusqu'à preuve contraire.
