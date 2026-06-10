# API for Agents

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | synthèse agent de l'API FastAPI réellement observée |
| Source de vérité | Non, résumé contrôlé |
| Documents liés | [../00_SOURCE_OF_TRUTH_MASTER.md](../00_SOURCE_OF_TRUTH_MASTER.md), [../01_project_reference/backend/backend_overview.md](../01_project_reference/backend/backend_overview.md), [../01_project_reference/backend/api_contracts.md](../01_project_reference/backend/api_contracts.md) |
| Dernière mise à jour | 2026-06-05 |

## Base

- Préfixe global : `/api/v1`
- Santé service : `GET /health`
- Docs OpenAPI : `/docs`

## Groupes de routes réellement montés

### Auth

- `/api/v1/auth/*`

### Référentiels et accès station-centric

- `/api/v1/stations/*`
- `/api/v1/measurements/*`
- `/api/v1/entities/*`
- `/api/v1/names/*`
- `/api/v1/meta/*`

Attention : ces groupes existent côté montage FastAPI, mais une partie d’entre eux dépend encore de références SQL legacy ou absentes (`public.*`, `api.v_station_dimension`).

### Géospatial et couches

- `/api/v1/geojson/*`
- `/api/v1/layers/*`
- `/api/v1/layers/configs/*`

### Administration et sécurité

- `/api/v1/users/*`
- `/api/v1/security/*`
- `/api/v1/admin/data-availability/*`
- `/api/v1/admin/password-reset-requests/*`
- `/api/v1/admin/users/*`
- `/api/v1/raw/*`
- `/api/v1/data-admin/*`

### Dashboards métier

- `/api/v1/climate/*`
- `/api/v1/hydro/*`
- `/api/v1/quality/*`
- `/api/v1/dashboard/*`
- `/api/v1/kpi/*`
- `/api/v1/propagation/*`
- `/api/v1/observatory/*`
- `/api/v1/analytics/*`
- `/api/v1/alerts/*`
- `/api/v1/recommendations/*`

### Modèles et ingestion

- `/api/v1/swat/*`
- `/api/v1/ingestion/*`

## Module 114 — data-admin

Mise a jour du 2026-06-05 :

| Endpoint | Role | Statut |
|---|---|---|
| `GET /api/v1/data-admin/classes` | liste des classes enregistrees | `ACTIVE` |
| `GET /api/v1/data-admin/classes/{class_code}` | detail d'une classe | `ACTIVE` |
| `GET /api/v1/data-admin/classes/{class_code}/schema` | schema de lecture de la classe | `ACTIVE` |
| `GET /api/v1/data-admin/classes/{class_code}/count` | compteur runtime de la source | `ACTIVE` |
| `GET /api/v1/data-admin/classes/{class_code}/records` | pagination lecture seule | `ACTIVE` |
| `GET /api/v1/data-admin/classes/{class_code}/template/spec` | specification JSON du canevas metier | `ACTIVE` |
| `POST /api/v1/data-admin/classes/{class_code}/template/generate` | generation du canevas `.xlsx` ou `.csv` | `ACTIVE` |
| `POST /api/v1/data-admin/classes/{class_code}/ingestion/upload` | upload, validation et staging sans promotion | `ACTIVE_MVP2C` |
| `GET /api/v1/data-admin/ingestion/runs` | historique des runs d'ingestion | `ACTIVE_MVP2C` |
| `GET /api/v1/data-admin/ingestion/runs/{run_id}` | detail d'un run | `ACTIVE_MVP2C` |
| `GET /api/v1/data-admin/ingestion/runs/{run_id}/errors` | erreurs de validation d'un run | `ACTIVE_MVP2C` |
| `GET /api/v1/data-admin/ingestion/runs/{run_id}/staging-preview` | apercu des lignes stagees | `ACTIVE_MVP2C` |
| `GET /api/v1/data-admin/validation-rules` | inventaire global des regles dynamiques | `ACTIVE_MVP2D` |
| `GET /api/v1/data-admin/classes/{class_code}/validation-rules` | regles dynamiques appliquees par classe | `ACTIVE_MVP2D` |
| `POST /api/v1/data-admin/ingestion/runs/{run_id}/change-request` | creation d'une demande de promotion | `ACTIVE_MVP3` |
| `GET /api/v1/data-admin/change-requests` | liste des demandes de promotion | `ACTIVE_MVP3` |
| `GET /api/v1/data-admin/change-requests/{change_request_id}` | detail d'une demande | `ACTIVE_MVP3` |
| `POST /api/v1/data-admin/change-requests/{change_request_id}/submit` | soumission de la demande | `ACTIVE_MVP3` |
| `POST /api/v1/data-admin/change-requests/{change_request_id}/approve` | approbation de la demande | `ACTIVE_MVP3` |
| `POST /api/v1/data-admin/change-requests/{change_request_id}/reject` | rejet de la demande | `ACTIVE_MVP3` |
| `POST /api/v1/data-admin/change-requests/{change_request_id}/apply` | application `INSERT_ONLY` controlee | `ACTIVE_MVP3` |
| `GET /api/v1/data-admin/change-requests/{change_request_id}/audit-log` | trace create/submit/approve/apply | `ACTIVE_MVP3` |

Regles :

- aucune ecriture dans les tables metier ;
- `template/generate` ne fait que produire un fichier, sans upload ni staging ;
- `data_admin.field_registry` est la source prioritaire des champs sur les classes MVP2 ;
- l'ingestion est maintenant active pour `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE`, `INFRA_STATION`, `POLLUTION_SITE` ;
- le flux s'arrete a `upload -> validation -> staging` ;
- si une erreur bloquante existe, le run est persisté en `VALIDATION_FAILED` avec erreurs, sans insertion en staging ;
- la validation dynamique ajoute des erreurs/warnings `GEOSPATIAL`, `REFERENTIAL`, `DUPLICATE` et `TEMPORAL` dans `data_admin.ingestion_validation_error` ;
- `error_scope` permet au frontend de distinguer erreurs structurelles, métier, géospatiales, référentielles et doublons potentiels ;
- `MVP3` autorise une promotion controlee `INSERT_ONLY` pour `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE`, `INFRA_STATION`, `POLLUTION_SITE` ;
- aucune promotion automatique n'est autorisee ;
- les runs `VALIDATION_FAILED` ne peuvent jamais creer de change request ;
- les lignes `INVALID` ne deviennent jamais des `change_request_item` ;
- un warning doublon peut etre soumis et approuve, mais l'`apply` echoue proprement si la ligne existe deja en cible ;
- `MVP4` protege maintenant les routes `data-admin` par permissions reelles lues depuis `security.role_permissions` ;
- mode courant : `RBAC_REAL` ;
- roles cibles de demonstration :
  - `ROLE_DECIDEUR`
  - `ROLE_EXPERT`
  - `ROLE_CONSULTANT`
  - `ROLE_DATA_ADMIN`
  - `ROLE_SYS_ADMIN`
  - `ROLE_AI_AGENT`
- regles principales :
  - `ROLE_DECIDEUR` : lecture seulement ;
  - `ROLE_EXPERT` : approbation possible, `apply` interdit ;
  - `ROLE_CONSULTANT` : upload/create/submit sans approbation ;
  - `ROLE_DATA_ADMIN` : apply et rollback autorises ;
  - `ROLE_SYS_ADMIN` : data-admin complet + gestion utilisateurs ;
  - `ROLE_AI_AGENT` : audit/canevas/upload/soumission sans approbation ;
- les acteurs HTTP traces cote backend sont `user:{id}:{email}` ;
- erreurs de transition attendues :
  - `CHANGE_REQUEST_NOT_APPROVED`
  - `CHANGE_REQUEST_ALREADY_APPLIED`
  - `CHANGE_REQUEST_REJECTED`
  - `INVALID_CHANGE_REQUEST_TRANSITION`
- erreurs de promotion attendues :
  - `PROMOTION_INSERT_WOULD_DUPLICATE_EXISTING_ROW`
  - `PROMOTION_TARGET_TABLE_UNAVAILABLE`
  - `PROMOTION_TARGET_COLUMN_INVALID`
  - `PROMOTION_MAPPING_MISSING_COLUMN`
  - `PROMOTION_ITEM_FAILED`
  - `PROMOTION_TRANSACTION_ROLLED_BACK`
- endpoints rollback actifs :
  - `POST /api/v1/data-admin/change-requests/{change_request_id}/rollback/prepare`
  - `POST /api/v1/data-admin/change-requests/{change_request_id}/rollback/request`
  - `POST /api/v1/data-admin/change-requests/{change_request_id}/rollback/approve`
  - `POST /api/v1/data-admin/change-requests/{change_request_id}/rollback/apply`
  - `GET /api/v1/data-admin/change-requests/{change_request_id}/rollback/status`
- regles rollback :
  - `INSERT_ONLY` uniquement ;
  - `request_status` source doit etre `APPLIED` ;
  - `rollback_available = true` ;
  - `rollback_status` suit `NOT_PREPARED -> READY -> REQUESTED -> APPROVED -> APPLIED/FAILED`
- erreurs rollback attendues :
  - `ROLLBACK_NOT_AVAILABLE`
  - `ROLLBACK_NOT_APPROVED`
  - `ROLLBACK_TARGET_NOT_FOUND`
  - `ROLLBACK_TARGET_NOT_UNIQUE`
  - `ROLLBACK_ALREADY_APPLIED`
  - `ROLLBACK_REQUEST_NOT_APPLIED`
  - `ROLLBACK_TRANSACTION_FAILED`
- extension `MVP3-D` :
  - `INFRA_STATION` accepte `geom_wkt` + `srid`, transforme vers `infra.stations_mesure.geom` en `4326` ;
  - `POLLUTION_SITE` accepte `geom_wkt` + `srid`, transforme vers `geo.ref_site_pollution.geom` en `26191` et `geom_4326` en `4326` ;
  - les erreurs geospatiales attendues incluent :
    - `GEOM_WKT_VALID`
    - `GEOM_SRID_ALLOWED`
    - `GEOM_NOT_EMPTY`
    - `GEOM_WITHIN_MOROCCO_BOUNDS`
    - `POLLUTION_GEOMETRY_DUPLICATE_WARNING`
  - garde pollution :
    - `site_code LIKE 'IDP-C1B-%'` refuse
    - aucune ecriture dans `geo.ref_site_pollution_source_link`

### SWAT analysis

- routeur monté depuis `swat_analysis.py`
- risque de préfixe effectif doublé : `/api/v1/api/v1/swat/analysis/*`

## Règles d’usage pour agents

- Utiliser `backend_overview.md` et `00_SOURCE_OF_TRUTH_MASTER.md` pour la vérité de l’API réellement déployée.
- Utiliser `api_contracts.md` comme spécification cible ou backlog, pas comme photographie garantie du déployé.
- Se méfier des groupes `quality`, `stations`, `measurements` et `entities` tant que les références backend legacy `public.*` n’ont pas été purgées.
- Pour tout besoin de cartographie ou d’observatoire, privilégier d’abord les groupes `layers`, `observatory`, `analytics`, `climate`, `hydro` et `raw`, qui sont mieux alignés avec la réalité observée.
- Pour les barrages, les métriques `niveau_barrage`, `volume_barrage`, `lacher_barrage`, `apport` et `transfert` sont servies depuis `hydro.mesure_barrage_param` via les endpoints `/api/v1/observatory/barrage/*`.
- Ne jamais réinterpréter un volume journalier barrage en débit sans règle hydraulique validée; la référence métier est `Mm3/j` pour `LACHER`, `APPORT` et `TRANSFERT`.
- `apports_hm3` reste accepte comme alias API de compatibilite et se resout vers `APPORT`.
- `lacher_m3s` est un alias legacy rejete et ne doit pas etre utilise comme contrat metier API/dashboard.

## Vues SQL specialisees disponibles

Mise a jour du 2026-05-13 : des vues SQL specialisees existent dans le schema `api`, mais les endpoints FastAPI dedies restent en statut `HOLD`.

| Famille | Vues sources candidates | Statut API |
|---|---|---|
| Meteo | `api.v_meteo_temperature`, `api.v_meteo_precipitation`, `api.v_meteo_evaporation` | `HOLD_IMPLEMENTATION` |
| Hydro/barrage | `api.v_barrage_parametres`, `api.v_barrage_qualite` | `HOLD_IMPLEMENTATION` |
| Qualite eau | `api.v_qualite_physicochimie`, `api.v_qualite_chimie_minerale`, `api.v_qualite_metaux`, `api.v_qualite_pollution_organique`, `api.v_qualite_microbiologie`, `api.v_qualite_biologique`, `api.v_qualite_terrain`, `api.v_qualite_contexte_station`, `api.v_qualite_organoleptique` | `HOLD_IMPLEMENTATION` |
| Pollution/IDP | `api.v_pollution_constat_prealable`, `api.v_pollution_analyses_finales`, `api.v_idp_points`, `api.v_idp_points_non_resolus` | `HOLD_IMPLEMENTATION` |

Regles pour agents :

- Ne pas supposer que ces vues sont deja exposees par FastAPI.
- Ne pas utiliser `api.v_qualite_dashboard_global` comme source primaire ; les vues specialisees sont les sources metier.
- Ne pas exposer `FM` et `F_M_MES`.
- Preserver la distinction `MO` = matieres organiques et `Mo` = molybdene.
- API FastAPI = `P0_QUALITE_SPECIALISE_READY`, Frontend = `HOLD`, Ingestion V1 = `GO_CONCEPTION`.

## Endpoints specialises P0 disponibles

Mise a jour du 2026-05-13 : un premier router specialise lecture seule est ajoute sous `/api/v1/qualite`, en coexistence avec le router legacy `/api/v1/quality`.

| Endpoint | Vue SQL source | Statut |
|---|---|---|
| `GET /api/v1/qualite/metaux` | `api.v_qualite_metaux` | `BACKEND_P0_READY` |
| `GET /api/v1/qualite/chimie-minerale` | `api.v_qualite_chimie_minerale` | `BACKEND_P0_READY` |
| `GET /api/v1/qualite/physicochimie` | `api.v_qualite_physicochimie` | `BACKEND_P0_READY` |
| `GET /api/v1/qualite/pollution-organique` | `api.v_qualite_pollution_organique` | `BACKEND_P0_READY` |

Format reponse :

- `status`
- `count`
- `filters`
- `data`
- `metadata`

Filtres supportes : `date_start`, `date_end`, `support_type`, `support_id`, `code_parametre`, `qa_status`, `geo_status`, `limit`, `offset`, `include_geom`.

Controle P0 :

- `FM`, `F_M_MES`, `MO_METAL` exclus.
- `Mo` expose dans les metaux.
- `MO` expose dans la pollution organique.
- `MO` et `Mo` restent distincts.

## Runtime FastAPI stabilise avec modules scientifiques optionnels

Mise a jour du 2026-05-13 :

- `app.main` demarre avec `SWAT analysis` et `Ingestion API` desactives par defaut.
- `/health`, `/docs` et `/openapi.json` sont disponibles.
- `/api/v1/swat/analysis/*` est optionnel via `SAD_ENABLE_SWAT_ANALYSIS=true`.
- `/api/v1/ingestion/*` est optionnel via `SAD_ENABLE_INGESTION_API=true`.
- Cette protection evite qu'un crash natif `numpy` / BLAS / `pandas` bloque toute l'application.

Statuts :

| Module | Statut |
|---|---|
| Backend global | `GO` |
| OpenAPI | `GO` |
| Qualite P0 | `READY` |
| SWAT analysis | `DISABLED_OPTIONAL` |
| Ingestion API | `DISABLED_OPTIONAL` |
| Frontend pilote Metaux | `IMPLEMENTED_BUILD_OK` |
| Frontend pilote Chimie minerale | `GO` |

## Frontend pilote Metaux

Mise a jour du 2026-05-13 : un premier ecran React pilote est ajoute sur `/qualite/metaux`.

| Element | Valeur |
|---|---|
| Route frontend | `/qualite/metaux` |
| Endpoint consomme | `GET /api/v1/qualite/metaux` |
| Client frontend | `frontend/src/api/qualite.ts` |
| Hook React Query | `frontend/src/hooks/useQualiteMetaux.ts` |
| Page | `frontend/src/pages/qualite/MetauxPage.tsx` |
| Statut build | `OK` |

Regles :

- Le pilote ne consomme pas les routes legacy `/api/v1/quality`.
- Le pilote ne lit pas directement les tables metier.
- Les controles visuels verifient `Mo` visible, `MO` absent des metaux, `FM`, `F_M_MES` et `MO_METAL` exclus.

## Endpoints reglementaires qualite DEV

Mise a jour du 2026-05-19 : quatre endpoints reglementaires DEV sont ajoutes au router legacy `/api/v1/quality`, en lecture seule sur les tables `metadata.qualite_*_reglementaire`.

| Endpoint | Role | Statut |
|---|---|---|
| `GET /api/v1/quality/thresholds` | Liste des seuils reglementaires actifs ou complets | `DEV_READY` |
| `POST /api/v1/quality/classify` | Classification d'une mesure par seuil Tableau n°1 | `DEV_READY` |
| `POST /api/v1/quality/global-index` | Qualite globale par parametre le plus penalisant | `DEV_READY` |
| `GET /api/v1/quality/regulatory-status` | Couverture referentiel, mappings et vrais absents canonique | `DEV_READY` |

Regles implementees :

- source operationnelle : Tableau n°1 uniquement ;
- grilles simplifiees : `DOCUMENTAIRE_NON_OPERATIONNEL` ;
- metaux : unite source `µg/l`, unite moteur `mg/L`, facteur 0.001 si necessaire ;
- microbiologie : `/100ml` equivalent operationnel a `UFC/100 mL` ;
- `DBO5`/`DCO` : `mgO2/l` equivalent operationnel a `mg/L` ;
- `NO3` alias reglementaire vers canonique `NO3-` ;
- `O2_DISSOUS` alias reglementaire vers canonique `O2_DISS` ;
- `Hg` : regle specifique chargee via les seuils actifs ;
- vrais absents canonique : statut non classifiable.

Attention : ces endpoints dependent du chargement de la version reglementaire active. Si les tables sont vides, ils retournent `NO_ACTIVE_REGULATORY_VERSION` ou `NON_CLASSABLE_REFERENTIEL_ABSENT`.

## Observatoire V2

Mise a jour du 2026-05-13 : `Dashboard2` dispose d'un panneau `Observatoire V2` base sur un catalogue frontend local.

Regles API :

- Aucun chargement de valeurs a l'ouverture du menu.
- Appel API uniquement apres selection famille + parametre + clic `Afficher`.
- Familles actives : `metaux`, `chimie-minerale`, `physicochimie`, `pollution-organique`.
- Source API exclusive : endpoints specialises `/api/v1/qualite/*`.
- Familles sans endpoint : `a venir`, sans appel reseau.

## Dashboard pollution — Contrat runtime hydrologique

Mise a jour du 2026-05-14 :

- `GET /api/v1/routing/downstream-to-garde` reste un routage topologique visuel, pas un moteur hydraulique scientifique.
- Le runtime consomme `geo_work.reseau_hydro_edges_final` et `geo_work.reseau_hydro_edges_final_vertices_pgr` via `TopologyRuntimeConfig`.
- Les reponses exposent `routing_quality`, `direction_validated`, `hydraulic_direction_validated`, `used_fallback`, `scientific_mode`, `network_component`, `topology_status` et `runtime_contract`.
- `direction_validated=false` et `hydraulic_direction_validated=false` en Phase E.
- Le fallback non oriente reste autorise pour la continuite visuelle, mais doit etre affiche comme `used_fallback=true`.
- Les ETA, scores et impacts stations/barrages restent non scientifiques.

## MVP propagation pollution

Mise à jour du 2026-06-02 :

| Endpoint | Rôle | Statut |
|---|---|---|
| `GET /api/v1/propagation/source-to-garde` | propagation topologique MVP d'une source vers la garde | `DEV_READY_MVP` |
| `GET /api/v1/propagation/snap-diagnostic` | diagnostic pur de snap d'une source sur le réseau validé | `DEV_READY_MVP` |
| `GET /api/v1/propagation/source-to-stations` | propagation topologique MVP d'une source vers des stations | `DEV_READY_MVP` |
| `GET /api/v1/propagation/source-to-barrages` | propagation topologique MVP d'une source vers des barrages | `DEV_READY_MVP` |
| `GET /api/v1/propagation/source-to-exutoires` | propagation topologique MVP d'une source vers des exutoires | `DEV_READY_MVP` |

Règles :

- un seul mode d'entrée autorisé : `site_id`, `prelevement_id` ou `lng+lat` ;
- le diagnostic de snap est toujours renvoyé ;
- `snap_confidence` : `HIGH <= 50 m`, `MEDIUM <= 250 m`, `LOW > 250 m` ;
- `transfer_time_hours` est un temps indicatif calculé à vitesse constante ;
- `metadata.scientific_mode=false` tant que SWAT/WASP ne sont pas intégrés ;
- le service lit le réseau validé `geo_work.reseau_hydro_edges_final_candidate_20260602`, pas encore le runtime officiel promu.
- `source-to-stations` lit les cibles depuis `api.v_station_dimension` et expose un diagnostic de snap cible par station.
- `source-to-barrages` lit les cibles depuis `api.v_barrage_dimension` et conserve la séparation entre barrage géographique et garde fonctionnelle station `52`.
- `source-to-exutoires` lit les cibles depuis `geo_work.reseau_hydro_nodes_final_candidate_20260602` avec la règle `eout=0 AND ein>=1`.

## Sprint 1.5 — KPI / Alert / Recommendation Engine

Mise à jour du 2026-06-03 :

| Endpoint | Rôle | Statut |
|---|---|---|
| `GET /api/v1/kpi/overview` | KPI globaux DG `IQGB`, `IFD`, `ICD`, `ICH`, `IPP`, `ISR` | `SPRINT_1_5_READY` |
| `GET /api/v1/kpi/stations` | synthèse stations `conforme/surveillance/critique/inconnu` et top stations | `SPRINT_1_5_READY` |
| `GET /api/v1/kpi/subbasins` | synthèse de risque par sous-bassin | `SPRINT_1_5_READY` |
| `GET /api/v1/kpi/pollution` | synthèse pression pollution et top sites | `SPRINT_1_5_READY` |
| `GET /api/v1/alerts` | alertes qualité, pollution, données, hydro lecture seule | `SPRINT_1_5_READY` |
| `GET /api/v1/recommendations` | recommandations métier actionnables | `SPRINT_1_5_READY` |

Règles :

- le moteur KPI réutilise le backend qualité existant et la propagation MVP V1 déjà validée ;
- `ICH` est dérivé du réseau validé en lecture seule, sans recalcul hydraulique ;
- `IPP` reste un indice MVP topologique non scientifique ;
- `ALERT_HYDRO` reste purement informatif ;
- `AIR_TEMPERATURE` et `WATER_TEMPERATURE` ne doivent jamais être mélangées dans les futurs dashboards.

## Dashboard home V2 opérationnel

Mise à jour du 2026-06-03 :

| Endpoint | Rôle | Statut |
|---|---|---|
| `GET /api/v1/dashboard/home` | agrégateur backend du home opérationnel V2 | `BACKEND_HOME_V2_READY` |

Règles :

- le payload racine expose `status`, `generated_at`, `data_freshness`, `hero`, `map`, `basin_status`, `alerts`, `recommended_actions`, `trends`, `secondary_kpis`, `metadata` ;
- `hero.cards` contient exactement `barrages_suivis`, `donnees_pluie_disponibles`, `stations_hydro_actives`, `stations_sentinelles_qualite` ;
- les KPI DG `IQGB`, `IFD`, `ICD`, `ICH`, `IPP`, `ISR` restent dans `secondary_kpis` uniquement ;
- la pluie est exposée sous le libellé prudent `Données pluie disponibles` tant que la typologie n’est pas consolidée ;
- la qualité journalière est exposée sous le libellé `Stations sentinelles qualité` ;
- `metadata.temperature_rule = AIR_TEMPERATURE != WATER_TEMPERATURE` ;
- le service réutilise les moteurs existants KPI / alertes / recommandations et ne recalcule pas l’hydraulique.

Mise à jour du 2026-06-04 :

- `backend/app/services/dashboard/home_service.py` ajoute un cache mémoire court de payload complet ;
- variable d’environnement : `SAD_DASHBOARD_HOME_CACHE_SECONDS` ;
- valeur par défaut : `120 s`, désactivation avec `0` ;
- le contrat JSON HTTP reste inchangé ;
- le cache ne masque pas `status=partial` et n’enregistre pas d’exception.
- `app.main` lance aussi un prewarm asynchrone du cache Home au startup via `ClimateSessionLocal` pour réduire le coût du premier affichage.

## Pollution IDP DEV

Mise a jour du 2026-05-18 : un router DEV lecture seule est ajoute sous `/api/v1/pollution`.

| Endpoint | Source SQL | Statut |
|---|---|---|
| `GET /api/v1/pollution/sites.geojson` | `api.v_pollution_sites` + `api.v_pollution_latest_results` | `DEV_READY` |
| `GET /api/v1/pollution/latest-results` | `api.v_pollution_latest_results` | `DEV_READY` |

## API cartographique metier P0

Mise a jour du 2026-05-20 : un router lecture seule est ajoute sous `/api/v1/map` pour preparer le dashboard cartographique metier unifie sans modifier les dashboards existants.

| Endpoint | Role | Statut |
|---|---|---|
| `GET /api/v1/map/catalog` | catalogue métier hiérarchique groupes/supports | `DEV_READY` |
| `GET /api/v1/map/entities` | GeoJSON metier unifie par `group_code` + `support_code` ou support legacy | `DEV_READY` |
| `GET /api/v1/map/entities/{id}` | fiche entite | `DEV_READY` |
| `GET /api/v1/map/entities/{id}/parameters` | parametres disponibles, P0 IDP | `DEV_READY_PARTIAL` |
| `GET /api/v1/map/entities/{id}/timeseries` | contrat reserve series temporelles | `P1_PLACEHOLDER` |
| `GET /api/v1/map/latest-values` | dernieres valeurs, P0 IDP | `DEV_READY_PARTIAL` |
| `GET /api/v1/map/classification` | classification reglementaire unitaire | `DEV_READY` |
| `GET /api/v1/map/layers` | couches contexte MapLibre | `DEV_READY` |

Organisation métier P0 :

- `stations` : `forage`, `puits`, `point_prelevement`, `barrage`, `pluvio`, `source`, `hydro`.
- `inventaire_source_pollution` : `point_mesures`.
- `inventaire_mesures_pollution` : `point_prelevement`.

Les anciens supports `idp_pollution`, `barrages`, `stations_qualite`, `step`, `rejets_industriels`, `rejets_domestiques` restent disponibles en compatibilité avec `legacy_support=true`.

Filtres supportes : `group_code`, `support_code`, `support`, `parameter_code`, `commune`, `bbox`, `limit`.

Frontend consommateur P0 :

- route isolee : `/dashboard-carto-metier` ;
- client : `frontend/src/api/mapBusiness.ts` ;
- hooks : `frontend/src/hooks/useMapBusiness.ts` ;
- chargement des entites uniquement apres selection utilisateur et clic `Afficher`.

Mise a jour Phase 6 du 2026-05-18 :

- Les alias P0 `NH4+`, `NH4+ Spect`, `NH4+ Titri`, `NO3-`, `NO3-_Spectro` et `MEST Filtr` sont mappes en DEV via `metadata.mapping_parametre_source`.
- Les filtres API acceptent `NO3` et le resolvent vers le code canonique existant `NO3-`.
- La route frontend isolee `/pollution-idp-dev` consomme `GET /api/v1/pollution/sites.geojson`.
- Statut : `C1B_CLOSED__GLOBAL_RESIDUAL_OPEN`.

Mise a jour du 2026-05-19 :

- `GET /api/v1/pollution/sites.geojson` enrichit chaque `latest_results[]` P0 avec `regulatory_status`, `class_code`, `class_label`, `color`, `severity_order`, `threshold` et `non_classifiable_reason`.
- La classification est faite cote backend avec le referentiel `metadata.qualite_*_reglementaire`, sans appel HTTP interne et sans ecriture base.
- La route frontend `/pollution-idp-dev` supporte deux symbologies : `validation_status` et `regulatory_status`.

## Identite spatiale maitre pollution/qualite

Mise a jour du 2026-05-19 :

- Le blocage PREPROD principal est la stabilisation de `geo.ref_site_pollution` comme referentiel spatial maitre.
- Les futurs endpoints cibles sont `/api/v1/map/sites`, `/api/v1/map/sites/{id}`, `/api/v1/map/sites/{id}/parameters`, `/api/v1/map/sites/{id}/timeseries`, `/api/v1/map/sites/{id}/sources`, `/api/v1/map/sites/conflicts`, `/api/v1/map/sites/orphans`.
- Les endpoints DEV existants `/api/v1/pollution/*` restent conserves pendant la transition.
- Toute fusion source -> master doit passer par `qa.spatial_identity_*` et rester reversible.
- Script dry-run : `scripts/idp_pollution/build_spatial_identity_resolution.py`.

## Réorganisation documentaire et API - 2026-05-22

L'audit de réorganisation a détecté 41 fichiers backend portant des routes ou montages API et 1010 références d'endpoints dans la documentation/code.

Règles agents :

- vérifier `docs/90_reorganisation_documentaire_finale/09_ecarts_documentation_vs_dashboards.md` avant de considérer un endpoint comme officiellement connecté ;
- garder la distinction `/api/v1/quality` legacy et `/api/v1/qualite` P0 ;
- considérer `/api/v1/pollution/*` et `/api/v1/map/*` comme DEV/P0 avec `C1-B` clos mais backlog global IDP encore gouverné séparément ;
- exclure de tout usage opérationnel les objets `WAIT_SOURCE_FIX` et ne jamais les réintroduire via frontend, KPI, analytics, propagation, scénarios ou datasets ML ;
- ne pas promouvoir SWAT analysis ou ingestion API comme obligatoires : ces modules peuvent être optionnels au runtime ;
- toute référence API basée sur `public.*` doit être traitée comme legacy ou dette à corriger.

## Dashboard qualité réglementaire P0

Mise à jour du 2026-06-01 :

- Route frontend isolée : `/dashboard-qualite-reglementaire`.
- APIs lecture seule consommées : `/api/v1/quality/regulatory-status`, `/thresholds`, `/stations`, `/timeseries`, `/classify`.
- Le contrat officiel est `type_eau=surface_generale`; `water_type` est legacy déprécié avec warning.
- `/thresholds` utilise `active_only=true` par défaut.
- Les statuts exposés incluent `NON_CLASSIFIABLE`, `HORS_PERIMETRE_REGLEMENTAIRE`, `TYPE_EAU_NON_OPERATIONNEL`, `PARAMETRE_NON_REGLEMENTAIRE`.
- Statut : `GO_DEV_DEMO_DASHBOARD_QUALITY_REGULATORY_P0`.
