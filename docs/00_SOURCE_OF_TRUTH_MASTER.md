# SOURCE_OF_TRUTH_MASTER

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Perimetre | vue consolidee et verifiee du projet WQDSS : architecture, DB, API, frontend, lots et blocages |
| Source de verite | Oui |
| Documents lies | [SOURCE_OF_TRUTH](./01_project_reference/SOURCE_OF_TRUTH.md), [DOCUMENT_MAP](./01_project_reference/DOCUMENT_MAP.md), [30_audit_incoherences_global](./12_historique_et_archives/root_legacy/30_audit_incoherences_global.md) |
| Derniere mise a jour | 2026-06-04 |

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
- contrats d'integration futurs SWAT/WASP et consommation sandbox legacy ;
- couches SIG et configuration de couches ;
- data viewer CRUD generique ;
- scenarios et resultats WASP/SWAT.

## 3. Base reelle `abh_sad`

### Schemas applicatifs verifies le 2026-06-04

| Schema | Tables | Vues | Vues materialisees |
|---|---:|---:|---:|
| `admin` | 5 | 0 | 0 |
| `analytics` | 0 | 0 | 3 |
| `api` | 0 | 52 | 25 |
| `audit` | 17 | 0 | 0 |
| `geo` | 18 | 2 | 0 |
| `geo_work` | 26 | 1 | 0 |
| `hydro` | 8 | 0 | 0 |
| `infra` | 22 | 0 | 0 |
| `metadata` | 52 | 2 | 3 |
| `meteo` | 5 | 0 | 0 |
| `modeles` | 3 | 0 | 0 |
| `monitoring` | 3 | 0 | 0 |
| `public` | 1 | 4 | 0 |
| `qa` | 9 | 0 | 0 |
| `qa_dry_run` | 7 | 0 | 0 |
| `qualite` | 9 | 0 | 0 |
| `security` | 11 | 0 | 0 |
| `staging` | 51 | 1 | 0 |
| `swat_output` | 8 | 0 | 0 |
| `swat_sebou` | 4 | 0 | 0 |
| `wasp_output` | 5 | 0 | 0 |
| `wasp_sebou` | 3 | 0 | 0 |

### Cardinalites de reference

| Objet | Cardinalite exacte |
|---|---:|
| `infra.stations_mesure` | 390 |
| `infra.barrages` | 33 |
| `hydro.mesure_debit` | 652446 |
| `hydro.mesure_debit_mensuel` | 19316 |
| `hydro.mesure_barrage_param` | 272652 |
| `meteo.mesure_precipitation` | 546007 |
| `meteo.mesure_evaporation` | 48900 |
| `meteo.mesure_temperature` | 437889 |
| `qualite.mesure_qualite_riviere` | 59534 |
| `qualite.mesure_qualite_nappe` | 63047 |
| `qualite.mesure_qualite_barrage` | 7820 |
| `qualite.mesure_qualite_sebou` | 49954 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 1780 |
| `qualite.source_pollution_prelevement` | 141 |
| `qualite.source_pollution_mesure_param` | 7191 |
| `geo.ref_site_pollution` | 2026 |
| `security.activity_logs` | 87346 |
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
| SWAT / WASP | `/api/v1/swat/*` | sandbox legacy / non decisionnel |
| Ingestion | `/api/v1/ingestion/*` | stable |

### Zones API a risque

- le routeur principal monte (`backend/app/api/api_v1.py`) n'expose pas de dependance runtime critique a `public.*` ;
- plusieurs routeurs legacy non montes dans `backend/app/routers/*` ciblent encore `public.*` et doivent etre purges ;
- `app.api.v1.stations` et `app.api.v1.measurements` resolvent maintenant `api.v_station_dimension`, `hydro.mesure_debit`, `meteo.mesure_temperature` et `qualite.mesure_qualite_riviere`.
- `app.api.v1.swat_analysis.py` reste optionnel via `SAD_ENABLE_SWAT_ANALYSIS` et ne fait pas partie du chemin critique court vers la preproduction.

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

- la source de verite frontend pour l'URL backend est `frontend/src/config/api.ts` ;
- la variable d'environnement cible est `VITE_API_BASE_URL` ;
- le fallback runtime unique est `http://127.0.0.1:8000/api/v1` ;
- `frontend/src/api/client.ts` et `frontend/src/lib/api.ts` sont maintenant aligns sur cette base unique ;
- les composants qualite consomment `/quality/*`, famille actuellement legacy cote backend ;
- le client SWAT analysis consomme `/swat/analysis/compare`, alors que le backend doit etre normalise sur ce prefixe avant d'etre considere stable.

## 5ter. Nouveau chantier prioritaire 2026-06-05

- le nouveau centre de gravite operationnel devient le `Module Administration & Ingestion Metier des Donnees` ;
- le dossier de cadrage actif est `docs/114_data_admin_ingestion/` ;
- le module doit industrialiser l'audit lecture seule, l'ingestion, les canevas, les validations, les changements controles et la preparation temps reel ;
- le `data viewer` `/data` reste un outil expert secondaire et ne doit pas etre promu comme canal officiel de modification metier ;
- l'existant reutilisable immediate est :
  - `/api/v1/admin/data-availability` ;
  - `/api/v1/ingestion/*` ;
  - `audit.ingestion_audit_logs` ;
  - les pages frontend `/admin/data-scan` et `/admin/ingestion` ;
- le module 114 doit remplacer progressivement les corrections SQL manuelles, imports non traces et scripts ponctuels par un workflow gouverne.

## 5bis. Rebaselining chemin critique 2026-06-04

Decision de gouvernance basee prioritairement sur code + BD :

- `IDP` sort du chemin critique avec statut `CLOSED_WITH_GOVERNED_BACKLOG` ;
- `SWAT` et `WASP` ne sont plus des blocages techniques internes ;
- `SWAT` et `WASP` deviennent des dependances metier externes a integrer par contrat apres validation scientifique ;
- les anciens routeurs backend cibles `public.*` non montes ont ete places en quarantaine dans `backend/app/routers_legacy_public/` ;
- le chemin critique plateforme devient :
  1. purge des dependances `public.*` encore presentes dans le code legacy ;
  2. qualification PREPROD backend/frontend/API/DB ;
  3. consolidation du referentiel reglementaire `C3` ;
  4. preparation des contrats d'integration SWAT/WASP ;
  5. preparation du socle IA/ML.

Documents de preuve associes :

- `docs/111_cloture_officielle_IDP/01_decision_cloture_IDP.md`
- `docs/112_c3_referentiel_reglementaire_final/05_decision_go_nogo_c3.md`
- `docs/113_preproduction_readiness/01_public_schema_dependency_report.md`
- `docs/113_preproduction_readiness/02_preprod_readiness_report.md`

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
| Lot 4A-4 IDP | `C1B_CLOSED__GLOBAL_RESIDUAL_OPEN` | `WAIT_SOURCE_FIX`, `DUPLICATE_EXACT`, `POSSIBLE_MATCH` | `CRITIQUE` | `Data` : separer le lot ferme du backlog global ; `Client` : corriger les sources sans geometrie ; `Backend` : maintenir l'exclusion operationnelle des objets hors perimetre | `C1-B` est cloture en DEV avec decisions chargees, sites crees et liens source -> site materialises ; le residuel global restant est soit technique, soit client, soit hors perimetre de cloture C1-B | `docs/04_etat_avancement/01_note_cloture_c1_idp_2026_06_04.md` | consolidation des doublons exacts, revue des `POSSIBLE_MATCH`, traitement client des `WAIT_SOURCE_FIX` | passer a `READY_FOR_INGESTION` lorsque le backlog global non C1-B est gouverne sans reouvrir le lot ferme |

### ETAT GLOBAL PROJET

| Statut | Nombre de lots |
|---|---:|
| `SYNCED` | 3 |
| `SYNCED_WITH_QA_FLAGS` | 2 |
| `BLOCKED_BY_BUSINESS` | 1 |
| `BLOCKED_BY_MAPPING` | 1 |
| `BLOCKED_BY_INFRA` | 0 |
| `C1B_CLOSED__GLOBAL_RESIDUAL_OPEN` | 1 |
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

- Ne pas reouvrir `C1-B`, considere clos en DEV.
- Gouverner le residuel global dans 3 chantiers distincts :
  1. `IDP_DUPLICATE_CONSOLIDATION` pour `14239` `DUPLICATE_EXACT` ;
  2. `IDP_POSSIBLE_MATCH_REVIEW` pour `124` `POSSIBLE_MATCH` ;
  3. `CLIENT_REQUIRED_DATA_FIX` pour `488` `WAIT_SOURCE_FIX` sans geometrie.
- PRIORITE : `CRITIQUE`.
- ACTION_REQUISE :
  - `Data` : isoler le backlog global du lot ferme ;
  - `Client` : corriger les objets sans geometrie ;
  - `Backend` : maintenir l'exclusion runtime des objets `WAIT_SOURCE_FIX`.
- Decision de gouvernance : le residuel global IDP ne bloque plus la preproduction du perimetre `C1-B`.

### Lot 4A-4 - IMPACT SI NON TRAITE

- le lot `C1-B` ne doit pas etre requalifie a tort comme ouvert ;
- les `14239` doublons exacts continueront de polluer les tables QA et les analyses internes ;
- les `124` `POSSIBLE_MATCH` resteront non qualifies metier ;
- les `488` `WAIT_SOURCE_FIX` resteront non arbitrables sans correction source client.

### RISQUES PROJET

| Risque | PRIORITE | Impact | Action requise |
|---|---|---|---|
| Residuel global IDP mal gouverne apres cloture C1-B | `CRITIQUE` | risque de reouvrir artificiellement un lot ferme et de contaminer les indicateurs QA/analytics | `Data` + `Backend` + `Client` : separer `C1-B` ferme du backlog `IDP_DUPLICATE_CONSOLIDATION` / `IDP_POSSIBLE_MATCH_REVIEW` / `CLIENT_REQUIRED_DATA_FIX` |
| Arbitrage metier absent sur Lot 4A-3 | `CRITIQUE` | bloque l'application ou l'abandon de `609` updates et laisse `251` lignes hors analytique | `Metier` + `Data` : valider la politique d'overwrite et le traitement des `PARAM_UNMAPPED` |
| Dette backend legacy sur references absentes | `MAJEURE` | maintient un risque de divergence entre documentation, DB reelle et API exposee | `Backend` + `Data` : purger les references `public.*`, fiabiliser les routeurs `quality`, `entities`, `stations`, `measurements` |

## 7. Blocages actuels

### Metier / client

- arbitrage chimique sur `H_G`, `sat`, `PTD`, `PTP`, `RS105`, `RS185`, `F_M_mes`, `IP(mgO2/l)` ;
- correction client des sources IDP sans geometrie (`WAIT_SOURCE_FIX`) hors chemin critique plateforme ;
- validation de la trajectoire de traitement du backlog `POSSIBLE_MATCH`.

### Interne technique

- politique d'overwrite a figer pour les `609` updates barrages ;
- purge des segments backend legacy encore relies a `public.*` absent ;
- maintien en quarantaine de `backend/app/routers_legacy_public/` tant qu'aucun audit de reactivation n'est decide ;
- stabilisation front/back PREPROD avant livraison scientifique SWAT/WASP ;
- unification de la configuration frontend backend (port `8000` normalisé, `8011` obsolète).

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
| SWAT industrialisation | dependance metier externe, depend Reda |
| WASP industrialisation | dependance metier externe, depend Anas |
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
