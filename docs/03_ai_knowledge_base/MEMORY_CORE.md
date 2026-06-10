# MEMORY_CORE

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | noyau de mémoire projet pour agents IA |
| Source de vérité | Oui sur le périmètre IA |
| Documents liés | [QUICK_REFERENCE](./QUICK_REFERENCE.md), [AGENT_RULES](./AGENT_RULES.md), [../00_SOURCE_OF_TRUTH_MASTER.md](../00_SOURCE_OF_TRUTH_MASTER.md), [SOURCE_OF_TRUTH](../01_project_reference/SOURCE_OF_TRUTH.md) |
| Dernière mise à jour | 2026-06-05 |

## 1. Mission du projet

Le projet met en place un système d’aide à la décision web pour la gestion de la qualité des eaux de surface du bassin du Sebou. La plateforme combine :

- données métier et SIG ;
- dashboards analytiques et cartographiques ;
- administration, audit et gouvernance ;
- intégration future des résultats de modèles SWAT/WASP via contrat versionné.

## 2. Ce qu’un agent doit lire en priorité

1. `docs/00_source_of_truth/00_documents_prioritaires.md`
2. `docs/04_etat_avancement/00_project_global_status.md`
3. `docs/01_contexte_projet/01_mvp_scope.md`
4. `docs/05_blocages_et_risques/00_problemes_racines.md`
5. `docs/02_gouvernance_et_decisions/00_registre_decisions.md`
6. `docs/07_donnees_et_referentiels/00_data_landscape.md`
7. `docs/00_SOURCE_OF_TRUTH_MASTER.md`

## 3. Ce qui fait autorité

- la référence projet est dans `docs/01_project_reference/`
- la gouvernance décisionnelle est dans `docs/00_source_of_truth/`, `docs/01_contexte_projet/`, `docs/02_gouvernance_et_decisions/`, `docs/04_etat_avancement/`, `docs/05_blocages_et_risques/` et `docs/07_donnees_et_referentiels/`
- le contractuel et les rapports sont dans `docs/02_contractual_and_reports/`
- la mémoire IA résume, mais ne remplace pas, les documents maîtres

## 4. Ce qui ne fait pas autorité

- `docs/04_working_prompts_and_runs/`
- `docs/99_legacy_archive/`
- les exports bureautiques `generated_exports/`

## 5. Modules critiques

| Zone | Points à préserver |
|---|---|
| Backend | contrats d’API consommés par le frontend, routes analytics/observatory/layers/ingestion/admin |
| Frontend | dashboards cartographiques et analytiques, écrans admin, logique de filtres et parcours protégés |
| Base | couche `api`, schémas `metadata`, `security`, `staging`, `swat_*`, `wasp_*` |
| Gouvernance | logs, popup rules, scan des données, data viewer, rôles utilisateurs |

## 6. Points de vigilance

- ne pas créer de nouvelle source documentaire concurrente ;
- ne pas modifier des endpoints sans vérifier le frontend consommateur ;
- ne pas utiliser `99_legacy_archive` comme base de vérité ;
- distinguer clairement données brutes, vues d’exposition et restitutions analytiques ;
- préserver la cohérence entre documentation active et code.
- ne jamais mélanger débit instantané et volume journalier barrage.

## 7. Regles barrage a memoriser

- `DEBIT` = debit instantane = `m3/s`.
- `LACHER` = volume journalier barrage = `Mm3/j`.
- `RESTITUTION` est seulement un alias source de `LACHER`.
- `APPORT` = volume journalier entrant = `Mm3/j`; `APPORTS_HM3` reste un alias legacy.
- `TRANSFERT` = volume journalier transfere = `Mm3/j`.
- `VOLUME` = stock barrage = `Mm3`.
- `lacher_m3s` est legacy technique et ne doit plus etre expose comme flux metier barrage.

## 8. Regles qualite sensibles a la casse

- `MO` = Matieres organiques.
- `Mo` = Molybdene.
- Ne jamais fusionner `MO` et `Mo`.
- Ne jamais appliquer de normalisation `upper()` / `lower()` sur ces codes metier sensibles.
- `MO_METAL` est un alias legacy mappe vers `Mo` uniquement quand la source brute prouve `Molybdene(mg/l)`.

## 9. Logique d’intervention recommandée

1. identifier le document maître du sujet ;
2. lire le code concerné ;
3. limiter le changement au bon périmètre ;
4. mettre à jour la documentation active si le comportement change ;
5. compléter les preuves ou les pointeurs d’entrée si nécessaire.

## 10. Regle pollution hydrologie Phase E

- Le dashboard pollution utilise un moteur topologique visuel, pas un moteur hydraulique scientifique.
- Le runtime actif est `geo_work.reseau_hydro_edges_final` + `geo_work.reseau_hydro_edges_final_vertices_pgr`.
- Ne pas inverser automatiquement les aretes avec `Z_Max > Z_Min`.
- `direction_validated=false` et `hydraulic_direction_validated=false` tant que la validation MNT/source-target n'est pas faite.
- Le fallback non oriente est acceptable pour la demonstration, mais doit rester explicitement signale comme `used_fallback=true`.

## 11. Pipeline DEV pollution IDP

- Le pipeline DEV IDP pollution charge les SHP en staging, consolide `geo.ref_site_pollution`, pivote les mesures P0 dans `qualite.resultat_mesure` et expose `api.v_pollution_sites` / `api.v_pollution_latest_results`.
- Le router `/api/v1/pollution` est lecture seule et sert la premiere couche MapLibre DEV.
- Les mappings P0 `NH4`/`NO3` et unites sont corriges en DEV depuis les referentiels existants.
- `C1-B` est cloture en DEV : `105` decisions metier chargees, `75` sites maitres `IDP-C1B-*` crees et `105` liens source -> site materialises.
- Ne pas confondre le lot ferme `C1-B` avec le residuel global IDP :
  - `IDP_DUPLICATE_CONSOLIDATION` reste ouvert pour les `DUPLICATE_EXACT` ;
  - `IDP_POSSIBLE_MATCH_REVIEW` reste ouvert pour les `POSSIBLE_MATCH` ;
  - `WAIT_SOURCE_FIX = CLIENT_REQUIRED_DATA_FIX` pour les objets sans geometrie.
- Les objets `WAIT_SOURCE_FIX` ne doivent pas etre utilises dans les dashboards, KPI, analyses spatiales, graphes de propagation, scenarios, datasets ML ou validations scientifiques.

## 12. Pipeline SAD Sebou - Model Build, Feature Store et IA

Mise a jour du 2026-05-22 :

- Le projet evolue vers une plateforme hydro-spatio-temporelle gouvernee, reproductible, QA-first, ML-ready, Graph-ready et compatible futur Digital Twin hydro-environnemental.
- Le pipeline cible est : sources brutes -> raw/staging -> canonical reference -> model_build -> QA/lineage/certification -> feature_store -> training datasets -> ML/forecasting/surrogate -> future Graph AI.
- Phase A `Data Governance Foundation` : READY.
- Phase B `Model Build Specification` : READY.
- Phase C `Feature Store Specification` : READY.
- Phase D `QA & Lineage Framework` : READY.
- Phase E `Pre-ML Readiness & First ML Pilot` : PREPARED.
- Phase E1 `First Real ML Sandbox Execution` : SANDBOX_BASELINE_EXECUTED. Run `run_20260522_143742_hydro_ml_baseline_v0_sandbox`, dataset hash `a1d4a95709562a3c57c143b8bb982f1e010ffabf3817f4430ad3f3b38dcce26e`, persistence baseline uniquement, outputs `ML_SANDBOX_ONLY`, feedback vers D.1 Graph Governance.
- Les outputs SWAT/WASP actuels restent `LEGACY_MODELING_TO_REPLACE`.
- Aucun mapping spatial, SWAT ou WASP ne doit etre fige sans validation SIG/QA, Reda ou Anas.
- Aucun Graph AI officiel ne doit etre produit tant que la topology et la direction hydraulique ne sont pas validees.
- E1 autorise uniquement un pipeline hydro sandbox pour observer gaps, leakage, instabilite features, problemes de splits et limites QA. Aucun reporting DG, GNN, embedding graph, propagation officielle ou promotion scientifique n'est autorise.
- E1.1 révèle déjà : forte lacune évaporation (~74% null), généralisation faible à J+7 en test, environnement ML à stabiliser avant XGBoost/LightGBM, aucun signal graph exploitable car aucune feature graph-aware n'a été utilisée.

## 13. Gouvernance décisionnelle

Mise a jour du 2026-05-22 :

- Le projet est maintenant piloté par cinq documents maîtres : état global, MVP/périmètre, problèmes racines, registre des décisions et data landscape.
- Les audits et lots historiques restent des preuves, mais ne doivent plus être le niveau principal de pilotage.
- Les anomalies doivent être classées en `ANOMALIE`, `AMBIGUITE`, `DONNEE_ABSENTE`, `FUTURE_DONNEE`, `EXPERIMENTAL` ou `STABILISE`.
- Le statut global est : migration historique clôturée avec backlog, dashboard cartographique métier P0 prêt DEV, `C1-B` IDP fermé en DEV avec résiduel global séparé, SWAT/WASP hors blocage technique court.
- Avant toute évolution, vérifier le document maître de gouvernance concerné puis `docs/00_SOURCE_OF_TRUTH_MASTER.md`.

## 13bis. Nouveau chemin critique 2026-06-04

- `IDP` est clôturé avec backlog gouverné ; il ne doit plus être traité comme un blocage PREPROD.
- `SWAT` et `WASP` restent des dépendances métier externes tant qu'aucun run validé scientifiquement n'est livré.
- les anciens routeurs backend ciblant `public.*` non montés sont archivés dans `backend/app/routers_legacy_public/` et ne doivent pas être réactivés sans audit.
- la source de verite frontend pour l'URL API est `frontend/src/config/api.ts` via `VITE_API_BASE_URL`, fallback `http://127.0.0.1:8000/api/v1`.
- Le chemin critique court devient :
  1. qualification PREPROD backend/frontend/API/DB ;
  2. consolidation `C3` réglementaire ;
  3. industrialisation du module `114_data_admin_ingestion` ;
  4. préparation des contrats d'intégration SWAT/WASP ;
  5. préparation du socle IA/ML.
- Pour les agents, cela signifie :
  - ne pas bloquer une décision plateforme sur l'absence actuelle de résultats SWAT/WASP ;
  - distinguer clairement runtime officiel, sandbox legacy et backlog scientifique externe.

## 13ter. Module 114 administration & ingestion

- le module cible de gouvernance operationnelle des donnees est documente dans `docs/114_data_admin_ingestion/` ;
- il doit unifier audit lecture seule, canevas, upload, validation, staging, promotion et `change_request` ;
- l'existant reutilisable est :
  - `/api/v1/admin/data-availability` ;
  - `/api/v1/ingestion/*` ;
  - `/api/v1/raw/*` uniquement comme outil expert secondaire ;
  - `audit.ingestion_audit_logs` et `security.activity_logs` ;
- aucune modification frontend ne doit ecrire directement dans `geo`, `infra`, `hydro`, `meteo`, `qualite` ou `metadata` ;
- toute ingestion cible passe par `staging + validation + review + promotion` ;
- toute modification cible passe par `change_request + approbation + audit`.
- `114_MVP1_A_STATUS = DEV_DB_ACTIVE` :
  - routeur backend `/api/v1/data-admin` actif ;
  - registre `data_admin.data_class_registry` materialise en base runtime ;
  - `8` classes seedees ;
  - fallback `code_seed` desactive sur les endpoints actifs.
- `114_MVP1_B_STATUS = FRONTEND_AUDIT_ACTIVE` :
  - route frontend `/admin/data-governance/audit` active ;
  - consommation frontend exclusivement via `/api/v1/data-admin/*` ;
  - composants reutilisables prepares pour `MVP2` :
    - `DataClassCard`
    - `DataClassTable`
    - `DataHealthBadge`
    - `DataSchemaViewer`
    - `DataRecordGrid`
  - la route exige une session authentifiee pour eviter un shell vide hors contexte utilisateur.
- `114_MVP2_A_STATUS = TEMPLATE_GENERATION_ACTIVE` :
  - endpoints backend actifs :
    - `GET /api/v1/data-admin/classes/{class_code}/template/spec`
    - `POST /api/v1/data-admin/classes/{class_code}/template/generate`
  - onglet frontend `Canevas` actif dans `/admin/data-governance/audit` ;
  - les fichiers generes contiennent `DONNEES`, `INSTRUCTIONS`, `DICTIONNAIRE_CHAMPS`, `METADATA` ;
- `114_MVP2_B_STATUS = FIELD_REGISTRY_ENRICHED` :
  - `data_admin.field_registry` contient `41` lignes seedes ;
  - colonnes enrichies materialisees :
    - `example_value`
    - `unit_expected`
    - `allowed_values_source`
    - `description`
  - les classes prioritaires `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE`, `POLLUTION_SITE`, `INFRA_STATION` lisent maintenant leurs specs depuis `data_admin.field_registry` ;
  - `field_registry_incomplete = false` pour ces classes dans `template/spec`.
- `114_MVP2_C_STATUS = UPLOAD_VALIDATION_STAGING_ACTIVE` :
  - les tables `data_admin.ingestion_run`, `data_admin.ingestion_file`, `data_admin.ingestion_validation_error` et `data_admin.ingestion_staging_row` sont materialisees ;
  - les endpoints actifs sont :
    - `POST /api/v1/data-admin/classes/{class_code}/ingestion/upload`
    - `GET /api/v1/data-admin/ingestion/runs`
    - `GET /api/v1/data-admin/ingestion/runs/{run_id}`
    - `GET /api/v1/data-admin/ingestion/runs/{run_id}/errors`
    - `GET /api/v1/data-admin/ingestion/runs/{run_id}/staging-preview`
  - les classes pilotes actives sont `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE` ;
  - aucune promotion automatique n'est permise ;
  - aucune ecriture dans les schemas metier n'est autorisee ;
  - `QUALITE_RIVIERE` autorise `station_id` ou `ire_station` au niveau validation/staging.
- `114_MVP2_D_STATUS = DYNAMIC_REFERENTIAL_VALIDATION_ACTIVE` :
  - `data_admin.validation_rule_registry` contient `24` regles actives ;
  - les endpoints `validation-rules` sont actifs ;
  - `error_scope` distingue `STRUCTURAL`, `BUSINESS`, `REFERENTIAL`, `DUPLICATE`, `TEMPORAL` ;
  - les classes pilotes valident dynamiquement l'existence station/code station/parametre, les doublons potentiels, les dates futures et les valeurs hors plage raisonnable ;
  - aucune promotion metier n'est encore activee.
- `114_MVP3_STATUS = CHANGE_REQUEST_PROMOTION_ACTIVE` :
  - `data_admin.change_request`, `data_admin.change_request_item` et `data_admin.promotion_audit_log` sont materialisees ;
  - les endpoints `change-request`, `approve`, `reject`, `apply` et `audit-log` sont actifs ;
  - la promotion reste `INSERT_ONLY` et limitee a `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE` ;
  - les runs `VALIDATION_FAILED` ne peuvent pas creer de demande ;
  - les lignes `INVALID` ne sont jamais candidates ;
  - un cas warning doublon peut etre approuve, mais echoue proprement a l'apply si la ligne existe deja en cible ;
- `114_MVP3_B_STATUS = RBAC_PROMOTION_HARDENED` :
    - les routes `data-admin` sont protegees par capacites derivees des roles existants `viewer`, `manager`, `admin` ;
    - a ce stade historique, le mode etait `RBAC_SIMULATED`, pas encore RBAC cible complet ;
    - les acteurs traces cote backend sont `user:{id}:{email}` ;
    - `approve` exige `manager` ou `admin` ;
    - `apply` exige `admin` ;
    - les transitions invalides remontent `CHANGE_REQUEST_NOT_APPROVED`, `CHANGE_REQUEST_ALREADY_APPLIED`, `CHANGE_REQUEST_REJECTED` ou `INVALID_CHANGE_REQUEST_TRANSITION` ;
    - les promotions E2E `METEO_PRECIPITATION` et `QUALITE_RIVIERE` sont maintenant validees en plus de `HYDRO_DEBIT`.
- `114_MVP3_C_STATUS = ROLLBACK_LOGIQUE_ACTIVE` :
    - rollback limite au mode `INSERT_ONLY` ;
    - rollback exige une demande appliquee, une preparation, une approbation et une cible univoque ;
    - `rollback_reference` porte `target_schema`, `target_table`, `target_pk`, `audit_id` et items rollbackables ;
    - l'operation applique un `DELETE` strictement borne par `target_pk` et preuve d'audit ;
    - refus attendus : `ROLLBACK_NOT_AVAILABLE`, `ROLLBACK_NOT_APPROVED`, `ROLLBACK_ALREADY_APPLIED`, `ROLLBACK_REQUEST_NOT_APPLIED`, `ROLLBACK_TARGET_NOT_FOUND`, `ROLLBACK_TARGET_NOT_UNIQUE` ;
    - campagne de preuve : `HYDRO_DEBIT +2 puis -2`, delta net nul.
- `114_MVP3_D_STATUS = INFRA_POLLUTION_EXTENSION_ACTIVE` :
  - `INFRA_STATION` et `POLLUTION_SITE` sont des classes actives du flux complet `upload -> validation -> staging -> change_request -> apply -> rollback` ;
  - les champs geospatiaux normalises sont `geom_wkt` + `srid` ;
  - la validation dynamique ajoute `GEOSPATIAL`, `DUPLICATE` et controles de bornes Maroc ;
  - `INFRA_STATION` ecrit dans `infra.stations_mesure.geom` en `4326` via transformation explicite ;
  - `POLLUTION_SITE` ecrit dans `geo.ref_site_pollution.geom` en `26191` et `geom_4326` en `4326` ;
  - `POLLUTION_SITE` refuse `site_code LIKE 'IDP-C1B-%'` ;
  - aucune ecriture n'est autorisee dans `geo.ref_site_pollution_source_link` ;
  - campagnes prouvees :
    - `INFRA_STATION` : `390 -> 392 -> 390`
    - `POLLUTION_SITE` : `2026 -> 2028 -> 2026`
  - invariants :
    - `NO_IDP_REGRESSION = CONFIRMED`
    - `NO_AUTO_MERGE = CONFIRMED`
    - `NO_AUTOMATIC_SOURCE_LINK = CONFIRMED`
- `114_MVP4_STATUS = RBAC_REAL_ACTIVE` :
  - le module 114 ne fonctionne plus en `RBAC_SIMULATED` ;
  - les permissions sont resolues depuis `security.role_permissions` via l'utilisateur authentifie ;
  - les roles de demonstration actifs sont :
    - `ROLE_DECIDEUR`
    - `ROLE_EXPERT`
    - `ROLE_CONSULTANT`
    - `ROLE_DATA_ADMIN`
    - `ROLE_SYS_ADMIN`
    - `ROLE_AI_AGENT`
  - `/api/v1/auth/login` et `/api/v1/auth/me` exposent `role_label`, `permissions`, `rbac_status` ;
  - `approve` exige une permission d'approbation reelle ;
  - `apply` et `rollback/apply` exigent une permission d'application reelle ;
  - les ecrans frontend `Data Governance` masquent ou desactivent les actions selon permissions reelles ;
  - les comptes `demo_*` servent uniquement en DEV/demo client et ne doivent jamais etre reutilises en production.

## 14. Réorganisation documentaire 2026-05-22

- Rapport principal : `docs/90_reorganisation_documentaire_finale/16_rapport_final_reorganisation.md`.
- Source consolidée : `docs/00_source_of_truth/01_source_of_truth_consolidee.md`.
- Audit BD read-only : 339 objets tables/vues, 31 vues matérialisées, 4554 colonnes.
- Documents analysés : 2144.
- Lot A exécuté : 50 fichiers historiques racine déplacés dans `docs/12_historique_et_archives/root_legacy/`.
- Références mises à jour pendant le lot A : 216 occurrences.
- Les dossiers historiques complets restent en place pour éviter de casser les liens ; leur déplacement est documenté comme lot B différé.
- Toute ancienne référence à un fichier racine `docs/12_*`, `docs/14_*`, `docs/30_*`, etc. doit être recherchée sous `docs/12_historique_et_archives/root_legacy/`.

## 15. Dashboard qualité réglementaire P0

- Route DEV : `/dashboard-qualite-reglementaire`.
- Périmètre : Tableau n°1, `type_eau=surface_generale`, 41 paramètres, 36 classifiables, 177 seuils actifs, 28 exclus.
- Les paramètres observationnels restent visibles avec statut `NON_CLASSIFIABLE` et ne participent jamais à la qualité globale.
- Contrats critiques : `MO != Mo`, `NO3 -> NO3-`, `O2_DISSOUS -> O2_DISS`.
- Statut : `GO_DEV_DEMO_DASHBOARD_QUALITY_REGULATORY_P0`, pas encore `GO_PREPROD_FINAL`.
