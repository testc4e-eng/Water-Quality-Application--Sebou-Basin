# DATABASE_SCHEMA_SUMMARY

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Perimetre | synthese optimisee pour agents IA : schemas applicatifs reels, cardinalites et points d'entree SQL verifies |
| Source de verite | Non |
| Documents lies | [DATABASE_SCHEMA](../01_project_reference/data/DATABASE_SCHEMA.md), [API_DATA_MAPPING](../01_project_reference/data/API_DATA_MAPPING.md), [00_SOURCE_OF_TRUTH_MASTER](../00_SOURCE_OF_TRUTH_MASTER.md) |
| Derniere mise a jour | 2026-05-08 |

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
| `hydro.mesure_debit` | 521433 |
| `hydro.mesure_debit_mensuel` | 19316 |
| `hydro.mesure_barrage_param` | 272652 |
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
