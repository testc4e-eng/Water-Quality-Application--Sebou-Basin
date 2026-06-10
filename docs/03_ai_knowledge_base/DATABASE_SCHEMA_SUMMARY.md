# DATABASE_SCHEMA_SUMMARY

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Perimetre | synthese optimisee pour agents IA : schemas applicatifs reels, cardinalites et points d'entree SQL verifies |
| Source de verite | Non |
| Documents lies | [DATABASE_SCHEMA](../01_project_reference/data/DATABASE_SCHEMA.md), [API_DATA_MAPPING](../01_project_reference/data/API_DATA_MAPPING.md), [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) |
| Derniere mise a jour | 2026-06-05 |

## 0. Snapshot consolidé 2026-05-22

Inspection read-only de `abh_sad` réalisée pendant la réorganisation documentaire :

| Indicateur | Valeur |
|---|---:|
| Objets tables/vues inspectés | 339 |
| Vues matérialisées inspectées | 31 |
| Colonnes inspectées | 4554 |

Objets par schéma :

| Schéma | Objets |
|---|---:|
| `admin` | 5 |
| `api` | 77 |
| `audit` | 17 |
| `geo` | 18 |
| `geo_work` | 7 |
| `hydro` | 8 |
| `infra` | 22 |
| `metadata` | 49 |
| `meteo` | 5 |
| `modeles` | 3 |
| `monitoring` | 3 |
| `public` | 3 |
| `qa` | 31 |
| `qualite` | 9 |
| `security` | 11 |
| `staging` | 51 |
| `swat_output` | 8 |
| `swat_sebou` | 4 |
| `wasp_output` | 5 |
| `wasp_sebou` | 3 |

Cardinalités critiques observées :

| Objet | Cardinalité |
|---|---:|
| `infra.stations_mesure` | 390 |
| `infra.barrages` | 33 |
| `hydro.mesure_debit` | 652451 |
| `hydro.mesure_debit_mensuel` | 19316 |
| `hydro.mesure_barrage_param` | 272652 |
| `meteo.mesure_precipitation` | 546008 |
| `meteo.mesure_evaporation` | 48900 |
| `meteo.mesure_temperature` | 437889 |
| `qualite.mesure_qualite_riviere` | 59535 |
| `qualite.mesure_qualite_nappe` | 63047 |
| `qualite.mesure_qualite_barrage` | 7820 |
| `qualite.mesure_qualite_sebou` | 49954 |
| `qualite.suivi_qualite_barrage_garde_hebdo` | 1780 |
| `qualite.source_pollution_prelevement` | 141 |
| `qualite.source_pollution_mesure_param` | 7191 |
| `geo.ref_site_pollution` | 1951 |
| `qualite.resultat_mesure` | 1409 |
| `security.activity_logs` | 87346 |
| `wasp_sebou.wasp_results` | 931770 |

Ce snapshot prime sur les anciennes cardinalités de ce fichier lorsque les valeurs diffèrent. Le rapport complet est `docs/90_reorganisation_documentaire_finale/07_ecarts_documentation_vs_bd.md`.

## 1. Snapshot DB verifie le 2026-04-17

### Schemas applicatifs a connaitre

| Schema | Tables | Vues | Vues materialisees |
|---|---:|---:|---:|
| `admin` | 5 | 0 | 0 |
| `analytics` | 0 | 0 | 3 |
| `api` | 0 | 54 | 25 |
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

### Schemas prioritaires pour l'application

- `api`, `analytics` : exposition et performance des dashboards.
- `infra`, `hydro`, `meteo`, `qualite` : donnees metier directement exploitees.
- `metadata` : dictionnaires, mappings, popup rules, suivi des refresh.
- `security`, `audit` : comptes, logs et traçabilite.
- `swat_output`, `swat_sebou`, `wasp_output`, `wasp_sebou` : modeles et resultats.
- `staging` : perimetre de reprise et de comparaison, pas couche de restitution.

## 2. Cardinalites exactes de reference

| Objet | Cardinalite |
|---|---:|
| `infra.stations_mesure` | 390 |
| `infra.barrages` | 34 |
| `hydro.mesure_debit` | 652448 |
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
| `swat_sebou.swat_scenarios` | 1 |
| `wasp_sebou.wasp_scenarios` | 1 |

## 3. Tables structurantes a memoriser

### Infra / referentiels

- `infra.stations_mesure`
- `infra.barrages`
- `infra.point_eau`
- `infra.rejet_domestique`
- `infra.rejet_industriel`
- `infra.rejet_abattoir`

### Hydro / meteo / qualite

- `hydro.mesure_debit`
- `hydro.mesure_debit_mensuel`
- `hydro.mesure_barrage_param`
- `meteo.mesure_precipitation`
- `meteo.mesure_evaporation`
- `qualite.mesure_qualite_riviere`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_sebou`
- `qualite.suivi_qualite_barrage_garde_hebdo`
- `qualite.source_pollution_prelevement`
- `qualite.source_pollution_mesure_param`

### Metadata / securite

- `metadata.referentiel_parametre`
- `metadata.referentiel_parametre_canonique`
- `metadata.qualite_source_reglementaire`
- `metadata.qualite_type_eau`
- `metadata.qualite_classe_reglementaire`
- `metadata.qualite_parametre_reglementaire`
- `metadata.qualite_mapping_canonique_reglementaire`
- `metadata.qualite_seuil_reglementaire`
- `metadata.qualite_regle_classification`
- `metadata.api_view_catalog`
- `metadata.api_view_column_catalog`
- `metadata.popup_rules_config`
- `metadata.mv_refresh_status`
- `security.users`
- `security.roles`
- `security.permissions`
- `security.role_permissions`
- `security.activity_logs`
- `audit.ingestion_audit_logs`

## Mise a jour 2026-06-05 - Schema `data_admin`

Le schema `data_admin` est maintenant materialise et alimente pour le module 114.

Objets verifies :

| Objet | Role |
|---|---|
| `data_admin.data_class_registry` | registre officiel des classes metier SAD |
| `data_admin.field_registry` | dictionnaire de champs pour canevas, validation et UI |
| `data_admin.ingestion_run` | suivi des runs d'upload/validation |
| `data_admin.ingestion_file` | trace fichier, hash et preview |
| `data_admin.ingestion_validation_error` | erreurs structurelles, metier, referentielles et doublons |
| `data_admin.ingestion_staging_row` | staging JSON des lignes valides ou warning |
| `data_admin.validation_rule_registry` | registre des regles de validation dynamique |
| `data_admin.change_request` | workflow de demande de promotion controlee |
| `data_admin.change_request_item` | items candidats derives du staging |
| `data_admin.promotion_audit_log` | tracabilite create/submit/approve/apply |

Etat verifie au 2026-06-05 :

- `data_admin.data_class_registry` : `8` classes ;
- `data_admin.field_registry` : `41` champs ;
- `data_admin.validation_rule_registry` : `24` regles ;
- `data_admin.ingestion_validation_error` contient `error_scope` ;
- les classes pilotes `HYDRO_DEBIT`, `METEO_PRECIPITATION`, `QUALITE_RIVIERE` supportent `upload -> validation -> staging` sans promotion.
- `data_admin.change_request`, `data_admin.change_request_item` et `data_admin.promotion_audit_log` supportent maintenant la promotion `INSERT_ONLY` controlee ;
- `MVP3-B` durcit la couche sans nouveau schema metier :
  - roles existants `viewer`, `manager`, `admin` mappes a des capacites `data_admin` ;
  - transitions `change_request` verrouillees ;
  - traces acteur HTTP de type `user:{id}:{email}` ;
- `MVP3-C` etend `data_admin.change_request` avec :
  - `rollback_available`
  - `rollback_status`
  - `rollback_reference`
  - `rollback_requested_by`
  - `rollback_requested_at`
  - `rollback_approved_by`
  - `rollback_approved_at`
  - `rollback_applied_by`
  - `rollback_applied_at`
- `hydro.mesure_debit` a ete verifie a `652451` apres campagnes controlees `HYDRO_DEBIT` ;
- `meteo.mesure_precipitation` a ete verifie a `546008` apres campagne controlee `METEO_PRECIPITATION` ;
- `qualite.mesure_qualite_riviere` a ete verifie a `59535` apres campagne controlee `QUALITE_RIVIERE` ;
- un cas doublon exact `HYDRO_DEBIT_duplicate_candidate.csv` echoue proprement en `FAILED` sans ecriture metier supplementaire.
- un rollback logique `HYDRO_DEBIT` a ete verifie avec `+2` puis `-2`, sans variation nette finale des cardinalites metier.
- `MVP3-D` etend maintenant le schema `data_admin` aux classes geospatiales controlees :
  - `INFRA_STATION` :
    - champs `geom_wkt`, `srid`
    - validation geospatiale dynamique
    - promotion `INSERT_ONLY` vers `infra.stations_mesure`
    - rollback prouve `390 -> 392 -> 390`
  - `POLLUTION_SITE` :
    - champs `bassin`, `geom_wkt`, `srid`
    - validation geospatiale dynamique
    - promotion `INSERT_ONLY` vers `geo.ref_site_pollution`
    - rollback prouve `2026 -> 2028 -> 2026`
  - garde-fous verifies :
    - `geo.ref_site_pollution_source_link` reste `105`
    - `site_code LIKE 'IDP-C1B-%'` reste `75`
    - aucune fusion IDP automatique
- `MVP4` ne cree pas de nouveau schema de securite, mais reutilise le schema `security` existant :
  - `security.users`
  - `security.roles`
  - `security.permissions`
  - `security.role_permissions`
- roles cibles de demonstration verifies en base :
  - `ROLE_DECIDEUR`
  - `ROLE_EXPERT`
  - `ROLE_CONSULTANT`
  - `ROLE_DATA_ADMIN`
  - `ROLE_SYS_ADMIN`
  - `ROLE_AI_AGENT`
- comptes `demo_*` verifies en base pour DEV/demo uniquement.

## Mise a jour 2026-05-19 - Referentiel reglementaire qualite DEV

Le DDL DEV du referentiel reglementaire qualite SAD a ete applique dans `metadata` sans chargement de donnees. Les 7 tables suivantes existent et sont vides apres DDL :

| Table | Role |
|---|---|
| `metadata.qualite_source_reglementaire` | documents sources et versions reglementaires |
| `metadata.qualite_type_eau` | types d'eau et statut operationnel |
| `metadata.qualite_classe_reglementaire` | classes, scores et palette SAD |
| `metadata.qualite_parametre_reglementaire` | parametres du Tableau n°1 officiel |
| `metadata.qualite_mapping_canonique_reglementaire` | mapping vers `metadata.referentiel_parametre_canonique(parametre_ref_id)` |
| `metadata.qualite_seuil_reglementaire` | seuils reglementaires, unites source/moteur et regles specifiques |
| `metadata.qualite_regle_classification` | regles versionnees du moteur qualite |

Statut : `GO_PREPROD_CONDITIONNEL_DB_CONFIRMED`.

Mise a jour read-only verifiee au 2026-06-04 :

- `metadata.qualite_source_reglementaire` : `1` ;
- `metadata.qualite_type_eau` : `4` ;
- `metadata.qualite_classe_reglementaire` : `5` ;
- `metadata.qualite_parametre_reglementaire` : `41` ;
- `metadata.qualite_mapping_canonique_reglementaire` : `41` ;
- `metadata.qualite_seuil_reglementaire` : `205` ;
- `177` seuils actifs ;
- `36` parametres classifiables actifs ;
- `5` parametres observationnels non classifiables actifs.

## Mise a jour 2026-05-19 - Identite spatiale maitre pollution/qualite

`geo.ref_site_pollution` est la table pivot DEV existante pour `2026` sites pollution IDP. La cible PREPROD ajoute une gouvernance d'identite spatiale sans supprimer les sources :

| Objet cible | Role |
|---|---|
| `geo.ref_site_pollution` | referentiel spatial maitre actif |
| `geo.ref_site_pollution_source_link` | lineage source -> master |
| `geo.ref_site_pollution_merge_history` | historique fusions/rattachements |
| `qa.spatial_identity_candidates` | candidats produits par dry-run |
| `qa.spatial_identity_conflicts` | conflits a arbitrer |
| `qa.spatial_identity_decisions` | decisions metier tracees |
| `qa.spatial_identity_orphans` | sources sans rattachement |

SQL : `database/idp_pollution/20_create_ref_site_pollution_master.sql` et `21_create_spatial_identity_qa.sql`.

Mise a jour execution DEV du 2026-05-19 :

- DDL applique en DEV.
- `geo.ref_site_pollution` contient `2026` sites apres materialisation de `75` sites maitres `IDP-C1B-*`.
- Tables QA chargees pour le run `e60088e9-cf94-4e41-ae65-a5390866b4b8` :
  - `qa.spatial_identity_candidates` : 14380 lignes ;
  - `qa.spatial_identity_conflicts` : 14366 lignes ;
  - `qa.spatial_identity_orphans` : 590 lignes ;
  - `qa.spatial_identity_decisions_cartographic` : `105` lignes (`102 CREATE_NEW_MASTER_SITE`, `3 ACCEPT_MATCH`).
- Vues de revue creees : `qa.v_spatial_review_step_stm`, `qa.v_spatial_review_rejets`, `qa.v_spatial_review_huileries`, `qa.v_spatial_review_mines_decharges`, `qa.v_spatial_review_idp_inventory_measurements`, `qa.v_spatial_review_orphans`.
- `geo.ref_site_pollution_source_link` contient `105` liens source -> site actifs.
- La vue `qa.v_true_ambiguous_cases` reduit le residuel operationnel reel a `491` cas :
  - `3` conflits `TO_VALIDATE` deja decides en cartographie mais non reconcilies en statut QA brut ;
  - `488` `WAIT_SOURCE_FIX` sans geometrie, classes `CLIENT_REQUIRED_DATA_FIX`.

Mise a jour arbitrage cartographique DEV :

- Workflow simplifie par buckets : `qa.v_carto_review_exact_0m`, `qa.v_carto_review_very_close_2m`, `qa.v_carto_review_same_site_different_object`, `qa.v_carto_review_orphans`.
- Table de decisions future : `qa.spatial_identity_decisions_cartographic`.
- Les vues cartographiques reconstruisent la geometrie source/master pour QGIS/GeoJSON et excluent les coordonnees invalides du rendu cartographique.
- Les distances > 2 m sont exclues du workflow principal et restent dans les tables QA completes.
- Volumes observes apres simplification : `EXACT_0M` 8771, `VERY_CLOSE_2M` 126, `DIFFERENT_OBJECT` 5438, `ORPHAN` 102.
- Le lot `C1-B` est clos en DEV :
  - `105` decisions metier chargees ;
  - `75` sites maitres crees ;
  - `105` liens materialises ;
  - `C1-B = COMPLETED_DEV_DB_CONFIRMED`.
- Le residuel global IDP reste ouvert hors du lot ferme :
  - `IDP_DUPLICATE_CONSOLIDATION = OPEN` ;
  - `IDP_POSSIBLE_MATCH_REVIEW = OPEN` ;
  - `WAIT_SOURCE_FIX = CLIENT_REQUIRED_DATA_FIX` ;
  - `C1_GLOBAL = PARTIAL_DB_CONFIRMED`.

## 4. Points d'entree SQL verifies

- `api.mv_station_dimension`
- `api.mv_barrage_dimension`
- `api.mv_points_eau`
- `api.mv_bassin_geojson`
- `api.mv_sous_bassin_geojson`
- `api.mv_reseau_hydrographique`
- `analytics.mv_dashboard_climat_meteo_menu`
- `analytics.mv_dashboard_hydrologie_menu`
- `analytics.mv_dashboard_pollution_menu`
- `metadata.mv_obs_referentiel_parametre`
- `metadata.mv_obs_parametre_entite_compat`
- `metadata.mv_obs_parametre_coverage`
- `api.v_hierarchie_metier_listing`
- `api.v_wasp_qualite_segment_consolide`
- `api.v_hydro_barrage_param_journalier`
- `api.v_hydro_barrage_param_compat_wide`

## 5. Colonnes de reference sur les tables critiques

### `infra.stations_mesure`

- `id` `uuid`
- `code_station` `character varying`
- `nom` `character varying`
- `type_station` `character varying`
- `altitude_m` `numeric`
- `geom` `USER-DEFINED`
- `actif` `boolean`

### `hydro.mesure_debit`

- `temps` `timestamp with time zone`
- `station_id` `uuid`
- `valeur` `double precision`
- `est_valide` `boolean`
- `qa_flag_negative` `boolean`

### `hydro.mesure_barrage_param`

- `id` `uuid`
- `barrage_id` `uuid`
- `temps` `timestamp with time zone`
- `parametre_code` `text`
- `parametre_ref_id` `uuid`
- `valeur` `numeric`
- `unite` `text`
- `scenario` `text`
- `source_table` `text`
- `source_row_hash` `text`
- `target_business_key_hash` `text`
- `metadata_json` `jsonb`

### `meteo.mesure_precipitation`

- `temps` `timestamp with time zone`
- `station_id` `uuid`
- `val_observees` `double precision`
- `val_power_nasa` `double precision`
- `val_remplies` `double precision`
- `est_valide` `boolean`
- `qa_flag_negative` `boolean`

### `qualite.mesure_qualite_riviere`

- `temps` `timestamp with time zone`
- `station_id` `uuid`
- `parametre_qualite` `text`
- `parametre_ref_id` `uuid`
- `valeur` `double precision`
- `qa_flag_negative` `boolean`
- `qa_flag_param_missing` `boolean`

### `qualite.source_pollution_mesure_param`

- `id` `uuid`
- `prelevement_id` `uuid`
- `param_code_legacy` `text`
- `valeur_raw` `text`
- `valeur_num` `double precision`
- `parametre_ref_id` `uuid`
- `qa_flag_param_unmapped` `boolean`

## 6. Jointures utiles

- `hydro.mesure_debit.station_id -> infra.stations_mesure.id`
- `meteo.mesure_precipitation.station_id -> infra.stations_mesure.id`
- `qualite.mesure_qualite_riviere.station_id -> infra.stations_mesure.id`
- `qualite.mesure_qualite_riviere.parametre_ref_id -> metadata.referentiel_parametre.id`
- `qualite.source_pollution_mesure_param.prelevement_id -> qualite.source_pollution_prelevement.id`
- `wasp_sebou.wasp_results.variable_id -> wasp_sebou.wasp_variables.id`
- `wasp_sebou.wasp_results.scenario_id -> wasp_sebou.wasp_scenarios.id`

## 7. Alerte legacy

Les objets suivants ne doivent plus etre consideres comme references de production dans `abh_sad` :

- `public.stations_abhs`
- `public.barrages_abhs`
- `public.mesures_debit_jr`
- `public.mesures_temperatures_jr`
- `public.mesures_qualite_rivieres`

Si un routeur ou une doc cite encore ces objets comme tables actives, il faut les classer comme legacy ou dette technique.

## 8. Regle barrage validee

- `DEBIT` reste un debit instantane en `m3/s`.
- `LACHER`, `APPORT` et `TRANSFERT` sont des volumes journaliers barrage en `Mm3/j`.
- `APPORTS_HM3` est un alias legacy de `APPORT`, pas un code canonique actif.
- Les dashboards/API barrage consomment `hydro.mesure_barrage_param` via `api.v_hydro_barrage_param_journalier` et `analytics.mv_dashboard_hydrologie_menu`.
- `VOLUME` est un stock barrage en `Mm3`.
- `lacher_m3s` est une colonne legacy technique qui ne doit plus etre exposee comme flux metier barrage.

## 9. Vues API specialisees et `table_cible` referentiel

Mise a jour du 2026-05-13 :

- 19 vues SQL specialisees existent dans le schema `api` pour l'exposition meteo, hydro, qualite, pollution et IDP.
- `metadata.referentiel_parametre_canonique.table_cible` a ete renseigne pour 63 parametres actifs valides.
- Backup logique de l'operation : `audit.bkp_ref_table_cible_final_metier_20260513` avec 65 lignes.
- `FM` et `F_M_MES` restent volontairement sans `table_cible` avec statut hors restitution / client required.
- `MD` reste backlog client documentaire.
- `api.v_qualite_dashboard_global` est un agregateur potentiel, pas une cible primaire du referentiel.

Vues specialisees disponibles :

- Meteo : `api.v_meteo_temperature`, `api.v_meteo_precipitation`, `api.v_meteo_evaporation`.
- Hydro/barrage : `api.v_barrage_parametres`, `api.v_barrage_qualite`.
- Qualite : `api.v_qualite_base_multi_support`, `api.v_qualite_physicochimie`, `api.v_qualite_chimie_minerale`, `api.v_qualite_metaux`, `api.v_qualite_pollution_organique`, `api.v_qualite_microbiologie`, `api.v_qualite_biologique`, `api.v_qualite_terrain`, `api.v_qualite_contexte_station`, `api.v_qualite_organoleptique`.
- Pollution/IDP : `api.v_pollution_constat_prealable`, `api.v_pollution_analyses_finales`, `api.v_idp_points`, `api.v_idp_points_non_resolus`.

## 10. Runtime topologique pollution

Mise a jour du 2026-05-14 :

Le dashboard pollution utilise un schema de travail `geo_work` pour le routage topologique visuel.

| Objet | Role | Statut |
|---|---|---|
| `geo.reseau_hydrographique` | source hydrographique brute | ne pas modifier |
| `geo_work.reseau_hydro_edges_raw` | table de reconstruction initiale | audit / fallback degrade |
| `geo_work.reseau_hydro_edges_noded` | sortie nodification | reconstruction, non routable seule |
| `geo_work.reseau_hydro_edges_final` | table runtime officielle | active |
| `geo_work.reseau_hydro_edges_final_vertices_pgr` | noeuds runtime officiels | active |
| `geo_work.reseau_hydro_nodes` | noeuds legacy/raw | audit / fallback degrade |

Regles :

- Le runtime courant doit consommer `edges_final` + `edges_final_vertices_pgr`.
- Les tables `raw`, `noded` et `noded_preview` ne doivent pas etre melangees avec le runtime courant.
- `hydraulic_direction_validated=false` tant qu'une validation MNT/source-target n'existe pas.

## 11. Pollution IDP DEV

Mise a jour du 2026-05-18 :

- `geo.ref_site_pollution` est la couche canonique DEV des sites pollution.
- `qualite.resultat_mesure` est la table longue DEV des resultats IDP pollution P0.
- `api.v_pollution_sites` expose les sites MapLibre.
- `api.v_pollution_latest_results` expose les derniers resultats qualite rattaches aux sites.
- `qa.v_spatial_site_candidates` et les vues `qa.v_pollution_*` portent les controles d'arbitrage et de blocage.

Cardinalites DEV observees :

| Objet | Cardinalite |
|---|---:|
| `geo.ref_site_pollution` | 1951 |
| `qualite.resultat_mesure` | 1409 |
| `api.v_pollution_sites` | 1951 |
| `api.v_pollution_latest_results` | 517 |

Phase 6 du 2026-05-18 :

- mappings P0 parametres/unites appliques en DEV ;
- `PARAM_UNMAPPED` passe de 837 a 0 ;
- `UNIT_UNMAPPED` passe de 572 a 0 ;
- `NH4` et `NO3-` sont maintenant exposes dans `api.v_pollution_latest_results`.

Points bloquants avant pre-production : mesures sans geometrie/site, doublons exacts/proches et conflits multi-sources a arbitrer.
