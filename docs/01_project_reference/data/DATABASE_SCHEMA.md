# DATABASE_SCHEMA

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | référentiel maître de la structure réelle de la base, des objets, des colonnes et des relations |
| Source de vérité | Oui |
| Documents liés | [database_architecture](../architecture/database_architecture.md), [DATA_MODELS](./DATA_MODELS.md), [DATA_FLOW](./DATA_FLOW.md), [DATA_QUALITY](./DATA_QUALITY.md), [API_DATA_MAPPING](./API_DATA_MAPPING.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Positionnement

Ce document constitue la référence détaillée de la base `abh_sad`. Il a été produit à partir d'une introspection SQL réelle exécutée le `2026-04-10`, complétée par le mapping déjà implémenté côté backend et frontend.

## 2. Snapshot global des schémas actifs

| Schéma | Tables | Vues | Vues matérialisées | Rôle métier |
|---|---|---|---|---|
| `admin` | 5 | 0 | 0 | Référentiels administratifs et découpages territoriaux. |
| `analytics` | 0 | 0 | 3 | Agrégats et menus de performance pour les dashboards. |
| `api` | 0 | 49 | 25 | Couche d'exposition SQL consommée par le backend et le frontend. |
| `audit` | 1 | 0 | 0 | Traçabilité des imports et des opérations d'ingestion. |
| `geo` | 13 | 0 | 0 | Référentiels spatiaux du bassin et couches hydrographiques. |
| `hydro` | 7 | 0 | 0 | Mesures hydrologiques et tables associées aux débits et barrages. |
| `infra` | 22 | 0 | 0 | Stations, barrages, points d'eau et inventaires d'infrastructures. |
| `metadata` | 37 | 2 | 3 | Dictionnaires, mappings, catalogue API, popup rules et couverture métier. |
| `meteo` | 5 | 0 | 0 | Mesures météorologiques et climatiques. |
| `modeles` | 3 | 0 | 0 | Référentiels structurants associés aux modèles. |
| `monitoring` | 3 | 0 | 0 | Objets de supervision métier ou technique. |
| `public` | 1 | 2 | 0 | Compatibilité résiduelle et reliquats historiques. |
| `qa` | 1 | 0 | 0 | Seuils et objets de contrôle qualité. |
| `qualite` | 8 | 0 | 0 | Mesures de qualité des eaux et tables de prélèvement associées. |
| `security` | 11 | 0 | 0 | Utilisateurs, rôles, permissions et journaux de sécurité. |
| `staging` | 35 | 0 | 0 | Zone d'intégration et d'historisation intermédiaire. |
| `swat_output` | 8 | 0 | 0 | Sorties et référentiels issus du modèle SWAT. |
| `swat_sebou` | 4 | 0 | 0 | Scénarios et résultats SWAT consolidés pour Sebou. |
| `wasp_output` | 5 | 0 | 0 | Sorties et référentiels issus du modèle WASP. |
| `wasp_sebou` | 3 | 0 | 0 | Scénarios et résultats WASP consolidés pour Sebou. |

## 3. Objets les plus volumineux

| Schéma | Objet | Type | Lignes estimées | Taille |
|---|---|---|---|---|
| `analytics` | `mv_dashboard_hydrologie_menu` | materialized_view | 640046 | 281 MB |
| `swat_output` | `stg_swat_qualite_long` | table | 745110 | 167 MB |
| `api` | `mv_hydro_debit_day_qa` | materialized_view | 521433 | 91 MB |
| `api` | `ca_meteo_precip_day` | materialized_view | 546007 | 87 MB |
| `analytics` | `mv_dashboard_pollution_menu` | materialized_view | 165684 | 81 MB |
| `wasp_sebou` | `wasp_results` | table | 931770 | 74 MB |
| `wasp_output` | `stg_wasp_qualite_long` | table | 931770 | 70 MB |
| `staging` | `mesures_precipitations_jr_traitees` | table | 546007 | 69 MB |
| `staging` | `mesures_precip` | table | 669880 | 63 MB |
| `analytics` | `mv_dashboard_climat_meteo_menu` | materialized_view | 110344 | 53 MB |
| `staging` | `mesure_precipitation_old_model` | table | 507930 | 34 MB |
| `security` | `activity_logs` | table | 67048 | 26 MB |
| `staging` | `mesures_debit_jr` | table | 173251 | 18 MB |
| `api` | `mv_qualite_nappes_day` | materialized_view | 63083 | 14 MB |
| `api` | `mv_qualite_riviere_day` | materialized_view | 60075 | 13 MB |
| `staging` | `mesures_niv_eau_barrages` | table | 85166 | 11 MB |
| `api` | `mv_qualite_sebou_day` | materialized_view | 51402 | 10 MB |
| `api` | `ca_meteo_evaporation_day` | materialized_view | 48900 | 9168 kB |
| `staging` | `mesures_qualite_nappes` | table | 63088 | 7392 kB |
| `public` | `spatial_ref_sys` | table | 8500 | 7144 kB |
| `hydro` | `barrage_bathymetrie` | table | 62359 | 6720 kB |
| `api` | `mv_sous_bassin_swat_geom_4326` | materialized_view | 174 | 5976 kB |
| `api` | `mv_hydro_debit_mensuel` | materialized_view | 19316 | 5944 kB |
| `admin` | `communes` | table | 346 | 5784 kB |
| `api` | `mv_sous_bassin_swat_geojson` | materialized_view | 174 | 5328 kB |

## 4. Comptages réels ciblés

| Objet | Comptage | Début | Fin |
|---|---|---|---|
| `audit.ingestion_audit_logs` | 14 | - | - |
| `geo.bassin_versant` | 1 | - | - |
| `geo.nappe` | 17 | - | - |
| `geo.reseau_hydrographique` | 697 | - | - |
| `geo.sous_bassin_abh` | 15 | - | - |
| `hydro.mesure_barrage` | 84831 | 1996-12-01 00:00:00+00 | 2025-09-01 00:00:00+00 |
| `hydro.mesure_debit` | 521433 | 1956-09-01 00:00:00+00 | 2025-08-31 01:00:00+00 |
| `infra.barrages` | 34 | - | - |
| `infra.stations_mesure` | 390 | - | - |
| `metadata.popup_rules_config` | 11 | - | - |
| `metadata.referentiel_parametre` | 91 | - | - |
| `meteo.mesure_precipitation` | 546007 | 1985-09-01 00:00:00+00 | 2024-08-31 00:00:00+00 |
| `meteo.mesure_temperature` | 0 | - | - |
| `qualite.mesure_qualite_barrage` | 8714 | 1988-10-14 00:00:00+00 | 2024-11-29 00:00:00+00 |
| `qualite.mesure_qualite_nappe` | 63088 | 1988-10-03 00:00:00+00 | 2024-11-29 00:00:00+00 |
| `qualite.mesure_qualite_riviere` | 60097 | 1988-09-20 00:00:00+00 | 2024-11-28 00:00:00+00 |
| `qualite.mesure_qualite_sebou` | 51402 | 2023-12-07 00:00:00+00 | 2025-09-25 00:00:00+00 |
| `security.activity_logs` | 71717 | - | - |
| `security.auth_logs` | 95 | - | - |
| `security.permissions` | 10 | - | - |
| `security.roles` | 3 | - | - |
| `security.users` | 3 | - | - |
| `swat_sebou.swat_reach_results` | 0 | - | - |
| `swat_sebou.swat_scenarios` | 1 | - | - |
| `swat_sebou.swat_subbasin_results` | 0 | - | - |
| `wasp_sebou.wasp_results` | 931770 | 2015-09-01 | 2025-08-31 |
| `wasp_sebou.wasp_scenarios` | 1 | - | - |

## 5. Fonctions structurantes

| Schéma | Routine | Type |
|---|---|---|
| `api` | `fn_refresh_qualite_matviews` | FUNCTION |
| `hydro` | `fn_debit_apply_qa` | FUNCTION |
| `hydro` | `fn_debit_source_apply_qa` | FUNCTION |
| `infra` | `fn_decharge_inventaire_pollution_apply_qa` | FUNCTION |
| `infra` | `fn_decharge_inventaire_pollution_general_apply_qa` | FUNCTION |
| `infra` | `fn_huilerie_inventaire_pollution_apply_qa` | FUNCTION |
| `infra` | `fn_mine_inventaire_pollution_apply_qa` | FUNCTION |
| `infra` | `fn_rejet_abattoir_inventaire_apply_qa` | FUNCTION |
| `infra` | `fn_rejet_inventaire_pollution_apply_qa` | FUNCTION |
| `infra` | `fn_step_inventaire_pollution_apply_qa` | FUNCTION |
| `metadata` | `fn_extract_qualifier` | FUNCTION |
| `metadata` | `fn_norm_txt` | FUNCTION |
| `metadata` | `fn_parse_mesure_numeric` | FUNCTION |
| `metadata` | `refresh_perf_mviews` | FUNCTION |
| `meteo` | `fn_evaporation_apply_qa` | FUNCTION |
| `meteo` | `fn_precip_traitee_apply_qa` | FUNCTION |
| `meteo` | `fn_precipitation_apply_qa` | FUNCTION |
| `public` | `_postgis_deprecate` | FUNCTION |
| `public` | `_postgis_index_extent` | FUNCTION |
| `public` | `_postgis_join_selectivity` | FUNCTION |
| `public` | `_postgis_pgsql_version` | FUNCTION |
| `public` | `_postgis_scripts_pgsql_version` | FUNCTION |
| `public` | `_postgis_selectivity` | FUNCTION |
| `public` | `_postgis_stats` | FUNCTION |
| `public` | `_st_3ddfullywithin` | FUNCTION |
| `public` | `_st_3ddwithin` | FUNCTION |
| `public` | `_st_3dintersects` | FUNCTION |
| `public` | `_st_asgml` | FUNCTION |
| `public` | `_st_asx3d` | FUNCTION |
| `public` | `_st_bestsrid` | FUNCTION |
| `public` | `_st_bestsrid` | FUNCTION |
| `public` | `_st_contains` | FUNCTION |
| `public` | `_st_containsproperly` | FUNCTION |
| `public` | `_st_coveredby` | FUNCTION |
| `public` | `_st_coveredby` | FUNCTION |
| `public` | `_st_covers` | FUNCTION |
| `public` | `_st_covers` | FUNCTION |
| `public` | `_st_crosses` | FUNCTION |
| `public` | `_st_dfullywithin` | FUNCTION |
| `public` | `_st_distancetree` | FUNCTION |
| `public` | `_st_distancetree` | FUNCTION |
| `public` | `_st_distanceuncached` | FUNCTION |
| `public` | `_st_distanceuncached` | FUNCTION |
| `public` | `_st_distanceuncached` | FUNCTION |
| `public` | `_st_dwithin` | FUNCTION |
| `public` | `_st_dwithin` | FUNCTION |
| `public` | `_st_dwithinuncached` | FUNCTION |
| `public` | `_st_dwithinuncached` | FUNCTION |
| `public` | `_st_equals` | FUNCTION |
| `public` | `_st_expand` | FUNCTION |
| `public` | `_st_geomfromgml` | FUNCTION |
| `public` | `_st_intersects` | FUNCTION |
| `public` | `_st_linecrossingdirection` | FUNCTION |
| `public` | `_st_longestline` | FUNCTION |
| `public` | `_st_maxdistance` | FUNCTION |
| `public` | `_st_orderingequals` | FUNCTION |
| `public` | `_st_overlaps` | FUNCTION |
| `public` | `_st_pointoutside` | FUNCTION |
| `public` | `_st_sortablehash` | FUNCTION |
| `public` | `_st_touches` | FUNCTION |
| `public` | `_st_voronoi` | FUNCTION |
| `public` | `_st_within` | FUNCTION |
| `public` | `add_columnstore_policy` | PROCEDURE |
| `public` | `add_compression_policy` | FUNCTION |
| `public` | `add_continuous_aggregate_policy` | FUNCTION |
| `public` | `add_dimension` | FUNCTION |
| `public` | `add_dimension` | FUNCTION |
| `public` | `add_job` | FUNCTION |
| `public` | `add_process_hypertable_invalidations_policy` | PROCEDURE |
| `public` | `add_reorder_policy` | FUNCTION |
| `public` | `add_retention_policy` | FUNCTION |
| `public` | `addgeometrycolumn` | FUNCTION |
| `public` | `addgeometrycolumn` | FUNCTION |
| `public` | `addgeometrycolumn` | FUNCTION |
| `public` | `alter_job` | FUNCTION |
| `public` | `approximate_row_count` | FUNCTION |
| `public` | `armor` | FUNCTION |
| `public` | `armor` | FUNCTION |
| `public` | `attach_chunk` | PROCEDURE |
| `public` | `attach_tablespace` | FUNCTION |
| `public` | `box` | FUNCTION |
| `public` | `box` | FUNCTION |
| `public` | `box2d` | FUNCTION |
| `public` | `box2d` | FUNCTION |
| `public` | `box2d_in` | FUNCTION |
| `public` | `box2d_out` | FUNCTION |
| `public` | `box2df_in` | FUNCTION |
| `public` | `box2df_out` | FUNCTION |
| `public` | `box3d` | FUNCTION |
| `public` | `box3d` | FUNCTION |
| `public` | `box3d_in` | FUNCTION |
| `public` | `box3d_out` | FUNCTION |
| `public` | `box3dtobox` | FUNCTION |
| `public` | `by_hash` | FUNCTION |
| `public` | `by_range` | FUNCTION |
| `public` | `bytea` | FUNCTION |
| `public` | `bytea` | FUNCTION |
| `public` | `cagg_migrate` | PROCEDURE |
| `public` | `chunk_columnstore_stats` | FUNCTION |
| `public` | `chunk_compression_stats` | FUNCTION |
| `public` | `chunks_detailed_size` | FUNCTION |
| `public` | `compress_chunk` | FUNCTION |
| `public` | `contains_2d` | FUNCTION |
| `public` | `contains_2d` | FUNCTION |
| `public` | `contains_2d` | FUNCTION |
| `public` | `convert_to_columnstore` | PROCEDURE |
| `public` | `convert_to_rowstore` | PROCEDURE |
| `public` | `create_hypertable` | FUNCTION |
| `public` | `create_hypertable` | FUNCTION |
| `public` | `crypt` | FUNCTION |
| `public` | `dearmor` | FUNCTION |
| `public` | `decompress_chunk` | FUNCTION |
| `public` | `decrypt` | FUNCTION |
| `public` | `decrypt_iv` | FUNCTION |
| `public` | `delete_job` | FUNCTION |
| `public` | `detach_chunk` | PROCEDURE |
| `public` | `detach_tablespace` | FUNCTION |
| `public` | `detach_tablespaces` | FUNCTION |
| `public` | `digest` | FUNCTION |
| `public` | `digest` | FUNCTION |
| `public` | `disable_chunk_skipping` | FUNCTION |
| `public` | `drop_chunks` | FUNCTION |
| `public` | `dropgeometrycolumn` | FUNCTION |
| `public` | `dropgeometrycolumn` | FUNCTION |
| `public` | `dropgeometrycolumn` | FUNCTION |
| `public` | `dropgeometrytable` | FUNCTION |
| `public` | `dropgeometrytable` | FUNCTION |
| `public` | `dropgeometrytable` | FUNCTION |
| `public` | `enable_chunk_skipping` | FUNCTION |
| `public` | `encrypt` | FUNCTION |
| `public` | `encrypt_iv` | FUNCTION |
| `public` | `equals` | FUNCTION |
| `public` | `find_srid` | FUNCTION |
| `public` | `first` |  |
| `public` | `fn_update_timestamp` | FUNCTION |
| `public` | `gen_random_bytes` | FUNCTION |
| `public` | `gen_random_uuid` | FUNCTION |
| `public` | `gen_salt` | FUNCTION |
| `public` | `gen_salt` | FUNCTION |
| `public` | `geog_brin_inclusion_add_value` | FUNCTION |
| `public` | `geog_brin_inclusion_merge` | FUNCTION |
| `public` | `geography` | FUNCTION |
| `public` | `geography` | FUNCTION |
| `public` | `geography` | FUNCTION |
| `public` | `geography_analyze` | FUNCTION |
| `public` | `geography_cmp` | FUNCTION |
| `public` | `geography_distance_knn` | FUNCTION |
| `public` | `geography_eq` | FUNCTION |
| `public` | `geography_ge` | FUNCTION |
| `public` | `geography_gist_compress` | FUNCTION |
| `public` | `geography_gist_consistent` | FUNCTION |
| `public` | `geography_gist_decompress` | FUNCTION |
| `public` | `geography_gist_distance` | FUNCTION |
| `public` | `geography_gist_penalty` | FUNCTION |
| `public` | `geography_gist_picksplit` | FUNCTION |
| `public` | `geography_gist_same` | FUNCTION |
| `public` | `geography_gist_union` | FUNCTION |
| `public` | `geography_gt` | FUNCTION |
| `public` | `geography_in` | FUNCTION |
| `public` | `geography_le` | FUNCTION |
| `public` | `geography_lt` | FUNCTION |
| `public` | `geography_out` | FUNCTION |
| `public` | `geography_overlaps` | FUNCTION |
| `public` | `geography_recv` | FUNCTION |
| `public` | `geography_send` | FUNCTION |
| `public` | `geography_spgist_choose_nd` | FUNCTION |
| `public` | `geography_spgist_compress_nd` | FUNCTION |
| `public` | `geography_spgist_config_nd` | FUNCTION |
| `public` | `geography_spgist_inner_consistent_nd` | FUNCTION |
| `public` | `geography_spgist_leaf_consistent_nd` | FUNCTION |
| `public` | `geography_spgist_picksplit_nd` | FUNCTION |
| `public` | `geography_typmod_in` | FUNCTION |
| `public` | `geography_typmod_out` | FUNCTION |
| `public` | `geom2d_brin_inclusion_add_value` | FUNCTION |
| `public` | `geom2d_brin_inclusion_merge` | FUNCTION |
| `public` | `geom3d_brin_inclusion_add_value` | FUNCTION |
| `public` | `geom3d_brin_inclusion_merge` | FUNCTION |
| `public` | `geom4d_brin_inclusion_add_value` | FUNCTION |
| `public` | `geom4d_brin_inclusion_merge` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry` | FUNCTION |
| `public` | `geometry_above` | FUNCTION |
| `public` | `geometry_analyze` | FUNCTION |
| `public` | `geometry_below` | FUNCTION |
| `public` | `geometry_cmp` | FUNCTION |
| `public` | `geometry_contained_3d` | FUNCTION |
| `public` | `geometry_contains` | FUNCTION |
| `public` | `geometry_contains_3d` | FUNCTION |
| `public` | `geometry_contains_nd` | FUNCTION |
| `public` | `geometry_distance_box` | FUNCTION |
| `public` | `geometry_distance_centroid` | FUNCTION |
| `public` | `geometry_distance_centroid_nd` | FUNCTION |
| `public` | `geometry_distance_cpa` | FUNCTION |
| `public` | `geometry_eq` | FUNCTION |
| `public` | `geometry_ge` | FUNCTION |
| `public` | `geometry_gist_compress_2d` | FUNCTION |
| `public` | `geometry_gist_compress_nd` | FUNCTION |
| `public` | `geometry_gist_consistent_2d` | FUNCTION |
| `public` | `geometry_gist_consistent_nd` | FUNCTION |
| `public` | `geometry_gist_decompress_2d` | FUNCTION |
| `public` | `geometry_gist_decompress_nd` | FUNCTION |
| `public` | `geometry_gist_distance_2d` | FUNCTION |
| `public` | `geometry_gist_distance_nd` | FUNCTION |
| `public` | `geometry_gist_penalty_2d` | FUNCTION |
| `public` | `geometry_gist_penalty_nd` | FUNCTION |
| `public` | `geometry_gist_picksplit_2d` | FUNCTION |
| `public` | `geometry_gist_picksplit_nd` | FUNCTION |
| `public` | `geometry_gist_same_2d` | FUNCTION |
| `public` | `geometry_gist_same_nd` | FUNCTION |
| `public` | `geometry_gist_sortsupport_2d` | FUNCTION |
| `public` | `geometry_gist_union_2d` | FUNCTION |
| `public` | `geometry_gist_union_nd` | FUNCTION |
| `public` | `geometry_gt` | FUNCTION |
| `public` | `geometry_hash` | FUNCTION |
| `public` | `geometry_in` | FUNCTION |
| `public` | `geometry_le` | FUNCTION |
| `public` | `geometry_left` | FUNCTION |
| `public` | `geometry_lt` | FUNCTION |
| `public` | `geometry_neq` | FUNCTION |
| `public` | `geometry_out` | FUNCTION |
| `public` | `geometry_overabove` | FUNCTION |
| `public` | `geometry_overbelow` | FUNCTION |
| `public` | `geometry_overlaps` | FUNCTION |
| `public` | `geometry_overlaps_3d` | FUNCTION |
| `public` | `geometry_overlaps_nd` | FUNCTION |
| `public` | `geometry_overleft` | FUNCTION |
| `public` | `geometry_overright` | FUNCTION |
| `public` | `geometry_recv` | FUNCTION |
| `public` | `geometry_right` | FUNCTION |
| `public` | `geometry_same` | FUNCTION |
| `public` | `geometry_same_3d` | FUNCTION |
| `public` | `geometry_same_nd` | FUNCTION |
| `public` | `geometry_send` | FUNCTION |
| `public` | `geometry_sortsupport` | FUNCTION |
| `public` | `geometry_spgist_choose_2d` | FUNCTION |
| `public` | `geometry_spgist_choose_3d` | FUNCTION |
| `public` | `geometry_spgist_choose_nd` | FUNCTION |
| `public` | `geometry_spgist_compress_2d` | FUNCTION |
| `public` | `geometry_spgist_compress_3d` | FUNCTION |
| `public` | `geometry_spgist_compress_nd` | FUNCTION |
| `public` | `geometry_spgist_config_2d` | FUNCTION |
| `public` | `geometry_spgist_config_3d` | FUNCTION |
| `public` | `geometry_spgist_config_nd` | FUNCTION |
| `public` | `geometry_spgist_inner_consistent_2d` | FUNCTION |
| `public` | `geometry_spgist_inner_consistent_3d` | FUNCTION |
| `public` | `geometry_spgist_inner_consistent_nd` | FUNCTION |
| `public` | `geometry_spgist_leaf_consistent_2d` | FUNCTION |
| `public` | `geometry_spgist_leaf_consistent_3d` | FUNCTION |
| `public` | `geometry_spgist_leaf_consistent_nd` | FUNCTION |
| `public` | `geometry_spgist_picksplit_2d` | FUNCTION |
| `public` | `geometry_spgist_picksplit_3d` | FUNCTION |
| `public` | `geometry_spgist_picksplit_nd` | FUNCTION |
| `public` | `geometry_typmod_in` | FUNCTION |
| `public` | `geometry_typmod_out` | FUNCTION |
| `public` | `geometry_within` | FUNCTION |
| `public` | `geometry_within_nd` | FUNCTION |
| `public` | `geometrytype` | FUNCTION |
| `public` | `geometrytype` | FUNCTION |
| `public` | `geomfromewkb` | FUNCTION |
| `public` | `geomfromewkt` | FUNCTION |
| `public` | `get_proj4_from_srid` | FUNCTION |
| `public` | `get_telemetry_report` | FUNCTION |
| `public` | `gidx_in` | FUNCTION |
| `public` | `gidx_out` | FUNCTION |
| `public` | `gserialized_gist_joinsel_2d` | FUNCTION |
| `public` | `gserialized_gist_joinsel_nd` | FUNCTION |
| `public` | `gserialized_gist_sel_2d` | FUNCTION |
| `public` | `gserialized_gist_sel_nd` | FUNCTION |
| `public` | `histogram` |  |
| `public` | `hmac` | FUNCTION |
| `public` | `hmac` | FUNCTION |
| `public` | `hypertable_approximate_detailed_size` | FUNCTION |
| `public` | `hypertable_approximate_size` | FUNCTION |
| `public` | `hypertable_columnstore_stats` | FUNCTION |
| `public` | `hypertable_compression_stats` | FUNCTION |
| `public` | `hypertable_detailed_size` | FUNCTION |
| `public` | `hypertable_index_size` | FUNCTION |
| `public` | `hypertable_size` | FUNCTION |
| `public` | `interpolate` | FUNCTION |
| `public` | `interpolate` | FUNCTION |
| `public` | `interpolate` | FUNCTION |
| `public` | `interpolate` | FUNCTION |
| `public` | `interpolate` | FUNCTION |
| `public` | `is_contained_2d` | FUNCTION |
| `public` | `is_contained_2d` | FUNCTION |
| `public` | `is_contained_2d` | FUNCTION |
| `public` | `json` | FUNCTION |
| `public` | `jsonb` | FUNCTION |
| `public` | `last` |  |
| `public` | `locf` | FUNCTION |
| `public` | `merge_chunks` | PROCEDURE |
| `public` | `merge_chunks` | PROCEDURE |
| `public` | `move_chunk` | FUNCTION |
| `public` | `overlaps_2d` | FUNCTION |
| `public` | `overlaps_2d` | FUNCTION |
| `public` | `overlaps_2d` | FUNCTION |
| `public` | `overlaps_geog` | FUNCTION |
| `public` | `overlaps_geog` | FUNCTION |
| `public` | `overlaps_geog` | FUNCTION |
| `public` | `overlaps_nd` | FUNCTION |
| `public` | `overlaps_nd` | FUNCTION |
| `public` | `overlaps_nd` | FUNCTION |
| `public` | `path` | FUNCTION |
| `public` | `pgis_asflatgeobuf_finalfn` | FUNCTION |
| `public` | `pgis_asflatgeobuf_transfn` | FUNCTION |
| `public` | `pgis_asflatgeobuf_transfn` | FUNCTION |
| `public` | `pgis_asflatgeobuf_transfn` | FUNCTION |
| `public` | `pgis_asgeobuf_finalfn` | FUNCTION |
| `public` | `pgis_asgeobuf_transfn` | FUNCTION |
| `public` | `pgis_asgeobuf_transfn` | FUNCTION |
| `public` | `pgis_asmvt_combinefn` | FUNCTION |
| `public` | `pgis_asmvt_deserialfn` | FUNCTION |
| `public` | `pgis_asmvt_finalfn` | FUNCTION |
| `public` | `pgis_asmvt_serialfn` | FUNCTION |
| `public` | `pgis_asmvt_transfn` | FUNCTION |
| `public` | `pgis_asmvt_transfn` | FUNCTION |
| `public` | `pgis_asmvt_transfn` | FUNCTION |
| `public` | `pgis_asmvt_transfn` | FUNCTION |
| `public` | `pgis_asmvt_transfn` | FUNCTION |
| `public` | `pgis_geometry_accum_transfn` | FUNCTION |
| `public` | `pgis_geometry_accum_transfn` | FUNCTION |
| `public` | `pgis_geometry_accum_transfn` | FUNCTION |
| `public` | `pgis_geometry_clusterintersecting_finalfn` | FUNCTION |
| `public` | `pgis_geometry_clusterwithin_finalfn` | FUNCTION |
| `public` | `pgis_geometry_collect_finalfn` | FUNCTION |
| `public` | `pgis_geometry_coverageunion_finalfn` | FUNCTION |
| `public` | `pgis_geometry_makeline_finalfn` | FUNCTION |
| `public` | `pgis_geometry_polygonize_finalfn` | FUNCTION |
| `public` | `pgis_geometry_union_parallel_combinefn` | FUNCTION |
| `public` | `pgis_geometry_union_parallel_deserialfn` | FUNCTION |
| `public` | `pgis_geometry_union_parallel_finalfn` | FUNCTION |
| `public` | `pgis_geometry_union_parallel_serialfn` | FUNCTION |
| `public` | `pgis_geometry_union_parallel_transfn` | FUNCTION |
| `public` | `pgis_geometry_union_parallel_transfn` | FUNCTION |
| `public` | `pgp_armor_headers` | FUNCTION |
| `public` | `pgp_key_id` | FUNCTION |
| `public` | `pgp_pub_decrypt` | FUNCTION |
| `public` | `pgp_pub_decrypt` | FUNCTION |
| `public` | `pgp_pub_decrypt` | FUNCTION |
| `public` | `pgp_pub_decrypt_bytea` | FUNCTION |
| `public` | `pgp_pub_decrypt_bytea` | FUNCTION |
| `public` | `pgp_pub_decrypt_bytea` | FUNCTION |
| `public` | `pgp_pub_encrypt` | FUNCTION |
| `public` | `pgp_pub_encrypt` | FUNCTION |
| `public` | `pgp_pub_encrypt_bytea` | FUNCTION |
| `public` | `pgp_pub_encrypt_bytea` | FUNCTION |
| `public` | `pgp_sym_decrypt` | FUNCTION |
| `public` | `pgp_sym_decrypt` | FUNCTION |
| `public` | `pgp_sym_decrypt_bytea` | FUNCTION |
| `public` | `pgp_sym_decrypt_bytea` | FUNCTION |
| `public` | `pgp_sym_encrypt` | FUNCTION |
| `public` | `pgp_sym_encrypt` | FUNCTION |
| `public` | `pgp_sym_encrypt_bytea` | FUNCTION |
| `public` | `pgp_sym_encrypt_bytea` | FUNCTION |
| `public` | `point` | FUNCTION |
| `public` | `polygon` | FUNCTION |
| `public` | `populate_geometry_columns` | FUNCTION |
| `public` | `populate_geometry_columns` | FUNCTION |
| `public` | `postgis_addbbox` | FUNCTION |
| `public` | `postgis_cache_bbox` | FUNCTION |
| `public` | `postgis_constraint_dims` | FUNCTION |
| `public` | `postgis_constraint_srid` | FUNCTION |
| `public` | `postgis_constraint_type` | FUNCTION |
| `public` | `postgis_dropbbox` | FUNCTION |
| `public` | `postgis_extensions_upgrade` | FUNCTION |
| `public` | `postgis_full_version` | FUNCTION |
| `public` | `postgis_geos_compiled_version` | FUNCTION |
| `public` | `postgis_geos_noop` | FUNCTION |
| `public` | `postgis_geos_version` | FUNCTION |
| `public` | `postgis_getbbox` | FUNCTION |
| `public` | `postgis_hasbbox` | FUNCTION |
| `public` | `postgis_index_supportfn` | FUNCTION |
| `public` | `postgis_lib_build_date` | FUNCTION |
| `public` | `postgis_lib_revision` | FUNCTION |
| `public` | `postgis_lib_version` | FUNCTION |
| `public` | `postgis_libjson_version` | FUNCTION |
| `public` | `postgis_liblwgeom_version` | FUNCTION |
| `public` | `postgis_libprotobuf_version` | FUNCTION |
| `public` | `postgis_libxml_version` | FUNCTION |
| `public` | `postgis_noop` | FUNCTION |
| `public` | `postgis_proj_compiled_version` | FUNCTION |
| `public` | `postgis_proj_version` | FUNCTION |
| `public` | `postgis_scripts_build_date` | FUNCTION |
| `public` | `postgis_scripts_installed` | FUNCTION |
| `public` | `postgis_scripts_released` | FUNCTION |
| `public` | `postgis_srs` | FUNCTION |
| `public` | `postgis_srs_all` | FUNCTION |
| `public` | `postgis_srs_codes` | FUNCTION |
| `public` | `postgis_srs_search` | FUNCTION |
| `public` | `postgis_svn_version` | FUNCTION |
| `public` | `postgis_transform_geometry` | FUNCTION |
| `public` | `postgis_transform_pipeline_geometry` | FUNCTION |
| `public` | `postgis_type_name` | FUNCTION |
| `public` | `postgis_typmod_dims` | FUNCTION |
| `public` | `postgis_typmod_srid` | FUNCTION |
| `public` | `postgis_typmod_type` | FUNCTION |
| `public` | `postgis_version` | FUNCTION |
| `public` | `postgis_wagyu_version` | FUNCTION |
| `public` | `recompress_chunk` | PROCEDURE |
| `public` | `refresh_continuous_aggregate` | PROCEDURE |
| `public` | `remove_columnstore_policy` | PROCEDURE |
| `public` | `remove_compression_policy` | FUNCTION |
| `public` | `remove_continuous_aggregate_policy` | FUNCTION |
| `public` | `remove_process_hypertable_invalidations_policy` | PROCEDURE |
| `public` | `remove_reorder_policy` | FUNCTION |
| `public` | `remove_retention_policy` | FUNCTION |
| `public` | `reorder_chunk` | FUNCTION |
| `public` | `run_job` | PROCEDURE |
| `public` | `set_adaptive_chunking` | FUNCTION |
| `public` | `set_chunk_time_interval` | FUNCTION |
| `public` | `set_integer_now_func` | FUNCTION |
| `public` | `set_number_partitions` | FUNCTION |
| `public` | `set_partitioning_interval` | FUNCTION |
| `public` | `show_chunks` | FUNCTION |
| `public` | `show_tablespaces` | FUNCTION |
| `public` | `spheroid_in` | FUNCTION |
| `public` | `spheroid_out` | FUNCTION |
| `public` | `split_chunk` | PROCEDURE |
| `public` | `st_3dclosestpoint` | FUNCTION |
| `public` | `st_3ddfullywithin` | FUNCTION |
| `public` | `st_3ddistance` | FUNCTION |
| `public` | `st_3ddwithin` | FUNCTION |
| `public` | `st_3dextent` |  |
| `public` | `st_3dintersects` | FUNCTION |
| `public` | `st_3dlength` | FUNCTION |
| `public` | `st_3dlineinterpolatepoint` | FUNCTION |
| `public` | `st_3dlongestline` | FUNCTION |
| `public` | `st_3dmakebox` | FUNCTION |
| `public` | `st_3dmaxdistance` | FUNCTION |
| `public` | `st_3dperimeter` | FUNCTION |
| `public` | `st_3dshortestline` | FUNCTION |
| `public` | `st_addmeasure` | FUNCTION |
| `public` | `st_addpoint` | FUNCTION |
| `public` | `st_addpoint` | FUNCTION |
| `public` | `st_affine` | FUNCTION |
| `public` | `st_affine` | FUNCTION |
| `public` | `st_angle` | FUNCTION |
| `public` | `st_angle` | FUNCTION |
| `public` | `st_area` | FUNCTION |
| `public` | `st_area` | FUNCTION |
| `public` | `st_area` | FUNCTION |
| `public` | `st_area2d` | FUNCTION |
| `public` | `st_asbinary` | FUNCTION |
| `public` | `st_asbinary` | FUNCTION |
| `public` | `st_asbinary` | FUNCTION |
| `public` | `st_asbinary` | FUNCTION |
| `public` | `st_asencodedpolyline` | FUNCTION |
| `public` | `st_asewkb` | FUNCTION |
| `public` | `st_asewkb` | FUNCTION |
| `public` | `st_asewkt` | FUNCTION |
| `public` | `st_asewkt` | FUNCTION |
| `public` | `st_asewkt` | FUNCTION |
| `public` | `st_asewkt` | FUNCTION |
| `public` | `st_asewkt` | FUNCTION |
| `public` | `st_asflatgeobuf` |  |
| `public` | `st_asflatgeobuf` |  |
| `public` | `st_asflatgeobuf` |  |
| `public` | `st_asgeobuf` |  |
| `public` | `st_asgeobuf` |  |
| `public` | `st_asgeojson` | FUNCTION |
| `public` | `st_asgeojson` | FUNCTION |
| `public` | `st_asgeojson` | FUNCTION |
| `public` | `st_asgeojson` | FUNCTION |
| `public` | `st_asgml` | FUNCTION |
| `public` | `st_asgml` | FUNCTION |
| `public` | `st_asgml` | FUNCTION |
| `public` | `st_asgml` | FUNCTION |
| `public` | `st_asgml` | FUNCTION |
| `public` | `st_ashexewkb` | FUNCTION |
| `public` | `st_ashexewkb` | FUNCTION |
| `public` | `st_askml` | FUNCTION |
| `public` | `st_askml` | FUNCTION |
| `public` | `st_askml` | FUNCTION |
| `public` | `st_aslatlontext` | FUNCTION |
| `public` | `st_asmarc21` | FUNCTION |
| `public` | `st_asmvt` |  |
| `public` | `st_asmvt` |  |
| `public` | `st_asmvt` |  |
| `public` | `st_asmvt` |  |
| `public` | `st_asmvt` |  |
| `public` | `st_asmvtgeom` | FUNCTION |
| `public` | `st_assvg` | FUNCTION |
| `public` | `st_assvg` | FUNCTION |
| `public` | `st_assvg` | FUNCTION |
| `public` | `st_astext` | FUNCTION |
| `public` | `st_astext` | FUNCTION |
| `public` | `st_astext` | FUNCTION |
| `public` | `st_astext` | FUNCTION |
| `public` | `st_astext` | FUNCTION |
| `public` | `st_astwkb` | FUNCTION |
| `public` | `st_astwkb` | FUNCTION |
| `public` | `st_asx3d` | FUNCTION |
| `public` | `st_azimuth` | FUNCTION |
| `public` | `st_azimuth` | FUNCTION |
| `public` | `st_bdmpolyfromtext` | FUNCTION |
| `public` | `st_bdpolyfromtext` | FUNCTION |
| `public` | `st_boundary` | FUNCTION |
| `public` | `st_boundingdiagonal` | FUNCTION |
| `public` | `st_box2dfromgeohash` | FUNCTION |
| `public` | `st_buffer` | FUNCTION |
| `public` | `st_buffer` | FUNCTION |
| `public` | `st_buffer` | FUNCTION |
| `public` | `st_buffer` | FUNCTION |
| `public` | `st_buffer` | FUNCTION |
| `public` | `st_buffer` | FUNCTION |
| `public` | `st_buffer` | FUNCTION |
| `public` | `st_buffer` | FUNCTION |
| `public` | `st_buildarea` | FUNCTION |
| `public` | `st_centroid` | FUNCTION |
| `public` | `st_centroid` | FUNCTION |
| `public` | `st_centroid` | FUNCTION |
| `public` | `st_chaikinsmoothing` | FUNCTION |
| `public` | `st_cleangeometry` | FUNCTION |
| `public` | `st_clipbybox2d` | FUNCTION |
| `public` | `st_closestpoint` | FUNCTION |
| `public` | `st_closestpoint` | FUNCTION |
| `public` | `st_closestpoint` | FUNCTION |
| `public` | `st_closestpointofapproach` | FUNCTION |
| `public` | `st_clusterdbscan` |  |
| `public` | `st_clusterintersecting` |  |
| `public` | `st_clusterintersecting` | FUNCTION |
| `public` | `st_clusterintersectingwin` |  |
| `public` | `st_clusterkmeans` |  |
| `public` | `st_clusterwithin` | FUNCTION |
| `public` | `st_clusterwithin` |  |
| `public` | `st_clusterwithinwin` |  |
| `public` | `st_collect` |  |
| `public` | `st_collect` | FUNCTION |
| `public` | `st_collect` | FUNCTION |
| `public` | `st_collectionextract` | FUNCTION |
| `public` | `st_collectionextract` | FUNCTION |
| `public` | `st_collectionhomogenize` | FUNCTION |
| `public` | `st_combinebbox` | FUNCTION |
| `public` | `st_combinebbox` | FUNCTION |
| `public` | `st_combinebbox` | FUNCTION |
| `public` | `st_concavehull` | FUNCTION |
| `public` | `st_contains` | FUNCTION |
| `public` | `st_containsproperly` | FUNCTION |
| `public` | `st_convexhull` | FUNCTION |
| `public` | `st_coorddim` | FUNCTION |
| `public` | `st_coverageinvalidedges` |  |
| `public` | `st_coveragesimplify` |  |
| `public` | `st_coverageunion` |  |
| `public` | `st_coverageunion` | FUNCTION |
| `public` | `st_coveredby` | FUNCTION |
| `public` | `st_coveredby` | FUNCTION |
| `public` | `st_coveredby` | FUNCTION |
| `public` | `st_covers` | FUNCTION |
| `public` | `st_covers` | FUNCTION |
| `public` | `st_covers` | FUNCTION |
| `public` | `st_cpawithin` | FUNCTION |
| `public` | `st_crosses` | FUNCTION |
| `public` | `st_curven` | FUNCTION |
| `public` | `st_curvetoline` | FUNCTION |
| `public` | `st_delaunaytriangles` | FUNCTION |
| `public` | `st_dfullywithin` | FUNCTION |
| `public` | `st_difference` | FUNCTION |
| `public` | `st_dimension` | FUNCTION |
| `public` | `st_disjoint` | FUNCTION |
| `public` | `st_distance` | FUNCTION |
| `public` | `st_distance` | FUNCTION |
| `public` | `st_distance` | FUNCTION |
| `public` | `st_distancecpa` | FUNCTION |
| `public` | `st_distancesphere` | FUNCTION |
| `public` | `st_distancesphere` | FUNCTION |
| `public` | `st_distancespheroid` | FUNCTION |
| `public` | `st_distancespheroid` | FUNCTION |
| `public` | `st_dump` | FUNCTION |
| `public` | `st_dumppoints` | FUNCTION |
| `public` | `st_dumprings` | FUNCTION |
| `public` | `st_dumpsegments` | FUNCTION |
| `public` | `st_dwithin` | FUNCTION |
| `public` | `st_dwithin` | FUNCTION |
| `public` | `st_dwithin` | FUNCTION |
| `public` | `st_endpoint` | FUNCTION |
| `public` | `st_envelope` | FUNCTION |
| `public` | `st_equals` | FUNCTION |
| `public` | `st_estimatedextent` | FUNCTION |
| `public` | `st_estimatedextent` | FUNCTION |
| `public` | `st_estimatedextent` | FUNCTION |
| `public` | `st_expand` | FUNCTION |
| `public` | `st_expand` | FUNCTION |
| `public` | `st_expand` | FUNCTION |
| `public` | `st_expand` | FUNCTION |
| `public` | `st_expand` | FUNCTION |
| `public` | `st_expand` | FUNCTION |
| `public` | `st_extent` |  |
| `public` | `st_exteriorring` | FUNCTION |
| `public` | `st_filterbym` | FUNCTION |
| `public` | `st_findextent` | FUNCTION |
| `public` | `st_findextent` | FUNCTION |
| `public` | `st_flipcoordinates` | FUNCTION |
| `public` | `st_force2d` | FUNCTION |
| `public` | `st_force3d` | FUNCTION |
| `public` | `st_force3dm` | FUNCTION |
| `public` | `st_force3dz` | FUNCTION |
| `public` | `st_force4d` | FUNCTION |
| `public` | `st_forcecollection` | FUNCTION |
| `public` | `st_forcecurve` | FUNCTION |
| `public` | `st_forcepolygonccw` | FUNCTION |
| `public` | `st_forcepolygoncw` | FUNCTION |
| `public` | `st_forcerhr` | FUNCTION |
| `public` | `st_forcesfs` | FUNCTION |
| `public` | `st_forcesfs` | FUNCTION |
| `public` | `st_frechetdistance` | FUNCTION |
| `public` | `st_fromflatgeobuf` | FUNCTION |
| `public` | `st_fromflatgeobuftotable` | FUNCTION |
| `public` | `st_generatepoints` | FUNCTION |
| `public` | `st_generatepoints` | FUNCTION |
| `public` | `st_geogfromtext` | FUNCTION |
| `public` | `st_geogfromwkb` | FUNCTION |
| `public` | `st_geographyfromtext` | FUNCTION |
| `public` | `st_geohash` | FUNCTION |
| `public` | `st_geohash` | FUNCTION |
| `public` | `st_geomcollfromtext` | FUNCTION |
| `public` | `st_geomcollfromtext` | FUNCTION |
| `public` | `st_geomcollfromwkb` | FUNCTION |
| `public` | `st_geomcollfromwkb` | FUNCTION |
| `public` | `st_geometricmedian` | FUNCTION |
| `public` | `st_geometryfromtext` | FUNCTION |
| `public` | `st_geometryfromtext` | FUNCTION |
| `public` | `st_geometryn` | FUNCTION |
| `public` | `st_geometrytype` | FUNCTION |
| `public` | `st_geomfromewkb` | FUNCTION |
| `public` | `st_geomfromewkt` | FUNCTION |
| `public` | `st_geomfromgeohash` | FUNCTION |
| `public` | `st_geomfromgeojson` | FUNCTION |
| `public` | `st_geomfromgeojson` | FUNCTION |
| `public` | `st_geomfromgeojson` | FUNCTION |
| `public` | `st_geomfromgml` | FUNCTION |
| `public` | `st_geomfromgml` | FUNCTION |
| `public` | `st_geomfromkml` | FUNCTION |
| `public` | `st_geomfrommarc21` | FUNCTION |
| `public` | `st_geomfromtext` | FUNCTION |
| `public` | `st_geomfromtext` | FUNCTION |
| `public` | `st_geomfromtwkb` | FUNCTION |
| `public` | `st_geomfromwkb` | FUNCTION |
| `public` | `st_geomfromwkb` | FUNCTION |
| `public` | `st_gmltosql` | FUNCTION |
| `public` | `st_gmltosql` | FUNCTION |
| `public` | `st_hasarc` | FUNCTION |
| `public` | `st_hasm` | FUNCTION |
| `public` | `st_hasz` | FUNCTION |
| `public` | `st_hausdorffdistance` | FUNCTION |
| `public` | `st_hausdorffdistance` | FUNCTION |
| `public` | `st_hexagon` | FUNCTION |
| `public` | `st_hexagongrid` | FUNCTION |
| `public` | `st_interiorringn` | FUNCTION |
| `public` | `st_interpolatepoint` | FUNCTION |
| `public` | `st_intersection` | FUNCTION |
| `public` | `st_intersection` | FUNCTION |
| `public` | `st_intersection` | FUNCTION |
| `public` | `st_intersects` | FUNCTION |
| `public` | `st_intersects` | FUNCTION |
| `public` | `st_intersects` | FUNCTION |
| `public` | `st_inversetransformpipeline` | FUNCTION |
| `public` | `st_isclosed` | FUNCTION |
| `public` | `st_iscollection` | FUNCTION |
| `public` | `st_isempty` | FUNCTION |
| `public` | `st_ispolygonccw` | FUNCTION |
| `public` | `st_ispolygoncw` | FUNCTION |
| `public` | `st_isring` | FUNCTION |
| `public` | `st_issimple` | FUNCTION |
| `public` | `st_isvalid` | FUNCTION |
| `public` | `st_isvalid` | FUNCTION |
| `public` | `st_isvaliddetail` | FUNCTION |
| `public` | `st_isvalidreason` | FUNCTION |
| `public` | `st_isvalidreason` | FUNCTION |
| `public` | `st_isvalidtrajectory` | FUNCTION |
| `public` | `st_largestemptycircle` | FUNCTION |
| `public` | `st_length` | FUNCTION |
| `public` | `st_length` | FUNCTION |
| `public` | `st_length` | FUNCTION |
| `public` | `st_length2d` | FUNCTION |
| `public` | `st_length2dspheroid` | FUNCTION |
| `public` | `st_lengthspheroid` | FUNCTION |
| `public` | `st_letters` | FUNCTION |
| `public` | `st_linecrossingdirection` | FUNCTION |
| `public` | `st_lineextend` | FUNCTION |
| `public` | `st_linefromencodedpolyline` | FUNCTION |
| `public` | `st_linefrommultipoint` | FUNCTION |
| `public` | `st_linefromtext` | FUNCTION |
| `public` | `st_linefromtext` | FUNCTION |
| `public` | `st_linefromwkb` | FUNCTION |
| `public` | `st_linefromwkb` | FUNCTION |
| `public` | `st_lineinterpolatepoint` | FUNCTION |
| `public` | `st_lineinterpolatepoint` | FUNCTION |
| `public` | `st_lineinterpolatepoint` | FUNCTION |
| `public` | `st_lineinterpolatepoints` | FUNCTION |
| `public` | `st_lineinterpolatepoints` | FUNCTION |
| `public` | `st_lineinterpolatepoints` | FUNCTION |
| `public` | `st_linelocatepoint` | FUNCTION |
| `public` | `st_linelocatepoint` | FUNCTION |
| `public` | `st_linelocatepoint` | FUNCTION |
| `public` | `st_linemerge` | FUNCTION |
| `public` | `st_linemerge` | FUNCTION |
| `public` | `st_linestringfromwkb` | FUNCTION |
| `public` | `st_linestringfromwkb` | FUNCTION |
| `public` | `st_linesubstring` | FUNCTION |
| `public` | `st_linesubstring` | FUNCTION |
| `public` | `st_linesubstring` | FUNCTION |
| `public` | `st_linetocurve` | FUNCTION |
| `public` | `st_locatealong` | FUNCTION |
| `public` | `st_locatebetween` | FUNCTION |
| `public` | `st_locatebetweenelevations` | FUNCTION |
| `public` | `st_longestline` | FUNCTION |
| `public` | `st_m` | FUNCTION |
| `public` | `st_makebox2d` | FUNCTION |
| `public` | `st_makeenvelope` | FUNCTION |
| `public` | `st_makeline` | FUNCTION |
| `public` | `st_makeline` | FUNCTION |
| `public` | `st_makeline` |  |
| `public` | `st_makepoint` | FUNCTION |
| `public` | `st_makepoint` | FUNCTION |
| `public` | `st_makepoint` | FUNCTION |
| `public` | `st_makepointm` | FUNCTION |
| `public` | `st_makepolygon` | FUNCTION |
| `public` | `st_makepolygon` | FUNCTION |
| `public` | `st_makevalid` | FUNCTION |
| `public` | `st_makevalid` | FUNCTION |
| `public` | `st_maxdistance` | FUNCTION |
| `public` | `st_maximuminscribedcircle` | FUNCTION |
| `public` | `st_memcollect` |  |
| `public` | `st_memsize` | FUNCTION |
| `public` | `st_memunion` |  |
| `public` | `st_minimumboundingcircle` | FUNCTION |
| `public` | `st_minimumboundingradius` | FUNCTION |
| `public` | `st_minimumclearance` | FUNCTION |
| `public` | `st_minimumclearanceline` | FUNCTION |
| `public` | `st_mlinefromtext` | FUNCTION |
| `public` | `st_mlinefromtext` | FUNCTION |
| `public` | `st_mlinefromwkb` | FUNCTION |
| `public` | `st_mlinefromwkb` | FUNCTION |
| `public` | `st_mpointfromtext` | FUNCTION |
| `public` | `st_mpointfromtext` | FUNCTION |
| `public` | `st_mpointfromwkb` | FUNCTION |
| `public` | `st_mpointfromwkb` | FUNCTION |
| `public` | `st_mpolyfromtext` | FUNCTION |
| `public` | `st_mpolyfromtext` | FUNCTION |
| `public` | `st_mpolyfromwkb` | FUNCTION |
| `public` | `st_mpolyfromwkb` | FUNCTION |
| `public` | `st_multi` | FUNCTION |
| `public` | `st_multilinefromwkb` | FUNCTION |
| `public` | `st_multilinestringfromtext` | FUNCTION |
| `public` | `st_multilinestringfromtext` | FUNCTION |
| `public` | `st_multipointfromtext` | FUNCTION |
| `public` | `st_multipointfromwkb` | FUNCTION |
| `public` | `st_multipointfromwkb` | FUNCTION |
| `public` | `st_multipolyfromwkb` | FUNCTION |
| `public` | `st_multipolyfromwkb` | FUNCTION |
| `public` | `st_multipolygonfromtext` | FUNCTION |
| `public` | `st_multipolygonfromtext` | FUNCTION |
| `public` | `st_ndims` | FUNCTION |
| `public` | `st_node` | FUNCTION |
| `public` | `st_normalize` | FUNCTION |
| `public` | `st_npoints` | FUNCTION |
| `public` | `st_nrings` | FUNCTION |
| `public` | `st_numcurves` | FUNCTION |
| `public` | `st_numgeometries` | FUNCTION |
| `public` | `st_numinteriorring` | FUNCTION |
| `public` | `st_numinteriorrings` | FUNCTION |
| `public` | `st_numpatches` | FUNCTION |
| `public` | `st_numpoints` | FUNCTION |
| `public` | `st_offsetcurve` | FUNCTION |
| `public` | `st_orderingequals` | FUNCTION |
| `public` | `st_orientedenvelope` | FUNCTION |
| `public` | `st_overlaps` | FUNCTION |
| `public` | `st_patchn` | FUNCTION |
| `public` | `st_perimeter` | FUNCTION |
| `public` | `st_perimeter` | FUNCTION |
| `public` | `st_perimeter2d` | FUNCTION |
| `public` | `st_point` | FUNCTION |
| `public` | `st_point` | FUNCTION |
| `public` | `st_pointfromgeohash` | FUNCTION |
| `public` | `st_pointfromtext` | FUNCTION |
| `public` | `st_pointfromtext` | FUNCTION |
| `public` | `st_pointfromwkb` | FUNCTION |
| `public` | `st_pointfromwkb` | FUNCTION |
| `public` | `st_pointinsidecircle` | FUNCTION |
| `public` | `st_pointm` | FUNCTION |
| `public` | `st_pointn` | FUNCTION |
| `public` | `st_pointonsurface` | FUNCTION |
| `public` | `st_points` | FUNCTION |
| `public` | `st_pointz` | FUNCTION |
| `public` | `st_pointzm` | FUNCTION |
| `public` | `st_polyfromtext` | FUNCTION |
| `public` | `st_polyfromtext` | FUNCTION |
| `public` | `st_polyfromwkb` | FUNCTION |
| `public` | `st_polyfromwkb` | FUNCTION |
| `public` | `st_polygon` | FUNCTION |
| `public` | `st_polygonfromtext` | FUNCTION |
| `public` | `st_polygonfromtext` | FUNCTION |
| `public` | `st_polygonfromwkb` | FUNCTION |
| `public` | `st_polygonfromwkb` | FUNCTION |
| `public` | `st_polygonize` |  |
| `public` | `st_polygonize` | FUNCTION |
| `public` | `st_project` | FUNCTION |
| `public` | `st_project` | FUNCTION |
| `public` | `st_project` | FUNCTION |
| `public` | `st_project` | FUNCTION |
| `public` | `st_quantizecoordinates` | FUNCTION |
| `public` | `st_reduceprecision` | FUNCTION |
| `public` | `st_relate` | FUNCTION |
| `public` | `st_relate` | FUNCTION |
| `public` | `st_relate` | FUNCTION |
| `public` | `st_relatematch` | FUNCTION |
| `public` | `st_removeirrelevantpointsforview` | FUNCTION |
| `public` | `st_removepoint` | FUNCTION |
| `public` | `st_removerepeatedpoints` | FUNCTION |
| `public` | `st_removesmallparts` | FUNCTION |
| `public` | `st_reverse` | FUNCTION |
| `public` | `st_rotate` | FUNCTION |
| `public` | `st_rotate` | FUNCTION |
| `public` | `st_rotate` | FUNCTION |
| `public` | `st_rotatex` | FUNCTION |
| `public` | `st_rotatey` | FUNCTION |
| `public` | `st_rotatez` | FUNCTION |
| `public` | `st_scale` | FUNCTION |
| `public` | `st_scale` | FUNCTION |
| `public` | `st_scale` | FUNCTION |
| `public` | `st_scale` | FUNCTION |
| `public` | `st_scroll` | FUNCTION |
| `public` | `st_segmentize` | FUNCTION |
| `public` | `st_segmentize` | FUNCTION |
| `public` | `st_seteffectivearea` | FUNCTION |
| `public` | `st_setpoint` | FUNCTION |
| `public` | `st_setsrid` | FUNCTION |
| `public` | `st_setsrid` | FUNCTION |
| `public` | `st_sharedpaths` | FUNCTION |
| `public` | `st_shiftlongitude` | FUNCTION |
| `public` | `st_shortestline` | FUNCTION |
| `public` | `st_shortestline` | FUNCTION |
| `public` | `st_shortestline` | FUNCTION |
| `public` | `st_simplify` | FUNCTION |
| `public` | `st_simplify` | FUNCTION |
| `public` | `st_simplifypolygonhull` | FUNCTION |
| `public` | `st_simplifypreservetopology` | FUNCTION |
| `public` | `st_simplifyvw` | FUNCTION |
| `public` | `st_snap` | FUNCTION |
| `public` | `st_snaptogrid` | FUNCTION |
| `public` | `st_snaptogrid` | FUNCTION |
| `public` | `st_snaptogrid` | FUNCTION |
| `public` | `st_snaptogrid` | FUNCTION |
| `public` | `st_split` | FUNCTION |
| `public` | `st_square` | FUNCTION |
| `public` | `st_squaregrid` | FUNCTION |
| `public` | `st_srid` | FUNCTION |
| `public` | `st_srid` | FUNCTION |
| `public` | `st_startpoint` | FUNCTION |
| `public` | `st_subdivide` | FUNCTION |
| `public` | `st_summary` | FUNCTION |
| `public` | `st_summary` | FUNCTION |
| `public` | `st_swapordinates` | FUNCTION |
| `public` | `st_symdifference` | FUNCTION |
| `public` | `st_symmetricdifference` | FUNCTION |
| `public` | `st_tileenvelope` | FUNCTION |
| `public` | `st_touches` | FUNCTION |
| `public` | `st_transform` | FUNCTION |
| `public` | `st_transform` | FUNCTION |
| `public` | `st_transform` | FUNCTION |
| `public` | `st_transform` | FUNCTION |
| `public` | `st_transformpipeline` | FUNCTION |
| `public` | `st_translate` | FUNCTION |
| `public` | `st_translate` | FUNCTION |
| `public` | `st_transscale` | FUNCTION |
| `public` | `st_triangulatepolygon` | FUNCTION |
| `public` | `st_unaryunion` | FUNCTION |
| `public` | `st_union` |  |
| `public` | `st_union` |  |
| `public` | `st_union` | FUNCTION |
| `public` | `st_union` | FUNCTION |
| `public` | `st_union` | FUNCTION |
| `public` | `st_voronoilines` | FUNCTION |
| `public` | `st_voronoipolygons` | FUNCTION |
| `public` | `st_within` | FUNCTION |
| `public` | `st_wkbtosql` | FUNCTION |
| `public` | `st_wkttosql` | FUNCTION |
| `public` | `st_wrapx` | FUNCTION |
| `public` | `st_x` | FUNCTION |
| `public` | `st_xmax` | FUNCTION |
| `public` | `st_xmin` | FUNCTION |
| `public` | `st_y` | FUNCTION |
| `public` | `st_ymax` | FUNCTION |
| `public` | `st_ymin` | FUNCTION |
| `public` | `st_z` | FUNCTION |
| `public` | `st_zmax` | FUNCTION |
| `public` | `st_zmflag` | FUNCTION |
| `public` | `st_zmin` | FUNCTION |
| `public` | `text` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket` | FUNCTION |
| `public` | `time_bucket_gapfill` | FUNCTION |
| `public` | `time_bucket_gapfill` | FUNCTION |
| `public` | `time_bucket_gapfill` | FUNCTION |
| `public` | `time_bucket_gapfill` | FUNCTION |
| `public` | `time_bucket_gapfill` | FUNCTION |
| `public` | `time_bucket_gapfill` | FUNCTION |
| `public` | `time_bucket_gapfill` | FUNCTION |
| `public` | `timescaledb_post_restore` | FUNCTION |
| `public` | `timescaledb_pre_restore` | FUNCTION |
| `public` | `updategeometrysrid` | FUNCTION |
| `public` | `updategeometrysrid` | FUNCTION |
| `public` | `updategeometrysrid` | FUNCTION |
| `public` | `uuid_generate_v1` | FUNCTION |
| `public` | `uuid_generate_v1mc` | FUNCTION |
| `public` | `uuid_generate_v3` | FUNCTION |
| `public` | `uuid_generate_v4` | FUNCTION |
| `public` | `uuid_generate_v5` | FUNCTION |
| `public` | `uuid_nil` | FUNCTION |
| `public` | `uuid_ns_dns` | FUNCTION |
| `public` | `uuid_ns_oid` | FUNCTION |
| `public` | `uuid_ns_url` | FUNCTION |
| `public` | `uuid_ns_x500` | FUNCTION |
| `qualite` | `fn_mesure_qualite_barrage_apply_qa` | FUNCTION |
| `qualite` | `fn_mesure_qualite_nappe_apply_qa` | FUNCTION |
| `qualite` | `fn_mesure_qualite_riviere_apply_qa` | FUNCTION |
| `qualite` | `fn_mesure_qualite_sebou_apply_qa` | FUNCTION |
| `qualite` | `fn_source_pollution_mesure_param_apply_qa` | FUNCTION |
| `qualite` | `fn_source_pollution_prelevement_apply_qa` | FUNCTION |
| `qualite` | `fn_suivi_qualite_barrage_hebdo_apply_qa` | FUNCTION |
| `security` | `fn_trigger_audit` | FUNCTION |

## 6. Détail par schéma et par objet

### Schéma `admin`

Référentiels administratifs et découpages territoriaux.

#### Objet `admin.cercle`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `admin` utilisée par le SAD. |
| Lignes estimées | 61 |
| Taille | 2960 kB |
| PK | `code_cercle` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `code_cercle` | text | NO | Code métier ou identifiant source. |
| `cercle_fr` | text | YES | Attribut métier ou technique du modèle. |
| `cercle_ar` | text | YES | Attribut métier ou technique du modèle. |
| `code_province` | text | YES | Code métier ou identifiant source. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_province` -> `admin.provinces.code_province`
- Consommateurs identifiés : `api.viz_carto_layers`

Index :
- `adm_cercles_abhs_pkey`
- `idx_admin_cercle_geom_gist_b793cad7`

#### Objet `admin.communes`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `admin` utilisée par le SAD. |
| Lignes estimées | 346 |
| Taille | 5784 kB |
| PK | `code_commune` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `code_region` | text | YES | Code métier ou identifiant source. |
| `region_fr` | text | YES | Attribut métier ou technique du modèle. |
| `region_ar` | text | YES | Attribut métier ou technique du modèle. |
| `code_province` | text | YES | Code métier ou identifiant source. |
| `province_fr` | text | YES | Attribut métier ou technique du modèle. |
| `province_ar` | text | YES | Attribut métier ou technique du modèle. |
| `code_cercle` | text | YES | Code métier ou identifiant source. |
| `cercle_fr` | text | YES | Attribut métier ou technique du modèle. |
| `cercle_ar` | text | YES | Attribut métier ou technique du modèle. |
| `code_commune` | text | NO | Code métier ou identifiant source. |
| `commune_fr` | text | YES | Attribut métier ou technique du modèle. |
| `commune_ar` | text | YES | Attribut métier ou technique du modèle. |
| `milieu` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_cercle` -> `admin.cercle.code_cercle`
- Consommateurs identifiés : `api.v_inventaire_pollution_stms_detail`, `api.viz_carto_layers`

Index :
- `communes_abhs_new_pkey`
- `idx_admin_communes_geom_gist_a51b090b`

#### Objet `admin.localite`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `admin` utilisée par le SAD. |
| Lignes estimées | 6013 |
| Taille | 1560 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `code_commu` | character varying | YES | Code métier ou identifiant source. |
| `code_douar` | character varying | YES | Code métier ou identifiant source. |
| `douar_fr` | character varying | YES | Attribut métier ou technique du modèle. |
| `douar_ar` | character varying | YES | Attribut métier ou technique du modèle. |
| `coord_x` | numeric | YES | Attribut métier ou technique du modèle. |
| `coord_y` | numeric | YES | Attribut métier ou technique du modèle. |
| `code_regio` | character varying | YES | Code métier ou identifiant source. |
| `region_fr` | character varying | YES | Attribut métier ou technique du modèle. |
| `code_provi` | character varying | YES | Code métier ou identifiant source. |
| `province_f` | character varying | YES | Attribut métier ou technique du modèle. |
| `code_cercl` | character varying | YES | Code métier ou identifiant source. |
| `cercle_fr` | character varying | YES | Attribut métier ou technique du modèle. |
| `commune_fr` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.viz_carto_layers`

Index :
- `idx_admin_localite_geom_gist_d22b4c09`
- `localite_pkey`

#### Objet `admin.provinces`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `admin` utilisée par le SAD. |
| Lignes estimées | 21 |
| Taille | 1928 kB |
| PK | `code_province` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `code_region` | text | YES | Code métier ou identifiant source. |
| `code_province` | text | NO | Code métier ou identifiant source. |
| `province_fr` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_region` -> `admin.regions.code_region`
- Consommateurs identifiés : `api.viz_carto_layers`

Index :
- `adm_provinces_abhs_pkey`
- `idx_admin_provinces_geom_gist_044a261d`

#### Objet `admin.regions`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `admin` utilisée par le SAD. |
| Lignes estimées | 6 |
| Taille | 1256 kB |
| PK | `code_region` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `code_region` | text | NO | Code métier ou identifiant source. |
| `region_fr` | text | YES | Attribut métier ou technique du modèle. |
| `region_ar` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.viz_carto_layers`

Index :
- `adm_regions_abhs_pkey`
- `idx_admin_regions_geom_gist_50818664`

### Schéma `analytics`

Agrégats et menus de performance pour les dashboards.

#### Objet `analytics.mv_dashboard_climat_meteo_menu`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Menu et agrégats du dashboard climat et météo. |
| Lignes estimées | 110344 |
| Taille | 53 MB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_dashboard_climat_meteo_menu_date`
- `idx_mv_dashboard_climat_meteo_menu_geom`
- `idx_mv_dashboard_climat_meteo_menu_scenario`
- `idx_mv_dashboard_climat_meteo_menu_site`
- `idx_mv_dashboard_climat_meteo_menu_submenu`
- `idx_mv_dashboard_climat_meteo_menu_uk`
- `idx_mv_dashboard_climat_meteo_menu_variable`

#### Objet `analytics.mv_dashboard_hydrologie_menu`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Menu et agrégats du dashboard hydrologique. |
| Lignes estimées | 640046 |
| Taille | 281 MB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_dashboard_hydrologie_menu_date`
- `idx_mv_dashboard_hydrologie_menu_geom`
- `idx_mv_dashboard_hydrologie_menu_scenario`
- `idx_mv_dashboard_hydrologie_menu_site`
- `idx_mv_dashboard_hydrologie_menu_submenu`
- `idx_mv_dashboard_hydrologie_menu_uk`
- `idx_mv_dashboard_hydrologie_menu_variable`

#### Objet `analytics.mv_dashboard_pollution_menu`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Menu et agrégats du dashboard pollution. |
| Lignes estimées | 165684 |
| Taille | 81 MB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_dashboard_pollution_menu_date`
- `idx_mv_dashboard_pollution_menu_scenario`
- `idx_mv_dashboard_pollution_menu_site`
- `idx_mv_dashboard_pollution_menu_submenu`
- `idx_mv_dashboard_pollution_menu_uk`
- `idx_mv_dashboard_pollution_menu_variable`

### Schéma `api`

Couche d'exposition SQL consommée par le backend et le frontend.

#### Objet `api.ca_hydro_debit_source_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 2677 |
| Taille | 520 kB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_ca_hydro_debit_source_day_sid_day`

#### Objet `api.ca_meteo_evaporation_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 48900 |
| Taille | 9168 kB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | climat |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_ca_meteo_evapo_day_station_day`

#### Objet `api.ca_meteo_precip_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 546007 |
| Taille | 87 MB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | climat |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_ca_meteo_precip_day_station_day`

#### Objet `api.mv_admin_villes_points`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 280 |
| Taille | 104 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_admin_villes_points_code_commune`
- `idx_mv_admin_villes_points_geom_gist`
- `idx_mv_admin_villes_points_id`

#### Objet `api.mv_barrage_dimension`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue matérialisée de dimension barrage pour les parcours hydrologiques. |
| Lignes estimées | 11 |
| Taille | 48 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_barrage_dimension_barrage_id`
- `idx_mv_barrage_dimension_geom_gist`

#### Objet `api.mv_bassin_geojson`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue matérialisée GeoJSON du bassin versant. |
| Lignes estimées | 1 |
| Taille | 72 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_bassin_geojson_id`

#### Objet `api.mv_hierarchie_metier_listing`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 219 |
| Taille | 112 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_hierarchie_param`
- `idx_mv_hierarchie_theme`
- `idx_mv_hierarchie_theme_sous_menu`

#### Objet `api.mv_hydro_debit_day_qa`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 521433 |
| Taille | 91 MB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_hydro_debit_day_qa_station_day`

#### Objet `api.mv_hydro_debit_mensuel`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 19316 |
| Taille | 5944 kB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_hydro_debit_mensuel_station_month`

#### Objet `api.mv_meteo_precipitation_annuelle_max`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 2085 |
| Taille | 400 kB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | climat |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_precip_ann_max_station_year`

#### Objet `api.mv_nappes_geojson`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 17 |
| Taille | 160 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_nappes_geojson_id`

#### Objet `api.mv_points_eau`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 46 |
| Taille | 56 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_points_eau_geom_gist`
- `idx_mv_points_eau_point_eau_id`

#### Objet `api.mv_qualite_barrages_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 7830 |
| Taille | 1720 kB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_qbar_day_station_param_day`

#### Objet `api.mv_qualite_nappes_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 63083 |
| Taille | 14 MB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_qnap_day_station_param_day`

#### Objet `api.mv_qualite_riviere_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 60075 |
| Taille | 13 MB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_qualite_riviere_day_station_param_day`

#### Objet `api.mv_qualite_sebou_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 51402 |
| Taille | 10 MB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_qualite_sebou_day_station_param_day`

#### Objet `api.mv_reseau_hydrographique`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue matérialisée du réseau hydrographique. |
| Lignes estimées | 697 |
| Taille | 1640 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_reseau_hydrographique_geom_gist`

#### Objet `api.mv_sources_geojson`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 135 |
| Taille | 64 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_sources_geojson_id`

#### Objet `api.mv_sous_bassin_geojson`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue matérialisée GeoJSON des sous-bassins ABH. |
| Lignes estimées | 15 |
| Taille | 2184 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_sous_bassin_geojson_id`

#### Objet `api.mv_sous_bassin_swat_geojson`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 174 |
| Taille | 5328 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_sous_bassin_swat_geojson_id`
- `idx_mv_sous_bassin_swat_geojson_sub`

#### Objet `api.mv_sous_bassin_swat_geom_4326`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 174 |
| Taille | 5976 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_sous_bassin_swat_geom_4326_geom`
- `idx_mv_sous_bassin_swat_geom_4326_name`
- `idx_mv_sous_bassin_swat_geom_4326_subbasin`

#### Objet `api.mv_station_dimension`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue matérialisée de dimension station utilisée dans les filtres, cartes et jointures métier. |
| Lignes estimées | 390 |
| Taille | 232 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_station_dimension_code_station`
- `idx_mv_station_dimension_geom_gist`
- `idx_mv_station_dimension_station_id`

#### Objet `api.mv_suivi_qualite_barrage_garde_hebdo_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 3627 |
| Taille | 880 kB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | scheduled_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_suivi_qbrg_day_station_param_day`

#### Objet `api.mv_swat_qualite_subbasin_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Agrégat journalier SWAT en format long pour dashboard. |
| Lignes estimées | 0 |
| Taille | 16 kB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | swat_output |
| Sous-domaine | qualite |
| Grain | sous_bassin x jour x parametre |
| Refresh | batch_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_swat_qualite_subbasin_day_key`

#### Objet `api.mv_wasp_qualite_segment_day`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Agrégat journalier WASP en format long pour dashboard. |
| Lignes estimées | 0 |
| Taille | 16 kB |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | wasp_output |
| Sous-domaine | qualite |
| Grain | segment x jour x parametre |
| Refresh | batch_refresh |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_wasp_qualite_segment_day_key`

#### Objet `api.ca_hydro_barrage_day`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `bucket_start` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `barrage_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `measure_count` | bigint | YES | Attribut métier ou technique du modèle. |
| `cote_m_avg` | numeric | YES | Attribut métier ou technique du modèle. |
| `volume_mm3_avg` | numeric | YES | Attribut métier ou technique du modèle. |
| `lacher_m3s_avg` | numeric | YES | Attribut métier ou technique du modèle. |
| `volume_mm3_max` | numeric | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `_timescaledb_internal._materialized_hypertable_64`
- Consommateurs identifiés : `api.viz_hydro_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.ca_hydro_debit_day`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `bucket_start` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `measure_count` | bigint | YES | Attribut métier ou technique du modèle. |
| `valeur_avg` | double precision | YES | Attribut métier ou technique du modèle. |
| `valeur_min` | double precision | YES | Attribut métier ou technique du modèle. |
| `valeur_max` | double precision | YES | Attribut métier ou technique du modèle. |
| `valeur_sum` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `_timescaledb_internal._materialized_hypertable_61`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.ca_meteo_temp_day`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | climat |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `bucket_start` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `measure_count` | bigint | YES | Attribut métier ou technique du modèle. |
| `temp_moy_avg` | double precision | YES | Attribut métier ou technique du modèle. |
| `temp_min` | double precision | YES | Attribut métier ou technique du modèle. |
| `temp_max` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `_timescaledb_internal._materialized_hypertable_63`
- Consommateurs identifiés : `api.viz_climat_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_barrage_bathymetrie_geo`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | carto |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `barrage_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `ire_barrage` | text | YES | Attribut métier ou technique du modèle. |
| `legacy_barrage_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `mapping_confidence` | numeric | YES | Attribut métier ou technique du modèle. |
| `nom_barrage` | text | YES | Libellé métier affiché dans l'application. |
| `nom_oued` | text | YES | Libellé métier affiché dans l'application. |
| `type_barrage` | text | YES | Attribut métier ou technique du modèle. |
| `statut` | text | YES | Attribut métier ou technique du modèle. |
| `bathy_row_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `hauteur_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `volume_mm3` | double precision | YES | Attribut métier ou technique du modèle. |
| `surface_km2` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `hydro.barrage_bathymetrie`, `infra.barrages`, `metadata.mapping_barrage`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_barrage_dimension`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `barrage_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_ire_barrage` | text | YES | Attribut métier ou technique du modèle. |
| `legacy_barrage_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | YES | Attribut métier ou technique du modèle. |
| `barrage_nom` | text | YES | Libellé métier affiché dans l'application. |
| `nom_oued` | text | YES | Libellé métier affiché dans l'application. |
| `type_barrage` | text | YES | Attribut métier ou technique du modèle. |
| `vrn_hm3` | double precision | YES | Attribut métier ou technique du modèle. |
| `hauteur` | double precision | YES | Attribut métier ou technique du modèle. |
| `apports_hm` | double precision | YES | Attribut métier ou technique du modèle. |
| `statut` | text | YES | Attribut métier ou technique du modèle. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.barrages`, `metadata.mapping_barrage`
- Consommateurs identifiés : `api.v_hydro_niveau_barrage_journalier`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_bassin_geojson`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | carto |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `name` | character varying | YES | Libellé métier affiché dans l'application. |
| `geometry` | json | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.bassin_versant`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_hierarchie_metier_listing`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `theme` | text | YES | Attribut métier ou technique du modèle. |
| `sous_menu` | text | YES | Attribut métier ou technique du modèle. |
| `param_code` | text | YES | Code métier ou identifiant source. |
| `param_label` | text | YES | Attribut métier ou technique du modèle. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |
| `source_schema` | text | YES | Attribut métier ou technique du modèle. |
| `source_table` | text | YES | Attribut métier ou technique du modèle. |
| `source_column` | text | YES | Attribut métier ou technique du modèle. |
| `entity_type` | text | YES | Attribut métier ou technique du modèle. |
| `is_modeled` | boolean | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `information_schema.views`, `metadata.mapping_parametre_source`, `metadata.referentiel_parametre`, `swat_output.mesure_qualite_subbasin_ts`, `swat_output.ref_parametre_qualite`, `wasp_output.mesure_qualite_segment_ts`, `wasp_output.ref_parametre_qualite`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_hydro_debit_journalier_qa`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `temps_raw` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `methode_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_outlier` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_method_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `hydro.mesure_debit`, `metadata.mapping_station`
- Consommateurs identifiés : `api.viz_hydro_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_hydro_debit_mensuel`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `bucket_month` | date | YES | Attribut métier ou technique du modèle. |
| `valeur_moy_m3s` | double precision | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `qa_flags` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `hydro.mesure_debit_mensuel`, `infra.stations_mesure`, `metadata.mapping_station`
- Consommateurs identifiés : `api.viz_hydro_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_hydro_debit_sources_timeseries`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `source_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_ire_source` | text | YES | Attribut métier ou technique du modèle. |
| `legacy_source_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `mapping_confidence` | numeric | YES | Attribut métier ou technique du modèle. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `valeur_m3s` | double precision | YES | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `methode_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_outlier` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_method_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `nom_source` | text | YES | Libellé métier affiché dans l'application. |
| `type_source` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.source`, `hydro.mesure_debit_source`, `metadata.mapping_source`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_hydro_niveau_barrage_journalier`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Série journalière de niveau/volume/lâcher des barrages. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydro |
| Sous-domaine | barrage |
| Grain | barrage x jour |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `barrage_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `cote_m` | numeric | YES | Attribut métier ou technique du modèle. |
| `volume_mm3` | numeric | YES | Attribut métier ou technique du modèle. |
| `lacher_m3s` | numeric | YES | Attribut métier ou technique du modèle. |
| `barrage_nom` | text | YES | Libellé métier affiché dans l'application. |
| `nom_oued` | text | YES | Libellé métier affiché dans l'application. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `api.v_barrage_dimension`, `hydro.mesure_barrage`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_infra_fosses_septiques_geojson`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Couche cartographique des fosses septiques. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | infra |
| Sous-domaine | assainissement |
| Grain | entité |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | YES | Identifiant technique primaire. |
| `name` | character varying | YES | Libellé métier affiché dans l'application. |
| `geometry` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `properties` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.fosses_septiques_abhs`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_decharges_abandonnees_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `decharge_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `nom_site` | text | YES | Libellé métier affiché dans l'application. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `f9_raw` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_decharge` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `code_decharge` | text | YES | Code métier ou identifiant source. |
| `nom_decharge` | text | YES | Libellé métier affiché dans l'application. |
| `type_decharge` | text | YES | Attribut métier ou technique du modèle. |
| `decharge_code_commune` | text | YES | Code métier ou identifiant source. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.decharge`, `infra.decharge_inventaire_pollution`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_decharges_consolide`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `source_inventaire` | text | YES | Attribut métier ou technique du modèle. |
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `decharge_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `population_raw` | text | YES | Attribut métier ou technique du modèle. |
| `nom_site` | text | YES | Libellé métier affiché dans l'application. |
| `code_decharge_source` | text | YES | Code métier ou identifiant source. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z_raw` | text | YES | Attribut métier ou technique du modèle. |
| `type_decharge_raw` | text | YES | Attribut métier ou technique du modèle. |
| `surface_totale_ha_raw` | text | YES | Attribut métier ou technique du modèle. |
| `surface_occupee_ha_raw` | text | YES | Attribut métier ou technique du modèle. |
| `quantite_t_j_raw` | text | YES | Attribut métier ou technique du modèle. |
| `date_mise_service_raw` | text | YES | Attribut métier ou technique du modèle. |
| `station_traitement_raw` | text | YES | Attribut métier ou technique du modèle. |
| `exitance_puits_raw` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `enqueteur` | text | YES | Attribut métier ou technique du modèle. |
| `superviseur` | text | YES | Attribut métier ou technique du modèle. |
| `abreviation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `f9_raw` | text | YES | Attribut métier ou technique du modèle. |
| `colonne1_raw` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_decharge` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_decharge` | text | YES | Code métier ou identifiant source. |
| `nom_decharge` | text | YES | Libellé métier affiché dans l'application. |
| `type_decharge` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.decharge`, `infra.decharge_inventaire_pollution`, `infra.decharge_inventaire_pollution_general`
- Consommateurs identifiés : `api.viz_pollution_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_decharges_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `decharge_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `population_raw` | text | YES | Attribut métier ou technique du modèle. |
| `nom_site` | text | YES | Libellé métier affiché dans l'application. |
| `code_decharge_source` | text | YES | Code métier ou identifiant source. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z_raw` | text | YES | Attribut métier ou technique du modèle. |
| `type_decharge_raw` | text | YES | Attribut métier ou technique du modèle. |
| `surface_totale_ha_raw` | text | YES | Attribut métier ou technique du modèle. |
| `surface_occupee_ha_raw` | text | YES | Attribut métier ou technique du modèle. |
| `quantite_t_j_raw` | text | YES | Attribut métier ou technique du modèle. |
| `date_mise_service_raw` | text | YES | Attribut métier ou technique du modèle. |
| `station_traitement_raw` | text | YES | Attribut métier ou technique du modèle. |
| `exitance_puits_raw` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `enqueteur` | text | YES | Attribut métier ou technique du modèle. |
| `superviseur` | text | YES | Attribut métier ou technique du modèle. |
| `abreviation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `colonne1_raw` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_decharge` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_decharge` | text | YES | Code métier ou identifiant source. |
| `nom_decharge` | text | YES | Libellé métier affiché dans l'application. |
| `type_decharge` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.decharge`, `infra.decharge_inventaire_pollution_general`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_huileries_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `huilerie_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `date_enquete_raw` | text | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `cercle_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `localite_nom` | text | YES | Libellé métier affiché dans l'application. |
| `nom_huilerie_source` | text | YES | Libellé métier affiché dans l'application. |
| `code_huilerie_source` | text | YES | Code métier ou identifiant source. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `etat_raw` | text | YES | Attribut métier ou technique du modèle. |
| `type_raw` | text | YES | Attribut métier ou technique du modèle. |
| `adresse_raw` | text | YES | Attribut métier ou technique du modèle. |
| `proprietaire_raw` | text | YES | Attribut métier ou technique du modèle. |
| `exploitant_raw` | text | YES | Attribut métier ou technique du modèle. |
| `raw_payload` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_huilerie` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `nom_huilerie_reference` | text | YES | Libellé métier affiché dans l'application. |
| `code_huilerie_reference` | text | YES | Code métier ou identifiant source. |
| `type_huilerie_reference` | text | YES | Attribut métier ou technique du modèle. |
| `localite_reference` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.huilerie`, `infra.huilerie_inventaire_pollution`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_mines_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `mine_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `nom_mine_source` | text | YES | Libellé métier affiché dans l'application. |
| `num_licence_raw` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `nature_minerai` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_mine` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `mine_code_commune` | text | YES | Code métier ou identifiant source. |
| `mine_nom_reference` | text | YES | Libellé métier affiché dans l'application. |
| `mine_licence_reference` | text | YES | Attribut métier ou technique du modèle. |
| `mine_minerais_reference` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.mine`, `infra.mine_inventaire_pollution`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_rejet_abattoir_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `rejet_abattoir_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_rejet_abattoir` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `rejet_code_commune` | text | YES | Code métier ou identifiant source. |
| `code_abattoir` | text | YES | Code métier ou identifiant source. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.rejet_abattoir`, `infra.rejet_abattoir_inventaire_pollution`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_rejets_bruts_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `rejet_domestique_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `date_enquete_raw` | text | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `population_raw` | text | YES | Attribut métier ou technique du modèle. |
| `code_rejet` | text | YES | Code métier ou identifiant source. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `diametre_raw` | text | YES | Attribut métier ou technique du modèle. |
| `forme` | text | YES | Attribut métier ou technique du modèle. |
| `debit_l_s` | double precision | YES | Attribut métier ou technique du modèle. |
| `milieu_recepteur` | text | YES | Attribut métier ou technique du modèle. |
| `reutilisation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `enqueteur` | text | YES | Attribut métier ou technique du modèle. |
| `superviseur` | text | YES | Attribut métier ou technique du modèle. |
| `abreviation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_rejet` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_rejet_domestique` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `rejet_code_commune` | text | YES | Code métier ou identifiant source. |
| `rejet_milieu_recepteur` | text | YES | Attribut métier ou technique du modèle. |
| `rejet_reutilisation` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.rejet_domestique`, `infra.rejet_inventaire_pollution`
- Consommateurs identifiés : `api.viz_pollution_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_sources_mesures_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `prelevement_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_reception` | date | YES | Attribut métier ou technique du modèle. |
| `date_prelevement` | date | YES | Attribut métier ou technique du modèle. |
| `point_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `abh` | text | YES | Attribut métier ou technique du modèle. |
| `cercle` | text | YES | Attribut métier ou technique du modèle. |
| `province` | text | YES | Attribut métier ou technique du modèle. |
| `commune` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `debit_raw` | text | YES | Attribut métier ou technique du modèle. |
| `nature` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `observation_2` | text | YES | Attribut métier ou technique du modèle. |
| `entite_type` | text | YES | Attribut métier ou technique du modèle. |
| `entite_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `mapping_method` | text | YES | Attribut métier ou technique du modèle. |
| `is_primary` | boolean | YES | Attribut métier ou technique du modèle. |
| `mesure_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `param_code_legacy` | text | YES | Code métier ou identifiant source. |
| `parametre_code_canonique` | text | YES | Code métier ou identifiant source. |
| `parametre_libelle` | text | YES | Libellé métier affiché dans l'application. |
| `parametre_unite` | text | YES | Attribut métier ou technique du modèle. |
| `valeur_raw` | text | YES | Attribut métier ou technique du modèle. |
| `valeur_num` | double precision | YES | Attribut métier ou technique du modèle. |
| `valeur_qualifier` | text | YES | Attribut métier ou technique du modèle. |
| `qa_flag_value_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_value_non_numeric` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_unmapped` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `metadata.referentiel_parametre`, `qualite.source_pollution_mesure_param`, `qualite.source_pollution_prelevement`, `qualite.source_pollution_prelevement_lien`
- Consommateurs identifiés : `api.viz_pollution_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_steps_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `step_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `date_enquete_raw` | text | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `population_raw` | text | YES | Attribut métier ou technique du modèle. |
| `code_step` | text | YES | Code métier ou identifiant source. |
| `type_station` | text | YES | Attribut métier ou technique du modèle. |
| `niveau_epuration` | text | YES | Attribut métier ou technique du modèle. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `superficie_raw` | text | YES | Attribut métier ou technique du modèle. |
| `volume_eau_raw` | text | YES | Attribut métier ou technique du modèle. |
| `capacite_raw` | text | YES | Attribut métier ou technique du modèle. |
| `dbo5_filtre_raw` | text | YES | Attribut métier ou technique du modèle. |
| `dco_filtre_raw` | text | YES | Attribut métier ou technique du modèle. |
| `mes_brut_raw` | text | YES | Attribut métier ou technique du modèle. |
| `reutilisation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `usage` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `enqueteur` | text | YES | Attribut métier ou technique du modèle. |
| `superviseur` | text | YES | Attribut métier ou technique du modèle. |
| `abreviation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_step` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_step` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `step_code_commune` | text | YES | Code métier ou identifiant source. |
| `step_niveau_epuration` | text | YES | Attribut métier ou technique du modèle. |
| `step_reutilisation_eaux_us_epur` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.step`, `infra.step_inventaire_pollution`
- Consommateurs identifiés : `api.viz_pollution_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_steps_industrielles_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `step_ind_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_step_ind_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `code_step` | text | YES | Code métier ou identifiant source. |
| `nom_step` | text | YES | Libellé métier affiché dans l'application. |
| `secteur` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_step` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.step_industrielle`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_inventaire_pollution_stms_detail`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `legacy_stm_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_stm` | text | YES | Code métier ou identifiant source. |
| `nom_stm` | text | YES | Libellé métier affiché dans l'application. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_fr` | text | YES | Attribut métier ou technique du modèle. |
| `province_fr` | text | YES | Attribut métier ou technique du modèle. |
| `region_fr` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_stm` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `admin.communes`, `infra.stm`
- Consommateurs identifiés : `api.viz_pollution_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_meteo_evaporation_journalier_qa`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | climat |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `pas_temps` | character varying | YES | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `methode_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `qa_flag_null_value` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_outlier` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_method_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stations_mesure`, `metadata.mapping_station`, `meteo.mesure_evaporation`
- Consommateurs identifiés : `api.viz_climat_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_meteo_precipitation_annuelle_max`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | climat |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `annee` | integer | YES | Attribut métier ou technique du modèle. |
| `annee_civile` | integer | YES | Attribut métier ou technique du modèle. |
| `annee_hydrologique_calculee` | integer | YES | Attribut métier ou technique du modèle. |
| `annee_hydrologique_debut_mois` | smallint | YES | Attribut métier ou technique du modèle. |
| `date_jr` | date | YES | Attribut métier ou technique du modèle. |
| `p_max` | double precision | YES | Attribut métier ou technique du modèle. |
| `p_annuelle` | double precision | YES | Attribut métier ou technique du modèle. |
| `nbr_val_jr_mqt` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_mois` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_j_avec_0` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_j_sans_0` | integer | YES | Attribut métier ou technique du modèle. |
| `y` | double precision | YES | Attribut métier ou technique du modèle. |
| `ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `mapping_status` | text | YES | Attribut métier ou technique du modèle. |
| `qa_flags` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `flag_date_year_mismatch_civil` | boolean | YES | Attribut métier ou technique du modèle. |
| `flag_annee_hydrologique_mismatch` | boolean | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stations_mesure`, `meteo.mesure_precipitation_annuelle_max`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_meteo_precipitation_journalier_qa`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | climat |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `val_observees` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_power_nasa` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_remplies` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |
| `pas_temps` | character varying | YES | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `methode_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `qa_flag_null_filled` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_fill_inconsistency` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_source_nasa_only` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_method_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stations_mesure`, `metadata.mapping_station`, `meteo.mesure_precipitation`
- Consommateurs identifiés : `api.viz_climat_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_meteo_temperature_journalier`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Série journalière de température par station (min/max/moy). |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | meteo |
| Sous-domaine | temperature |
| Grain | station x jour |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `val_min` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_max` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_moy` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `code_station` | character varying | YES | Code métier ou identifiant source. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `api.v_station_dimension`, `meteo.mesure_temperature`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_nappes_geojson`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `name` | text | YES | Libellé métier affiché dans l'application. |
| `code` | text | YES | Code métier ou identifiant source. |
| `geometry` | json | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.nappe`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_points_eau`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | transverse |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `point_eau_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_point_eau_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_pt_eau` | text | YES | Code métier ou identifiant source. |
| `nom_pt_eau` | text | YES | Libellé métier affiché dans l'application. |
| `utilisation` | text | YES | Attribut métier ou technique du modèle. |
| `nature` | text | YES | Attribut métier ou technique du modèle. |
| `profond_tot_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `vol_preleve_m3_an` | double precision | YES | Attribut métier ou technique du modèle. |
| `niv_piezometrique_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `date_realisation` | date | YES | Attribut métier ou technique du modèle. |
| `foyer_pollution` | text | YES | Attribut métier ou technique du modèle. |
| `dist_pt_eau_foyer_pollut_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `nappe_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_nappe` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_station` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.point_eau`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_profils_stations`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | transverse |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `profil_station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_profil_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `nappe_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `points` | text | YES | Attribut métier ou technique du modèle. |
| `type_profil` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_station` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_nappe` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.profil_station`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_qualite_barrages_mesures`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `parametre_code_canonique` | text | YES | Code métier ou identifiant source. |
| `parametre_libelle` | text | YES | Libellé métier affiché dans l'application. |
| `parametre_unite` | text | YES | Attribut métier ou technique du modèle. |
| `milieu_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stations_mesure`, `metadata.mapping_parametre_source`, `metadata.mapping_station`, `metadata.referentiel_parametre`, `qualite.mesure_qualite_barrage`
- Consommateurs identifiés : `api.viz_qualite_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_qualite_nappes_mesures`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `nappe_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_nappe` | text | YES | Code métier ou identifiant source. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `parametre_code_canonique` | text | YES | Code métier ou identifiant source. |
| `parametre_libelle` | text | YES | Libellé métier affiché dans l'application. |
| `parametre_unite` | text | YES | Attribut métier ou technique du modèle. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_nappe_unmapped` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stations_mesure`, `metadata.mapping_station`, `metadata.referentiel_parametre`, `qualite.mesure_qualite_nappe`
- Consommateurs identifiés : `api.viz_qualite_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_qualite_riviere_mesures`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `parametre_code_canonique` | text | YES | Code métier ou identifiant source. |
| `parametre_libelle` | text | YES | Libellé métier affiché dans l'application. |
| `parametre_unite` | text | YES | Attribut métier ou technique du modèle. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stations_mesure`, `metadata.mapping_station`, `metadata.referentiel_parametre`, `qualite.mesure_qualite_riviere`
- Consommateurs identifiés : `api.viz_qualite_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_qualite_sebou_mesures`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `parametre_code_canonique` | text | YES | Code métier ou identifiant source. |
| `parametre_libelle` | text | YES | Libellé métier affiché dans l'application. |
| `parametre_unite` | text | YES | Attribut métier ou technique du modèle. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stations_mesure`, `metadata.mapping_station`, `metadata.referentiel_parametre`, `qualite.mesure_qualite_sebou`
- Consommateurs identifiés : `api.viz_qualite_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_source_pollution_prelevement`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | YES | Identifiant technique primaire. |
| `source_row_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_reception` | date | YES | Attribut métier ou technique du modèle. |
| `date_prelevement` | date | YES | Attribut métier ou technique du modèle. |
| `point_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `abh` | text | YES | Attribut métier ou technique du modèle. |
| `cercle` | text | YES | Attribut métier ou technique du modèle. |
| `province` | text | YES | Attribut métier ou technique du modèle. |
| `commune` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `debit_raw` | text | YES | Attribut métier ou technique du modèle. |
| `nature` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `observation_2` | text | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `n_entites_liees` | bigint | YES | Attribut métier ou technique du modèle. |
| `n_mesures_parametres` | bigint | YES | Attribut métier ou technique du modèle. |
| `n_mesures_param_unmapped` | bigint | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `qualite.source_pollution_mesure_param`, `qualite.source_pollution_prelevement`, `qualite.source_pollution_prelevement_lien`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_sources_geojson`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `name` | text | YES | Libellé métier affiché dans l'application. |
| `code_nappe` | text | YES | Code métier ou identifiant source. |
| `type_source` | text | YES | Attribut métier ou technique du modèle. |
| `geometry` | json | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.source`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_sous_bassin_geojson`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | carto |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `name` | character varying | YES | Libellé métier affiché dans l'application. |
| `parent_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `geometry` | json | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.sous_bassin_abh`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_sous_bassin_swat_geojson`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `name` | text | YES | Libellé métier affiché dans l'application. |
| `subbasin_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `geometry` | json | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.sous_bassin_swat_bas_sebou`, `geo.sous_bassin_swat_bassin_cotier`, `geo.sous_bassin_swat_beht`, `geo.sous_bassin_swat_haut_sebou`, `geo.sous_bassin_swat_leben_innaouen`, `geo.sous_bassin_swat_moyen_sebou`, `geo.sous_bassin_swat_ouergha`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_station_dimension`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | transverse |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | YES | Attribut métier ou technique du modèle. |
| `code_station` | character varying | YES | Code métier ou identifiant source. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `date_mise_service` | date | YES | Attribut métier ou technique du modèle. |
| `altitude_m` | numeric | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `sous_bassin_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `sous_bassin_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `bassin_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `bassin_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.bassin_versant`, `geo.sous_bassin_abh`, `infra.stations_mesure`, `metadata.mapping_station`
- Consommateurs identifiés : `api.v_meteo_temperature_journalier`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_stm`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `stm_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_stm_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `code_stm` | text | YES | Code métier ou identifiant source. |
| `nom_stm` | text | YES | Libellé métier affiché dans l'application. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_stm` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stm`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_suivi_qualite_barrage_garde_hebdo`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `barrage_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `milieu_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `parametre_code_canonique` | text | YES | Code métier ou identifiant source. |
| `parametre_libelle` | text | YES | Libellé métier affiché dans l'application. |
| `parametre_unite` | text | YES | Attribut métier ou technique du modèle. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_barrage_unmapped` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `infra.stations_mesure`, `metadata.mapping_station`, `metadata.referentiel_parametre`, `qualite.suivi_qualite_barrage_garde_hebdo`
- Consommateurs identifiés : `api.viz_qualite_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_swat_qualite_carto`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Jointure SWAT agrégé avec géométrie sous-bassin (carto). |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | swat_output |
| Sous-domaine | carto |
| Grain | sous_bassin x jour x parametre |
| Refresh | depends_on_mv |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `scenario_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `subbasin_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `parametre_code` | text | YES | Code métier ou identifiant source. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `geometry` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.sous_bassin_swat_leben_innaouen`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_swat_qualite_subbasin_consolide`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `run_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `run_code` | text | YES | Code métier ou identifiant source. |
| `version_modele` | text | YES | Attribut métier ou technique du modèle. |
| `date_run` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |
| `scenario_code` | text | YES | Code métier ou identifiant source. |
| `scenario_nom` | text | YES | Libellé métier affiché dans l'application. |
| `scenario_type` | text | YES | Attribut métier ou technique du modèle. |
| `subbasin_uid` | text | YES | Attribut métier ou technique du modèle. |
| `subbasin_local_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `geo_sous_bassin_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `hydro_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `outlet_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `temps` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `param_code` | text | YES | Code métier ou identifiant source. |
| `param_description` | text | YES | Attribut métier ou technique du modèle. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `qa_flag_null` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_non_numeric` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_outlier` | boolean | YES | Indicateur booléen signalant une anomalie QA spécifique. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `geom_wgs84` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `longitude` | double precision | YES | Attribut métier ou technique du modèle. |
| `latitude` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `swat_output.mesure_qualite_subbasin_ts`, `swat_output.ref_bassin`, `swat_output.ref_parametre_qualite`, `swat_output.ref_run_modele`, `swat_output.ref_scenario`, `swat_output.ref_subbasin`
- Consommateurs identifiés : `api.viz_pollution_timeseries`, `api.viz_qualite_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.v_wasp_qualite_segment_consolide`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | - |
| Grain | timeseries_or_entity |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `run_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `run_code` | text | YES | Code métier ou identifiant source. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |
| `scenario_code` | text | YES | Code métier ou identifiant source. |
| `scenario_nom` | text | YES | Libellé métier affiché dans l'application. |
| `segment_local_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `reseau_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `segment_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `code_parametre` | text | YES | Code métier ou identifiant source. |
| `nom_parametre` | text | YES | Libellé métier affiché dans l'application. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |
| `ts_utc` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `qa_flags` | ARRAY | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `lon` | double precision | YES | Attribut métier ou technique du modèle. |
| `lat` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `geo.reseau_hydrographique`, `swat_output.ref_bassin`, `swat_output.ref_scenario`, `wasp_output.mesure_qualite_segment_ts`, `wasp_output.ref_parametre_qualite`, `wasp_output.ref_run_modele`
- Consommateurs identifiés : `api.viz_qualite_timeseries`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.viz_carto_layers`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue consolidée des couches cartographiques multi-thèmes. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | carto |
| Sous-domaine | layers |
| Grain | entite_geographique |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `layer_code` | text | YES | Code métier ou identifiant source. |
| `theme` | text | YES | Attribut métier ou technique du modèle. |
| `subtheme` | text | YES | Attribut métier ou technique du modèle. |
| `entity_type` | text | YES | Attribut métier ou technique du modèle. |
| `entity_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `entity_name` | text | YES | Libellé métier affiché dans l'application. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `source_table` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `lon` | double precision | YES | Attribut métier ou technique du modèle. |
| `lat` | double precision | YES | Attribut métier ou technique du modèle. |
| `props` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `admin.cercle`, `admin.communes`, `admin.localite`, `admin.provinces`, `admin.regions`, `geo.bassin_versant`, `geo.nappe`, `geo.reseau_hydrographique`, `geo.source`, `geo.sous_bassin_abh`, `geo.sous_bassin_swat_bas_sebou`, `geo.sous_bassin_swat_bassin_cotier`, `geo.sous_bassin_swat_beht`, `geo.sous_bassin_swat_haut_sebou`, `geo.sous_bassin_swat_leben_innaouen`, `geo.sous_bassin_swat_moyen_sebou`, `geo.sous_bassin_swat_ouergha`, `infra.barrages`, `infra.decharge`, `infra.huilerie`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.viz_climat_timeseries`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Séries temporelles climat unifiées (précipitation, évaporation, température) pour consommation dashboard. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | climat |
| Sous-domaine | timeseries_station |
| Grain | jour |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `theme` | text | YES | Attribut métier ou technique du modèle. |
| `subtheme` | text | YES | Attribut métier ou technique du modèle. |
| `entity_type` | text | YES | Attribut métier ou technique du modèle. |
| `entity_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `entity_name` | text | YES | Libellé métier affiché dans l'application. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `variable_code` | text | YES | Code métier ou identifiant source. |
| `variable_name` | text | YES | Libellé métier affiché dans l'application. |
| `unit` | text | YES | Attribut métier ou technique du modèle. |
| `ts_utc` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_month` | date | YES | Attribut métier ou technique du modèle. |
| `bucket_year` | date | YES | Attribut métier ou technique du modèle. |
| `value` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `is_valid` | boolean | YES | Attribut métier ou technique du modèle. |
| `qa_flags` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `lon` | double precision | YES | Attribut métier ou technique du modèle. |
| `lat` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `api.ca_meteo_temp_day`, `api.v_meteo_evaporation_journalier_qa`, `api.v_meteo_precipitation_journalier_qa`, `infra.stations_mesure`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.viz_hydro_timeseries`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Séries temporelles hydro unifiées (débit journalier/mensuel, barrage). |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | hydrologie |
| Sous-domaine | timeseries_station_barrage |
| Grain | jour_mois |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `theme` | text | YES | Attribut métier ou technique du modèle. |
| `subtheme` | text | YES | Attribut métier ou technique du modèle. |
| `entity_type` | text | YES | Attribut métier ou technique du modèle. |
| `entity_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `entity_name` | text | YES | Libellé métier affiché dans l'application. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `variable_code` | text | YES | Code métier ou identifiant source. |
| `variable_name` | text | YES | Libellé métier affiché dans l'application. |
| `unit` | text | YES | Attribut métier ou technique du modèle. |
| `ts_utc` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_month` | date | YES | Attribut métier ou technique du modèle. |
| `bucket_year` | date | YES | Attribut métier ou technique du modèle. |
| `value` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `is_valid` | boolean | YES | Attribut métier ou technique du modèle. |
| `qa_flags` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `lon` | double precision | YES | Attribut métier ou technique du modèle. |
| `lat` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `api.ca_hydro_barrage_day`, `api.v_hydro_debit_journalier_qa`, `api.v_hydro_debit_mensuel`, `infra.barrages`, `infra.stations_mesure`, `metadata.mapping_barrage`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.viz_pollution_timeseries`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Pollution unifiée: ponctuelle mesurée + inventaires + diffuse SWAT. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | pollution |
| Sous-domaine | timeseries_inventory_diffuse |
| Grain | jour_annee |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `theme` | text | YES | Attribut métier ou technique du modèle. |
| `subtheme` | text | YES | Attribut métier ou technique du modèle. |
| `entity_type` | text | YES | Attribut métier ou technique du modèle. |
| `entity_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `entity_name` | text | YES | Libellé métier affiché dans l'application. |
| `ts_utc` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_month` | date | YES | Attribut métier ou technique du modèle. |
| `bucket_year` | date | YES | Attribut métier ou technique du modèle. |
| `variable_code` | text | YES | Code métier ou identifiant source. |
| `variable_name` | text | YES | Libellé métier affiché dans l'application. |
| `unit` | text | YES | Attribut métier ou technique du modèle. |
| `value` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `is_valid` | boolean | YES | Attribut métier ou technique du modèle. |
| `qa_flags` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `lon` | double precision | YES | Attribut métier ou technique du modèle. |
| `lat` | double precision | YES | Attribut métier ou technique du modèle. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `scenario_code` | text | YES | Code métier ou identifiant source. |
| `run_code` | text | YES | Code métier ou identifiant source. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `api.v_inventaire_pollution_decharges_consolide`, `api.v_inventaire_pollution_rejets_bruts_detail`, `api.v_inventaire_pollution_sources_mesures_detail`, `api.v_inventaire_pollution_steps_detail`, `api.v_inventaire_pollution_stms_detail`, `api.v_swat_qualite_subbasin_consolide`

Index :
- Aucun index listé pour cet objet.

#### Objet `api.viz_qualite_timeseries`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Séries qualité unifiées: mesures station (barrage/nappe/rivière/sebou), suivi barrage hebdo, WASP segment, SWAT sous-bassin. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

| Attribut API | Valeur |
|---|---|
| Domaine | qualite |
| Sous-domaine | timeseries_multi_source |
| Grain | jour |
| Refresh | live |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `theme` | text | YES | Attribut métier ou technique du modèle. |
| `subtheme` | text | YES | Attribut métier ou technique du modèle. |
| `entity_type` | text | YES | Attribut métier ou technique du modèle. |
| `entity_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `entity_name` | text | YES | Libellé métier affiché dans l'application. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `station_nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `variable_code` | text | YES | Code métier ou identifiant source. |
| `variable_name` | text | YES | Libellé métier affiché dans l'application. |
| `unit` | text | YES | Attribut métier ou technique du modèle. |
| `ts_utc` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `bucket_day` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `bucket_month` | date | YES | Attribut métier ou technique du modèle. |
| `bucket_year` | date | YES | Attribut métier ou technique du modèle. |
| `value` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `is_valid` | boolean | YES | Attribut métier ou technique du modèle. |
| `qa_flags` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `legacy_station_id` | double precision | YES | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `lon` | double precision | YES | Attribut métier ou technique du modèle. |
| `lat` | double precision | YES | Attribut métier ou technique du modèle. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `scenario_code` | text | YES | Code métier ou identifiant source. |
| `run_code` | text | YES | Code métier ou identifiant source. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `api.v_qualite_barrages_mesures`, `api.v_qualite_nappes_mesures`, `api.v_qualite_riviere_mesures`, `api.v_qualite_sebou_mesures`, `api.v_suivi_qualite_barrage_garde_hebdo`, `api.v_swat_qualite_subbasin_consolide`, `api.v_wasp_qualite_segment_consolide`

Index :
- Aucun index listé pour cet objet.

### Schéma `audit`

Traçabilité des imports et des opérations d'ingestion.

#### Objet `audit.ingestion_audit_logs`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Historique des opérations d'import, de validation et de publication. |
| Lignes estimées | -1 |
| Taille | 48 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `action` | character varying | NO | Attribut métier ou technique du modèle. |
| `utilisateur` | character varying | YES | Attribut métier ou technique du modèle. |
| `horodatage` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `fichier_nom` | text | YES | Libellé métier affiché dans l'application. |
| `fichier_type` | character varying | YES | Attribut métier ou technique du modèle. |
| `fichier_taille` | bigint | YES | Attribut métier ou technique du modèle. |
| `fichier_hash_md5` | character varying | YES | Attribut métier ou technique du modèle. |
| `scenario_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `resultat_statut` | character varying | NO | Attribut métier ou technique du modèle. |
| `resultat_nb_erreurs` | integer | NO | Attribut métier ou technique du modèle. |
| `resultat_nb_lignes` | integer | NO | Attribut métier ou technique du modèle. |
| `resultat_duree_ms` | integer | NO | Attribut métier ou technique du modèle. |
| `message_lisible` | text | NO | Attribut métier ou technique du modèle. |
| `metadata` | jsonb | NO | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `duplicate_count` | integer | NO | Attribut métier ou technique du modèle. |
| `last_seen_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_ingestion_audit_logs_horodatage`
- `ingestion_audit_logs_pkey`

### Schéma `geo`

Référentiels spatiaux du bassin et couches hydrographiques.

#### Objet `geo._bak_sous_bassin_swat_leben_innaouen_20260403`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 352 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `Area` | numeric | YES | Attribut métier ou technique du modèle. |
| `Slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Sll` | numeric | YES | Attribut métier ou technique du modèle. |
| `Csl` | numeric | YES | Attribut métier ou technique du modèle. |
| `Wid1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Dep1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Lat` | numeric | YES | Attribut métier ou technique du modèle. |
| `Long_` | numeric | YES | Attribut métier ou technique du modèle. |
| `Elev` | numeric | YES | Attribut métier ou technique du modèle. |
| `ElevMin` | numeric | YES | Attribut métier ou technique du modèle. |
| `ElevMax` | numeric | YES | Attribut métier ou technique du modèle. |
| `Bname` | character varying | YES | Libellé métier affiché dans l'application. |
| `Shape_Len` | numeric | YES | Attribut métier ou technique du modèle. |
| `Shape_Area` | numeric | YES | Attribut métier ou technique du modèle. |
| `HydroID` | integer | YES | Attribut métier ou technique du modèle. |
| `OutletID` | integer | YES | Attribut métier ou technique du modèle. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `geo.bassin_versant`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 1 |
| Taille | 40 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `nom` | character varying | NO | Libellé métier affiché dans l'application. |
| `superficie_km2` | numeric | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | NO | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_bassin_geojson`, `api.v_station_dimension`, `api.viz_carto_layers`

Index :
- `bassin_versant_pkey`
- `idx_geo_bv_geom`

#### Objet `geo.nappe`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 17 |
| Taille | 224 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `nappes` | text | YES | Attribut métier ou technique du modèle. |
| `code_nappe` | text | YES | Code métier ou identifiant source. |
| `nom_nappe` | text | YES | Libellé métier affiché dans l'application. |
| `superficie_km2` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_nappes_geojson`, `api.viz_carto_layers`

Index :
- `idx_geo_nappe_geom_gist_708faed4`
- `nappes_abhs_n_pkey`

#### Objet `geo.reseau_hydrographique`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 697 |
| Taille | 1448 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `waterway` | character varying | YES | Attribut métier ou technique du modèle. |
| `name` | character varying | YES | Libellé métier affiché dans l'application. |
| `Shape_Leng` | numeric | YES | Attribut métier ou technique du modèle. |
| `Z_Min` | numeric | YES | Attribut métier ou technique du modèle. |
| `Z_Max` | numeric | YES | Attribut métier ou technique du modèle. |
| `SLength` | numeric | YES | Attribut métier ou technique du modèle. |
| `Pente` | numeric | YES | Attribut métier ou technique du modèle. |
| `AvgWidth` | numeric | YES | Attribut métier ou technique du modèle. |
| `SegID` | numeric | YES | Attribut métier ou technique du modèle. |
| `sous_bassi` | character varying | YES | Attribut métier ou technique du modèle. |
| `Shape_Le_1` | numeric | YES | Attribut métier ou technique du modèle. |
| `ID` | integer | YES | Identifiant technique primaire. |
| `ORIG_SEQ` | bigint | YES | Attribut métier ou technique du modèle. |
| `IDD` | numeric | YES | Attribut métier ou technique du modèle. |
| `ORIG_FID` | bigint | YES | Attribut métier ou technique du modèle. |
| `full_id` | character varying | YES | Identifiant de liaison vers l'entité référencée. |
| `osm_id` | character varying | YES | Identifiant de liaison vers l'entité référencée. |
| `osm_type` | character varying | YES | Attribut métier ou technique du modèle. |
| `SegDéch` | numeric | YES | Attribut métier ou technique du modèle. |
| `layer` | character varying | YES | Attribut métier ou technique du modèle. |
| `path` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_wasp_qualite_segment_consolide`, `api.viz_carto_layers`

Index :
- `idx_geo_reseau_hydrographique_geom_gist_5d867224`
- `reseau_hydrographique_pkey`

#### Objet `geo.source`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 135 |
| Taille | 64 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_nappe` | text | YES | Code métier ou identifiant source. |
| `ire_source` | text | YES | Attribut métier ou technique du modèle. |
| `nom_source` | text | YES | Libellé métier affiché dans l'application. |
| `type_source` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_z` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_hydro_debit_sources_timeseries`, `api.v_sources_geojson`, `api.viz_carto_layers`

Index :
- `idx_geo_source_geom_gist_a12b6569`

#### Objet `geo.sous_bassin_abh`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 15 |
| Taille | 2544 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `bassin_versant_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `nom` | character varying | NO | Libellé métier affiché dans l'application. |
| `superficie_km2` | numeric | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | NO | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `bassin_versant_id` -> `geo.bassin_versant.id`
- Consommateurs identifiés : `api.v_sous_bassin_geojson`, `api.v_station_dimension`, `api.viz_carto_layers`

Index :
- `idx_geo_sb_geom`
- `sous_bassin_pkey`

#### Objet `geo.sous_bassin_swat_bas_sebou`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 29 |
| Taille | 536 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `sll` | numeric | YES | Attribut métier ou technique du modèle. |
| `csl` | numeric | YES | Attribut métier ou technique du modèle. |
| `wid1` | numeric | YES | Attribut métier ou technique du modèle. |
| `dep1` | numeric | YES | Attribut métier ou technique du modèle. |
| `lat` | numeric | YES | Attribut métier ou technique du modèle. |
| `long_` | numeric | YES | Attribut métier ou technique du modèle. |
| `elev` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmin` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmax` | numeric | YES | Attribut métier ou technique du modèle. |
| `bname` | character varying | YES | Libellé métier affiché dans l'application. |
| `shape_len` | numeric | YES | Attribut métier ou technique du modèle. |
| `shape_area` | numeric | YES | Attribut métier ou technique du modèle. |
| `hydroid` | integer | YES | Attribut métier ou technique du modèle. |
| `outletid` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `version_geom_date` | date | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_sous_bassin_swat_geojson`, `api.viz_carto_layers`

Index :
- `idx_sous_bassin_swat_bas_sebou_geom_gist`
- `sous_bassin_swat_bas_sebou_pkey`

#### Objet `geo.sous_bassin_swat_bassin_cotier`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 23 |
| Taille | 360 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `sll` | numeric | YES | Attribut métier ou technique du modèle. |
| `csl` | numeric | YES | Attribut métier ou technique du modèle. |
| `wid1` | numeric | YES | Attribut métier ou technique du modèle. |
| `dep1` | numeric | YES | Attribut métier ou technique du modèle. |
| `lat` | numeric | YES | Attribut métier ou technique du modèle. |
| `long_` | numeric | YES | Attribut métier ou technique du modèle. |
| `elev` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmin` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmax` | numeric | YES | Attribut métier ou technique du modèle. |
| `bname` | character varying | YES | Libellé métier affiché dans l'application. |
| `shape_len` | numeric | YES | Attribut métier ou technique du modèle. |
| `shape_area` | numeric | YES | Attribut métier ou technique du modèle. |
| `hydroid` | integer | YES | Attribut métier ou technique du modèle. |
| `outletid` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `version_geom_date` | date | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_sous_bassin_swat_geojson`, `api.viz_carto_layers`

Index :
- `idx_sous_bassin_swat_bassin_cotier_geom_gist`
- `sous_bassin_swat_bassin_cotier_pkey`

#### Objet `geo.sous_bassin_swat_beht`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 27 |
| Taille | 488 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `polygonid` | double precision | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `version_geom_date` | date | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_sous_bassin_swat_geojson`, `api.viz_carto_layers`

Index :
- `idx_sous_bassin_swat_beht_geom_gist`
- `sous_bassin_swat_beht_pkey`

#### Objet `geo.sous_bassin_swat_haut_sebou`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 22 |
| Taille | 448 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `polygonid` | double precision | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `version_geom_date` | date | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_sous_bassin_swat_geojson`, `api.viz_carto_layers`

Index :
- `idx_sous_bassin_swat_haut_sebou_geom_gist`
- `sous_bassin_swat_haut_sebou_pkey`

#### Objet `geo.sous_bassin_swat_leben_innaouen`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 18 |
| Taille | 832 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `Area` | numeric | YES | Attribut métier ou technique du modèle. |
| `Slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Sll` | numeric | YES | Attribut métier ou technique du modèle. |
| `Csl` | numeric | YES | Attribut métier ou technique du modèle. |
| `Wid1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Dep1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Lat` | numeric | YES | Attribut métier ou technique du modèle. |
| `Long_` | numeric | YES | Attribut métier ou technique du modèle. |
| `Elev` | numeric | YES | Attribut métier ou technique du modèle. |
| `ElevMin` | numeric | YES | Attribut métier ou technique du modèle. |
| `ElevMax` | numeric | YES | Attribut métier ou technique du modèle. |
| `Bname` | character varying | YES | Libellé métier affiché dans l'application. |
| `Shape_Len` | numeric | YES | Attribut métier ou technique du modèle. |
| `Shape_Area` | numeric | YES | Attribut métier ou technique du modèle. |
| `HydroID` | integer | YES | Attribut métier ou technique du modèle. |
| `OutletID` | integer | YES | Attribut métier ou technique du modèle. |
| `bassin_code` | text | NO | Code métier ou identifiant source. |
| `bassin_nom` | text | NO | Libellé métier affiché dans l'application. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `version_geom_date` | date | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_sous_bassin_swat_geojson`, `api.v_swat_qualite_carto`, `api.viz_carto_layers`

Index :
- `idx_geo_sous_bassin_swat_bassin_sub`
- `idx_sous_bassin_swat_leben_innaouen_geom_gist`
- `sous_bassin_swat_pkey`

#### Objet `geo.sous_bassin_swat_moyen_sebou`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 16 |
| Taille | 328 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `polygonid` | double precision | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `version_geom_date` | date | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_sous_bassin_swat_geojson`, `api.viz_carto_layers`

Index :
- `idx_sous_bassin_swat_moyen_sebou_geom_gist`
- `sous_bassin_swat_moyen_sebou_pkey`

#### Objet `geo.sous_bassin_swat_ouergha`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `geo` utilisée par le SAD. |
| Lignes estimées | 39 |
| Taille | 648 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `sll` | numeric | YES | Attribut métier ou technique du modèle. |
| `csl` | numeric | YES | Attribut métier ou technique du modèle. |
| `wid1` | numeric | YES | Attribut métier ou technique du modèle. |
| `dep1` | numeric | YES | Attribut métier ou technique du modèle. |
| `lat` | numeric | YES | Attribut métier ou technique du modèle. |
| `long_` | numeric | YES | Attribut métier ou technique du modèle. |
| `elev` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmin` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmax` | numeric | YES | Attribut métier ou technique du modèle. |
| `bname` | character varying | YES | Libellé métier affiché dans l'application. |
| `shape_len` | numeric | YES | Attribut métier ou technique du modèle. |
| `shape_area` | numeric | YES | Attribut métier ou technique du modèle. |
| `hydroid` | integer | YES | Attribut métier ou technique du modèle. |
| `outletid` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `bassin_code` | text | YES | Code métier ou identifiant source. |
| `bassin_nom` | text | YES | Libellé métier affiché dans l'application. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `version_geom_date` | date | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_sous_bassin_swat_geojson`, `api.viz_carto_layers`

Index :
- `idx_sous_bassin_swat_ouergha_geom_gist`
- `sous_bassin_swat_ouergha_pkey`

### Schéma `hydro`

Mesures hydrologiques et tables associées aux débits et barrages.

#### Objet `hydro.barrage_bathymetrie`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `hydro` utilisée par le SAD. |
| Lignes estimées | 62359 |
| Taille | 6720 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | text | NO | Identifiant technique primaire. |
| `hauteur_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `volume_mm3` | double precision | YES | Attribut métier ou technique du modèle. |
| `surface_km2` | double precision | YES | Attribut métier ou technique du modèle. |
| `ire_barrage` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_barrage_bathymetrie_geo`

Index :
- `bathymetries_barrages_abhs_pkey`

#### Objet `hydro.mesure_barrage`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 24 kB |
| PK | `temps`, `barrage_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `barrage_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `cote_m` | numeric | YES | Attribut métier ou technique du modèle. |
| `volume_mm3` | numeric | YES | Attribut métier ou technique du modèle. |
| `lacher_m3s` | numeric | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_hydro_niveau_barrage_journalier`

Index :
- `idx_hydro_barrage_temps`
- `mesure_barrage_pkey`
- `mesure_barrage_temps_idx`

#### Objet `hydro.mesure_debit`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 24 kB |
| PK | `temps`, `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `valeur` | double precision | NO | Valeur mesurée, calculée ou agrégée. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |
| `methode_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_outlier` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_method_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_hydro_debit_journalier_qa`

Index :
- `idx_hydro_debit_station_temps`
- `mesure_debit_pkey`
- `mesure_debit_temps_idx`

#### Objet `hydro.mesure_debit_mensuel`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 19316 |
| Taille | 3984 kB |
| PK | `station_id`, `bucket_month` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `bucket_month` | date | NO | Attribut métier ou technique du modèle. |
| `valeur_moy_m3s` | double precision | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `qa_flags` | jsonb | NO | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_hydro_debit_mensuel`

Index :
- `mesure_debit_mensuel_pkey`

#### Objet `hydro.mesure_debit_source`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 40 kB |
| PK | `temps`, `source_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `source_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `valeur_m3s` | double precision | YES | Attribut métier ou technique du modèle. |
| `methode_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `est_valide` | boolean | NO | Indicateur d'état métier ou technique. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_outlier` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_method_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `source_id` -> `metadata.mapping_source.source_id`
- Consommateurs identifiés : `api.v_hydro_debit_sources_timeseries`

Index :
- `idx_hydro_debit_source_sid_tdesc`
- `idx_hydro_debit_source_tdesc`
- `mesure_debit_source_pkey`
- `mesure_debit_source_temps_idx`

#### Objet `hydro.regle_qualite_debit_source`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `hydro` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `source_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `source_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `min_valeur` | double precision | YES | Attribut métier ou technique du modèle. |
| `max_valeur` | double precision | YES | Attribut métier ou technique du modèle. |
| `active` | boolean | NO | Attribut métier ou technique du modèle. |
| `commentaire` | text | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `source_id` -> `metadata.mapping_source.source_id`

Index :
- `regle_qualite_debit_source_pkey`

#### Objet `hydro.regle_qualite_debit_station`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `hydro` utilisée par le SAD. |
| Lignes estimées | 390 |
| Taille | 112 kB |
| PK | `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `min_valeur` | double precision | YES | Attribut métier ou technique du modèle. |
| `max_valeur` | double precision | YES | Attribut métier ou technique du modèle. |
| `active` | boolean | NO | Attribut métier ou technique du modèle. |
| `commentaire` | text | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`

Index :
- `regle_qualite_debit_station_pkey`

### Schéma `infra`

Stations, barrages, points d'eau et inventaires d'infrastructures.

#### Objet `infra.barrages`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 34 |
| Taille | 40 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `ire` | text | YES | Attribut métier ou technique du modèle. |
| `nom_barrage` | text | YES | Libellé métier affiché dans l'application. |
| `nom_oued` | text | YES | Libellé métier affiché dans l'application. |
| `statut` | text | YES | Attribut métier ou technique du modèle. |
| `buts` | text | YES | Attribut métier ou technique du modèle. |
| `type_barrage` | text | YES | Attribut métier ou technique du modèle. |
| `vrn_hm3` | double precision | YES | Attribut métier ou technique du modèle. |
| `hauteur` | double precision | YES | Attribut métier ou technique du modèle. |
| `apports_hm` | double precision | YES | Attribut métier ou technique du modèle. |
| `montant_md` | double precision | YES | Attribut métier ou technique du modèle. |
| `mise_en_se` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.v_barrage_bathymetrie_geo`, `api.v_barrage_dimension`, `api.viz_carto_layers`, `api.viz_hydro_timeseries`

Index :
- `barrages_abhs_pkey`
- `idx_infra_barrages_geom_gist_4b934b02`

#### Objet `infra.decharge`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 233 |
| Taille | 104 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_decharge` | text | YES | Code métier ou identifiant source. |
| `nom_decharge` | text | YES | Libellé métier affiché dans l'application. |
| `type_decharge` | text | YES | Attribut métier ou technique du modèle. |
| `sup_tot_ha` | double precision | YES | Attribut métier ou technique du modèle. |
| `sup_occupee_ha` | double precision | YES | Attribut métier ou technique du modèle. |
| `quantite_t_j` | double precision | YES | Attribut métier ou technique du modèle. |
| `date_mise_service` | text | YES | Attribut métier ou technique du modèle. |
| `station_traitement_lixiviat` | text | YES | Attribut métier ou technique du modèle. |
| `exit_puits` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z` | double precision | YES | Attribut métier ou technique du modèle. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.v_inventaire_pollution_decharges_abandonnees_detail`, `api.v_inventaire_pollution_decharges_consolide`, `api.v_inventaire_pollution_decharges_detail`, `api.viz_carto_layers`

Index :
- `decharges_abhs_pkey`
- `idx_infra_decharge_geom_gist_c4f16d6a`

#### Objet `infra.decharge_inventaire_pollution`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 11 |
| Taille | 72 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `decharge_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `nom_site` | text | YES | Libellé métier affiché dans l'application. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `f9_raw` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_decharge` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `decharge_id` -> `infra.decharge.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_decharges_abandonnees_detail`, `api.v_inventaire_pollution_decharges_consolide`

Index :
- `decharge_inventaire_pollution_pkey`
- `decharge_inventaire_pollution_source_row_id_key`
- `idx_decharge_inv_pollution_decharge_id`
- `idx_decharge_inv_pollution_geom`

#### Objet `infra.decharge_inventaire_pollution_general`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 139 |
| Taille | 160 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `decharge_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `population_raw` | text | YES | Attribut métier ou technique du modèle. |
| `nom_site` | text | YES | Libellé métier affiché dans l'application. |
| `code_decharge_source` | text | YES | Code métier ou identifiant source. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z_raw` | text | YES | Attribut métier ou technique du modèle. |
| `type_decharge_raw` | text | YES | Attribut métier ou technique du modèle. |
| `surface_totale_ha_raw` | text | YES | Attribut métier ou technique du modèle. |
| `surface_occupee_ha_raw` | text | YES | Attribut métier ou technique du modèle. |
| `quantite_t_j_raw` | text | YES | Attribut métier ou technique du modèle. |
| `date_mise_service_raw` | text | YES | Attribut métier ou technique du modèle. |
| `station_traitement_raw` | text | YES | Attribut métier ou technique du modèle. |
| `exitance_puits_raw` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `enqueteur` | text | YES | Attribut métier ou technique du modèle. |
| `superviseur` | text | YES | Attribut métier ou technique du modèle. |
| `abreviation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `colonne1_raw` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_decharge` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `decharge_id` -> `infra.decharge.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_decharges_consolide`, `api.v_inventaire_pollution_decharges_detail`

Index :
- `decharge_inventaire_pollution_general_pkey`
- `decharge_inventaire_pollution_general_source_row_id_key`
- `idx_dech_inv_gen_code`
- `idx_dech_inv_gen_decharge_id`
- `idx_dech_inv_gen_geom`

#### Objet `infra.fosses_septiques_abhs`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `code_commu` | character varying | YES | Code métier ou identifiant source. |
| `centre_fr` | character varying | YES | Attribut métier ou technique du modèle. |
| `coord_x` | numeric | YES | Attribut métier ou technique du modèle. |
| `coord_y` | numeric | YES | Attribut métier ou technique du modèle. |
| `code_regio` | character varying | YES | Code métier ou identifiant source. |
| `region_fr` | character varying | YES | Attribut métier ou technique du modèle. |
| `region_ar` | character varying | YES | Attribut métier ou technique du modèle. |
| `code_provi` | character varying | YES | Code métier ou identifiant source. |
| `province_f` | character varying | YES | Attribut métier ou technique du modèle. |
| `province_a` | character varying | YES | Attribut métier ou technique du modèle. |
| `code_cercl` | character varying | YES | Code métier ou identifiant source. |
| `cercle_fr` | character varying | YES | Attribut métier ou technique du modèle. |
| `cercle_ar` | character varying | YES | Attribut métier ou technique du modèle. |
| `code_com_1` | character varying | YES | Code métier ou identifiant source. |
| `commune_fr` | character varying | YES | Attribut métier ou technique du modèle. |
| `commune_ar` | character varying | YES | Attribut métier ou technique du modèle. |
| `milieu` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_infra_fosses_septiques_geojson`

Index :
- `Couche issue de la jointure_pkey`

#### Objet `infra.huilerie`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 612 |
| Taille | 256 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `localite` | text | YES | Attribut métier ou technique du modèle. |
| `nom_huilerie` | text | YES | Libellé métier affiché dans l'application. |
| `code_huilerie` | text | YES | Code métier ou identifiant source. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `type_huilerie` | text | YES | Attribut métier ou technique du modèle. |
| `adresse` | text | YES | Attribut métier ou technique du modèle. |
| `proprietaire` | text | YES | Attribut métier ou technique du modèle. |
| `exploitant` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.v_inventaire_pollution_huileries_detail`, `api.viz_carto_layers`

Index :
- `huileries_abhs_pkey`
- `idx_infra_huilerie_geom_gist_fab9d02f`

#### Objet `infra.huilerie_inventaire_pollution`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 606 |
| Taille | 4296 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `huilerie_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete_raw` | text | YES | Attribut métier ou technique du modèle. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `cercle_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `localite_nom` | text | YES | Libellé métier affiché dans l'application. |
| `nom_huilerie_source` | text | YES | Libellé métier affiché dans l'application. |
| `code_huilerie_source` | text | YES | Code métier ou identifiant source. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `etat_raw` | text | YES | Attribut métier ou technique du modèle. |
| `type_raw` | text | YES | Attribut métier ou technique du modèle. |
| `adresse_raw` | text | YES | Attribut métier ou technique du modèle. |
| `proprietaire_raw` | text | YES | Attribut métier ou technique du modèle. |
| `exploitant_raw` | text | YES | Attribut métier ou technique du modèle. |
| `raw_payload` | jsonb | NO | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_huilerie` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `huilerie_id` -> `infra.huilerie.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_huileries_detail`

Index :
- `huilerie_inventaire_pollution_pkey`
- `huilerie_inventaire_pollution_source_row_id_key`
- `idx_huilerie_inv_pollution_code`
- `idx_huilerie_inv_pollution_geom`
- `idx_huilerie_inv_pollution_huilerie_id`
- `idx_huilerie_inv_pollution_payload_gin`

#### Objet `infra.mine`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 42 |
| Taille | 40 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_mine` | text | YES | Code métier ou identifiant source. |
| `nom_mine` | text | YES | Libellé métier affiché dans l'application. |
| `num_licence_exploit` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `minerais` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.v_inventaire_pollution_mines_detail`, `api.viz_carto_layers`

Index :
- `idx_infra_mine_geom_gist_4054ac48`
- `mines_abhs_pkey`

#### Objet `infra.mine_inventaire_pollution`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 39 |
| Taille | 88 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `mine_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `nom_mine_source` | text | YES | Libellé métier affiché dans l'application. |
| `num_licence_raw` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `nature_minerai` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_mine` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `mine_id` -> `infra.mine.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_mines_detail`

Index :
- `idx_mine_inv_pollution_geom`
- `idx_mine_inv_pollution_mine_id`
- `idx_mine_inv_pollution_nom`
- `mine_inventaire_pollution_pkey`
- `mine_inventaire_pollution_source_row_id_key`

#### Objet `infra.point_eau`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 46 |
| Taille | 136 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `legacy_point_eau_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_pt_eau` | text | YES | Code métier ou identifiant source. |
| `utilisation` | text | YES | Attribut métier ou technique du modèle. |
| `dist_pt_eau_foyer_pollut_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `foyer_pollution` | text | YES | Attribut métier ou technique du modèle. |
| `nom_pt_eau` | text | YES | Libellé métier affiché dans l'application. |
| `date_realisation` | date | YES | Attribut métier ou technique du modèle. |
| `profond_tot_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `vol_preleve_m3_an` | double precision | YES | Attribut métier ou technique du modèle. |
| `nature` | text | YES | Attribut métier ou technique du modèle. |
| `niv_piezometrique_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `equipe` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z` | double precision | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `nappe_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_nappe` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_station` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_points_eau`, `api.viz_carto_layers`

Index :
- `idx_infra_point_eau_code`
- `idx_infra_point_eau_geom`
- `idx_infra_point_eau_nappe`
- `idx_infra_point_eau_station`
- `point_eau_legacy_point_eau_id_key`
- `point_eau_pkey`

#### Objet `infra.profil_station`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 1980 |
| Taille | 776 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `legacy_profil_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `nappe_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `points` | text | YES | Attribut métier ou technique du modèle. |
| `type_profil` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_station` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_nappe` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_profils_stations`

Index :
- `idx_infra_profil_station_geom`
- `idx_infra_profil_station_nappe`
- `idx_infra_profil_station_station`
- `profil_station_legacy_profil_id_key`
- `profil_station_pkey`

#### Objet `infra.rejet_abattoir`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 61 |
| Taille | 40 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_abattoir` | text | YES | Code métier ou identifiant source. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.v_inventaire_pollution_rejet_abattoir_detail`

Index :
- `idx_infra_rejet_abattoir_geom_gist_d066fc75`
- `rejets_abattoirs_abhs_pkey`

#### Objet `infra.rejet_abattoir_inventaire_pollution`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 56 |
| Taille | 104 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `rejet_abattoir_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_rejet_abattoir` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `rejet_abattoir_id` -> `infra.rejet_abattoir.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_rejet_abattoir_detail`

Index :
- `idx_rej_abat_inv_geom`
- `idx_rej_abat_inv_rej_id`
- `rejet_abattoir_inventaire_pollution_pkey`
- `rejet_abattoir_inventaire_pollution_source_row_id_key`

#### Objet `infra.rejet_domestique`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 362 |
| Taille | 136 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_rejet` | text | YES | Code métier ou identifiant source. |
| `dimension` | double precision | YES | Attribut métier ou technique du modèle. |
| `forme` | text | YES | Attribut métier ou technique du modèle. |
| `debit_l_s` | double precision | YES | Attribut métier ou technique du modèle. |
| `milieu_recepteur` | text | YES | Attribut métier ou technique du modèle. |
| `reutilisation` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.v_inventaire_pollution_rejets_bruts_detail`, `api.viz_carto_layers`

Index :
- `idx_infra_rejet_domestique_geom_gist_45f4f9a4`
- `rejets_domestiques_abhs_pkey`

#### Objet `infra.rejet_industriel`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 11 |
| Taille | 40 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_rejet` | text | YES | Code métier ou identifiant source. |
| `nom_rejet` | text | YES | Libellé métier affiché dans l'application. |
| `secteur` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.viz_carto_layers`

Index :
- `idx_infra_rejet_industriel_geom_gist_eb9cf191`
- `rejets_ind_abhs_pkey`

#### Objet `infra.rejet_inventaire_pollution`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 277 |
| Taille | 208 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `rejet_domestique_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `date_enquete_raw` | text | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `population_raw` | text | YES | Attribut métier ou technique du modèle. |
| `code_rejet` | text | YES | Code métier ou identifiant source. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `diametre_raw` | text | YES | Attribut métier ou technique du modèle. |
| `forme` | text | YES | Attribut métier ou technique du modèle. |
| `debit_l_s` | double precision | YES | Attribut métier ou technique du modèle. |
| `milieu_recepteur` | text | YES | Attribut métier ou technique du modèle. |
| `reutilisation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `enqueteur` | text | YES | Attribut métier ou technique du modèle. |
| `superviseur` | text | YES | Attribut métier ou technique du modèle. |
| `abreviation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_rejet` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_rejet_domestique` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `rejet_domestique_id` -> `infra.rejet_domestique.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_rejets_bruts_detail`

Index :
- `idx_rejet_inv_pollution_code_rejet`
- `idx_rejet_inv_pollution_dom_id`
- `idx_rejet_inv_pollution_geom`
- `rejet_inventaire_pollution_pkey`
- `rejet_inventaire_pollution_source_row_id_key`

#### Objet `infra.stations`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 390 |
| Taille | 160 kB |
| PK | `ire_station` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id_station` | integer | NO | Attribut métier ou technique du modèle. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `ire_station` | text | NO | Attribut métier ou technique du modèle. |
| `nom_station` | text | YES | Libellé métier affiché dans l'application. |
| `type_station` | text | YES | Attribut métier ou technique du modèle. |
| `code_ressource` | text | YES | Code métier ou identifiant source. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `organisme_resp` | text | YES | Attribut métier ou technique du modèle. |
| `ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |
| `types_mesures` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.viz_carto_layers`

Index :
- `idx_infra_stations_geom_gist_f7999a9c`
- `stations_abhs_pkey`

#### Objet `infra.stations_mesure`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 390 |
| Taille | 208 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `code_station` | character varying | YES | Code métier ou identifiant source. |
| `nom` | character varying | NO | Libellé métier affiché dans l'application. |
| `type_station` | character varying | YES | Attribut métier ou technique du modèle. |
| `date_mise_service` | date | YES | Attribut métier ou technique du modèle. |
| `altitude_m` | numeric | YES | Attribut métier ou technique du modèle. |
| `organisme_gestionnaire_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `commune_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `geom` | USER-DEFINED | NO | Géométrie spatiale utilisée pour la cartographie. |
| `actif` | boolean | YES | Indicateur d'état métier ou technique. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_hydro_debit_mensuel`, `api.v_meteo_evaporation_journalier_qa`, `api.v_meteo_precipitation_annuelle_max`, `api.v_meteo_precipitation_journalier_qa`, `api.v_qualite_barrages_mesures`, `api.v_qualite_nappes_mesures`, `api.v_qualite_riviere_mesures`, `api.v_qualite_sebou_mesures`, `api.v_station_dimension`, `api.v_suivi_qualite_barrage_garde_hebdo`, `api.viz_climat_timeseries`, `api.viz_hydro_timeseries`

Index :
- `idx_infra_station_commune`
- `idx_infra_station_geom`
- `idx_infra_station_type_actif`
- `station_mesure_code_station_key`
- `station_mesure_pkey`

#### Objet `infra.step`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 41 |
| Taille | 72 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_step` | text | YES | Code métier ou identifiant source. |
| `type_station` | text | YES | Attribut métier ou technique du modèle. |
| `niveau_epuration` | text | YES | Attribut métier ou technique du modèle. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `superficie_ha` | double precision | YES | Attribut métier ou technique du modèle. |
| `vol_eaux_us_trait_m3_an` | double precision | YES | Attribut métier ou technique du modèle. |
| `cap_equiv_hab` | double precision | YES | Attribut métier ou technique du modèle. |
| `reutilisation_eaux_us_epur` | text | YES | Attribut métier ou technique du modèle. |
| `usage` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- FK `code_commune` -> `admin.communes.code_commune`
- Consommateurs identifiés : `api.v_inventaire_pollution_steps_detail`, `api.viz_carto_layers`

Index :
- `idx_infra_step_geom_gist_bb6cceda`
- `step_abhs_pkey`

#### Objet `infra.step_industrielle`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 15 |
| Taille | 88 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `legacy_step_ind_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `code_step` | text | YES | Code métier ou identifiant source. |
| `nom_step` | text | YES | Libellé métier affiché dans l'application. |
| `secteur` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_step` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_inventaire_pollution_steps_industrielles_detail`, `api.viz_carto_layers`

Index :
- `idx_infra_step_ind_code_commune`
- `idx_infra_step_ind_code_step`
- `idx_infra_step_ind_geom`
- `step_industrielle_legacy_step_ind_id_key`
- `step_industrielle_pkey`

#### Objet `infra.step_inventaire_pollution`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 49 |
| Taille | 120 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `step_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `date_enquete_raw` | text | YES | Attribut métier ou technique du modèle. |
| `date_enquete` | date | YES | Attribut métier ou technique du modèle. |
| `region_nom` | text | YES | Libellé métier affiché dans l'application. |
| `province_nom` | text | YES | Libellé métier affiché dans l'application. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `ville_nom` | text | YES | Libellé métier affiché dans l'application. |
| `population_raw` | text | YES | Attribut métier ou technique du modèle. |
| `code_step` | text | YES | Code métier ou identifiant source. |
| `type_station` | text | YES | Attribut métier ou technique du modèle. |
| `niveau_epuration` | text | YES | Attribut métier ou technique du modèle. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `superficie_raw` | text | YES | Attribut métier ou technique du modèle. |
| `volume_eau_raw` | text | YES | Attribut métier ou technique du modèle. |
| `capacite_raw` | text | YES | Attribut métier ou technique du modèle. |
| `dbo5_filtre_raw` | text | YES | Attribut métier ou technique du modèle. |
| `dco_filtre_raw` | text | YES | Attribut métier ou technique du modèle. |
| `mes_brut_raw` | text | YES | Attribut métier ou technique du modèle. |
| `reutilisation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `usage` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `enqueteur` | text | YES | Attribut métier ou technique du modèle. |
| `superviseur` | text | YES | Attribut métier ou technique du modèle. |
| `abreviation_raw` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_step` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_unmapped_step` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `step_id` -> `infra.step.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_steps_detail`

Index :
- `idx_step_inv_pollution_code_step`
- `idx_step_inv_pollution_geom`
- `idx_step_inv_pollution_step_id`
- `step_inventaire_pollution_pkey`
- `step_inventaire_pollution_source_row_id_key`

#### Objet `infra.stm`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `infra` utilisée par le SAD. |
| Lignes estimées | 18 |
| Taille | 88 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `legacy_stm_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `commune_nom` | text | YES | Libellé métier affiché dans l'application. |
| `code_stm` | text | YES | Code métier ou identifiant source. |
| `nom_stm` | text | YES | Libellé métier affiché dans l'application. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_invalid_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_code_stm` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_inventaire_pollution_stms_detail`, `api.v_stm`, `api.viz_carto_layers`

Index :
- `idx_infra_stm_code_commune`
- `idx_infra_stm_code_stm`
- `idx_infra_stm_geom`
- `stm_legacy_stm_id_key`
- `stm_pkey`

### Schéma `metadata`

Dictionnaires, mappings, catalogue API, popup rules et couverture métier.

#### Objet `metadata.api_view_catalog`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Catalogue métier des vues d'exposition API. |
| Lignes estimées | -1 |
| Taille | 88 kB |
| PK | `view_name` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `view_name` | text | NO | Libellé métier affiché dans l'application. |
| `object_type` | text | NO | Attribut métier ou technique du modèle. |
| `domain` | text | NO | Attribut métier ou technique du modèle. |
| `subdomain` | text | YES | Attribut métier ou technique du modèle. |
| `grain` | text | YES | Attribut métier ou technique du modèle. |
| `description_metier` | text | YES | Attribut métier ou technique du modèle. |
| `primary_filters` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `entity_types` | ARRAY | YES | Attribut métier ou technique du modèle. |
| `owner_team` | text | YES | Attribut métier ou technique du modèle. |
| `refresh_strategy` | text | YES | Attribut métier ou technique du modèle. |
| `is_active` | boolean | YES | Indicateur d'état métier ou technique. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `metadata.v_api_dictionary`

Index :
- `api_view_catalog_pkey`
- `idx_metadata_api_view_catalog_domain`

#### Objet `metadata.api_view_column_catalog`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Catalogue détaillé des colonnes exposées par les vues API. |
| Lignes estimées | 976 |
| Taille | 288 kB |
| PK | `view_name`, `ordinal_position` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `view_name` | text | NO | Libellé métier affiché dans l'application. |
| `ordinal_position` | integer | NO | Attribut métier ou technique du modèle. |
| `column_name` | text | NO | Libellé métier affiché dans l'application. |
| `data_type` | text | NO | Attribut métier ou technique du modèle. |
| `is_nullable` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `metadata.v_api_dictionary`

Index :
- `api_view_column_catalog_pkey`
- `idx_metadata_api_view_column_catalog_view_name`

#### Objet `metadata.catalogue_type_mesure`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Objet de journalisation et de traçabilité. |
| Lignes estimées | 64 |
| Taille | 32 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `type_mesure` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |
| `description` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `types_mesures_pkey`

#### Objet `metadata.dictionnaire_donnees`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `metadata` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `schema_name`, `table_name`, `column_name` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `schema_name` | character varying | NO | Libellé métier affiché dans l'application. |
| `table_name` | character varying | NO | Libellé métier affiché dans l'application. |
| `column_name` | character varying | NO | Libellé métier affiché dans l'application. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `unite` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `dictionnaire_donnees_pkey`

#### Objet `metadata.mapping_abreviation_colonne_inventaire`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 48 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_schema` | text | NO | Attribut métier ou technique du modèle. |
| `source_table` | text | NO | Attribut métier ou technique du modèle. |
| `source_column` | text | NO | Attribut métier ou technique du modèle. |
| `raw_text` | text | NO | Attribut métier ou technique du modèle. |
| `abreviation_ref_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `abreviation_ref_id` -> `metadata.referentiel_abreviation_inventaire.id`

Index :
- `mapping_abreviation_colonne_i_source_schema_source_table_so_key`
- `mapping_abreviation_colonne_inventaire_pkey`

#### Objet `metadata.mapping_abreviation_unresolved_sources`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `source_schema`, `source_table` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `source_schema` | text | NO | Attribut métier ou technique du modèle. |
| `source_table` | text | NO | Attribut métier ou technique du modèle. |
| `note` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_abreviation_unresolved_sources_pkey`

#### Objet `metadata.mapping_barrage`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 10 |
| Taille | 80 kB |
| PK | `legacy_ire_barrage` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `legacy_ire_barrage` | text | NO | Attribut métier ou technique du modèle. |
| `barrage_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_barrage_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `has_duplicate_legacy` | boolean | NO | Attribut métier ou technique du modèle. |
| `duplicate_count` | integer | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_barrage_bathymetrie_geo`, `api.v_barrage_dimension`, `api.viz_hydro_timeseries`

Index :
- `idx_mapping_barrage_barrage_id`
- `idx_mapping_barrage_legacy_id`
- `mapping_barrage_barrage_id_key`
- `mapping_barrage_pkey`

#### Objet `metadata.mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `row_count` | integer | NO | Attribut métier ou technique du modèle. |
| `first_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `last_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo_pkey`

#### Objet `metadata.mapping_nappe_unresolved_qualite_nappes`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 292 |
| Taille | 104 kB |
| PK | `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `row_count` | integer | NO | Attribut métier ou technique du modèle. |
| `first_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `last_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_nappe_unresolved_qualite_nappes_pkey`

#### Objet `metadata.mapping_parametre_source`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 180 |
| Taille | 144 kB |
| PK | `source_schema`, `source_table`, `source_column`, `source_value` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `source_schema` | text | NO | Attribut métier ou technique du modèle. |
| `source_table` | text | NO | Attribut métier ou technique du modèle. |
| `source_column` | text | NO | Attribut métier ou technique du modèle. |
| `source_value` | text | NO | Attribut métier ou technique du modèle. |
| `domaine` | text | NO | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `parametre_ref_id` -> `metadata.referentiel_parametre.id`
- Consommateurs identifiés : `api.v_hierarchie_metier_listing`, `api.v_qualite_barrages_mesures`, `metadata.v_mapping_parametre_coverage`

Index :
- `mapping_parametre_source_pkey`

#### Objet `metadata.mapping_parametre_source_orphans_audit`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `audit_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `source_schema` | text | YES | Attribut métier ou technique du modèle. |
| `source_table` | text | YES | Attribut métier ou technique du modèle. |
| `source_column` | text | YES | Attribut métier ou technique du modèle. |
| `source_value` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `metadata.mapping_parametre_unresolved_legacy_qualite_riviere`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 39 |
| Taille | 32 kB |
| PK | `parametre_qualite` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `parametre_qualite` | text | NO | Attribut métier ou technique du modèle. |
| `sample_rows` | bigint | NO | Attribut métier ou technique du modèle. |
| `sample_min_date` | date | YES | Attribut métier ou technique du modèle. |
| `sample_max_date` | date | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_parametre_unresolved_legacy_qualite_riviere_pkey`

#### Objet `metadata.mapping_parametre_unresolved_suivi_qualite_sebou`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `parametre_qualite` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `parametre_qualite` | text | NO | Attribut métier ou technique du modèle. |
| `sample_rows` | bigint | NO | Attribut métier ou technique du modèle. |
| `sample_min_date` | date | YES | Attribut métier ou technique du modèle. |
| `sample_max_date` | date | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_parametre_unresolved_suivi_qualite_sebou_pkey`

#### Objet `metadata.mapping_point_eau`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 46 |
| Taille | 48 kB |
| PK | `legacy_point_eau_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `legacy_point_eau_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `point_eau_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_pt_eau` | text | YES | Code métier ou identifiant source. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_point_eau_pkey`
- `mapping_point_eau_point_eau_id_key`

#### Objet `metadata.mapping_point_eau_unresolved_nappe`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `point_eau_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `point_eau_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_point_eau_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_pt_eau` | text | YES | Code métier ou identifiant source. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_point_eau_unresolved_nappe_pkey`

#### Objet `metadata.mapping_point_eau_unresolved_station`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `point_eau_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `point_eau_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_point_eau_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_pt_eau` | text | YES | Code métier ou identifiant source. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_point_eau_unresolved_station_pkey`

#### Objet `metadata.mapping_profil_station`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 1980 |
| Taille | 392 kB |
| PK | `legacy_profil_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `legacy_profil_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `profil_station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_profil_station_pkey`
- `mapping_profil_station_profil_station_id_key`

#### Objet `metadata.mapping_profil_unresolved_nappe`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 1204 |
| Taille | 232 kB |
| PK | `profil_station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `profil_station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_profil_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_profil_unresolved_nappe_pkey`

#### Objet `metadata.mapping_profil_unresolved_station`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `profil_station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `profil_station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_profil_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_profil_unresolved_station_pkey`

#### Objet `metadata.mapping_source`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 19 |
| Taille | 80 kB |
| PK | `legacy_ire_source` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `legacy_ire_source` | text | NO | Attribut métier ou technique du modèle. |
| `source_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_source_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `has_duplicate_legacy` | boolean | NO | Attribut métier ou technique du modèle. |
| `duplicate_count` | integer | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_hydro_debit_sources_timeseries`

Index :
- `idx_mapping_source_legacy_id`
- `idx_mapping_source_source_id`
- `mapping_source_pkey`
- `mapping_source_source_id_key`

#### Objet `metadata.mapping_station`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 390 |
| Taille | 336 kB |
| PK | `legacy_station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `legacy_station_id` | double precision | NO | Identifiant de liaison vers l'entité référencée. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_station` | text | YES | Code métier ou identifiant source. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_hydro_debit_journalier_qa`, `api.v_hydro_debit_mensuel`, `api.v_meteo_evaporation_journalier_qa`, `api.v_meteo_precipitation_journalier_qa`, `api.v_qualite_barrages_mesures`, `api.v_qualite_nappes_mesures`, `api.v_qualite_riviere_mesures`, `api.v_qualite_sebou_mesures`, `api.v_station_dimension`, `api.v_suivi_qualite_barrage_garde_hebdo`

Index :
- `idx_mapping_station_legacy_code_station_uq`
- `idx_mapping_station_station_id`
- `mapping_station_pkey`
- `mapping_station_station_id_key`

#### Objet `metadata.mapping_station_unresolved_precip_ann_max`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 0 |
| Taille | 16 kB |
| PK | `ire_station` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `ire_station` | text | NO | Attribut métier ou technique du modèle. |
| `row_count` | integer | NO | Attribut métier ou technique du modèle. |
| `first_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `last_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `sample_ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_station_unresolved_precip_ann_max_pkey`

#### Objet `metadata.mapping_station_unresolved_qualite_barrages`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 0 |
| Taille | 16 kB |
| PK | `ire_station` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `ire_station` | text | NO | Attribut métier ou technique du modèle. |
| `row_count` | integer | NO | Attribut métier ou technique du modèle. |
| `first_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `last_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `sample_parametre` | text | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_station_unresolved_qualite_barrages_pkey`

#### Objet `metadata.mapping_station_unresolved_qualite_nappes`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 0 |
| Taille | 16 kB |
| PK | `ire_station` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `ire_station` | text | NO | Attribut métier ou technique du modèle. |
| `row_count` | integer | NO | Attribut métier ou technique du modèle. |
| `first_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `last_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `sample_parametre` | text | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_station_unresolved_qualite_nappes_pkey`

#### Objet `metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `ire_station` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `ire_station` | text | NO | Attribut métier ou technique du modèle. |
| `row_count` | integer | NO | Attribut métier ou technique du modèle. |
| `first_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `last_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `sample_parametre` | text | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_pkey`

#### Objet `metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `row_count` | integer | NO | Attribut métier ou technique du modèle. |
| `first_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `last_seen_date` | date | YES | Attribut métier ou technique du modèle. |
| `sample_parametre` | text | YES | Attribut métier ou technique du modèle. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `metadata.mapping_step_ind`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 15 |
| Taille | 48 kB |
| PK | `legacy_step_ind_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `legacy_step_ind_id` | text | NO | Identifiant de liaison vers l'entité référencée. |
| `step_ind_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_step` | text | YES | Code métier ou identifiant source. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_step_ind_pkey`
- `mapping_step_ind_step_ind_id_key`

#### Objet `metadata.mapping_step_ind_unresolved_commune`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `step_ind_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `step_ind_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_step_ind_id` | text | YES | Identifiant de liaison vers l'entité référencée. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_step_ind_unresolved_commune_pkey`

#### Objet `metadata.mapping_stm`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | 18 |
| Taille | 48 kB |
| PK | `legacy_stm_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `legacy_stm_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `stm_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_code_stm` | text | YES | Code métier ou identifiant source. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `mapping_confidence` | numeric | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_stm_pkey`
- `mapping_stm_stm_id_key`

#### Objet `metadata.mapping_stm_unresolved_commune`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de correspondance utilisée pour relier les identifiants historiques au modèle canonique. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `stm_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `stm_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `legacy_stm_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `noted_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mapping_stm_unresolved_commune_pkey`

#### Objet `metadata.mv_refresh_status`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 13 |
| Taille | 32 kB |
| PK | `mv_name` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `mv_name` | text | NO | Libellé métier affiché dans l'application. |
| `refreshed_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `row_count` | bigint | YES | Attribut métier ou technique du modèle. |
| `note` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `mv_refresh_status_pkey`

#### Objet `metadata.obs_parametre_coverage`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `metadata` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `parametre_code`, `entity_type` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `parametre_code` | text | NO | Code métier ou identifiant source. |
| `entity_type` | text | NO | Attribut métier ou technique du modèle. |
| `source_view` | text | YES | Attribut métier ou technique du modèle. |
| `min_date` | date | YES | Attribut métier ou technique du modèle. |
| `max_date` | date | YES | Attribut métier ou technique du modèle. |
| `time_steps` | jsonb | NO | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `n_entities` | bigint | NO | Attribut métier ou technique du modèle. |
| `n_values` | bigint | NO | Attribut métier ou technique du modèle. |
| `has_values` | boolean | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `parametre_code` -> `metadata.obs_referentiel_parametre.parametre_code`

Index :
- `obs_parametre_coverage_pkey`

#### Objet `metadata.obs_parametre_entite_compat`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `metadata` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `parametre_code`, `entity_type` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `parametre_code` | text | NO | Code métier ou identifiant source. |
| `entity_type` | text | NO | Attribut métier ou technique du modèle. |
| `source_view` | text | YES | Attribut métier ou technique du modèle. |
| `default_aggregation` | text | YES | Attribut métier ou technique du modèle. |
| `default_time_step` | text | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | NO | Indicateur d'état métier ou technique. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `parametre_code` -> `metadata.obs_referentiel_parametre.parametre_code`

Index :
- `obs_parametre_entite_compat_pkey`

#### Objet `metadata.obs_referentiel_parametre`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `metadata` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `parametre_code` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `parametre_code` | text | NO | Code métier ou identifiant source. |
| `libelle` | text | NO | Libellé métier affiché dans l'application. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |
| `theme` | text | NO | Attribut métier ou technique du modèle. |
| `sous_theme` | text | YES | Attribut métier ou technique du modèle. |
| `aggregations_autorisees` | jsonb | NO | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `seuils_qa` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `palette` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `description_courte` | text | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | NO | Indicateur d'état métier ou technique. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `obs_referentiel_parametre_pkey`

#### Objet `metadata.popup_rules_config`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Configuration des popups cartographiques par couche et groupes d'attributs. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `layer_key` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `layer_key` | text | NO | Attribut métier ou technique du modèle. |
| `title` | text | YES | Libellé métier affiché dans l'application. |
| `name_fields` | ARRAY | NO | Libellé métier affiché dans l'application. |
| `type_fields` | ARRAY | NO | Attribut métier ou technique du modèle. |
| `class_fields` | ARRAY | NO | Attribut métier ou technique du modèle. |
| `code_fields` | ARRAY | NO | Code métier ou identifiant source. |
| `actif` | boolean | NO | Indicateur d'état métier ou technique. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `popup_rules_config_pkey`

#### Objet `metadata.referentiel_abreviation_inventaire`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `metadata` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 48 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `abreviation_code` | text | NO | Code métier ou identifiant source. |
| `libelle` | text | NO | Libellé métier affiché dans l'application. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `referentiel_abreviation_inventaire_abreviation_code_key`
- `referentiel_abreviation_inventaire_pkey`

#### Objet `metadata.referentiel_parametre`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Référentiel canonique des paramètres métier et de leurs unités. |
| Lignes estimées | 69 |
| Taille | 80 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `domaine` | text | NO | Attribut métier ou technique du modèle. |
| `code_canonique` | text | NO | Code métier ou identifiant source. |
| `libelle` | text | YES | Libellé métier affiché dans l'application. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `actif` | boolean | NO | Indicateur d'état métier ou technique. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_hierarchie_metier_listing`, `api.v_inventaire_pollution_sources_mesures_detail`, `api.v_qualite_barrages_mesures`, `api.v_qualite_nappes_mesures`, `api.v_qualite_riviere_mesures`, `api.v_qualite_sebou_mesures`, `api.v_suivi_qualite_barrage_garde_hebdo`, `metadata.v_mapping_parametre_coverage`

Index :
- `referentiel_parametre_domaine_code_canonique_key`
- `referentiel_parametre_pkey`

#### Objet `metadata.mv_obs_parametre_coverage`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 16 |
| Taille | 40 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_obs_cov_param_entity`

#### Objet `metadata.mv_obs_parametre_entite_compat`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 18 |
| Taille | 40 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_obs_compat_param_entity`

#### Objet `metadata.mv_obs_referentiel_parametre`

| Champ | Valeur |
|---|---|
| Type | materialized_view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | 18 |
| Taille | 56 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| - | - | - | - |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_mv_obs_ref_param_code`
- `idx_mv_obs_ref_param_theme`

#### Objet `metadata.v_api_dictionary`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `view_name` | text | YES | Libellé métier affiché dans l'application. |
| `object_type` | text | YES | Attribut métier ou technique du modèle. |
| `domain` | text | YES | Attribut métier ou technique du modèle. |
| `subdomain` | text | YES | Attribut métier ou technique du modèle. |
| `grain` | text | YES | Attribut métier ou technique du modèle. |
| `description_metier` | text | YES | Attribut métier ou technique du modèle. |
| `primary_filters` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `entity_types` | ARRAY | YES | Attribut métier ou technique du modèle. |
| `refresh_strategy` | text | YES | Attribut métier ou technique du modèle. |
| `ordinal_position` | integer | YES | Attribut métier ou technique du modèle. |
| `column_name` | text | YES | Libellé métier affiché dans l'application. |
| `data_type` | text | YES | Attribut métier ou technique du modèle. |
| `is_nullable` | text | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `metadata.api_view_catalog`, `metadata.api_view_column_catalog`

Index :
- Aucun index listé pour cet objet.

#### Objet `metadata.v_mapping_parametre_coverage`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue d'exposition, de consolidation ou de performance utilisée par la plateforme. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `source_value` | text | YES | Attribut métier ou technique du modèle. |
| `nb_mesures` | bigint | YES | Attribut métier ou technique du modèle. |
| `is_mapped` | integer | YES | Attribut métier ou technique du modèle. |
| `code_canonique` | text | YES | Code métier ou identifiant source. |
| `libelle` | text | YES | Libellé métier affiché dans l'application. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Dépendances SQL : `metadata.mapping_parametre_source`, `metadata.referentiel_parametre`, `qualite.mesure_qualite_barrage`

Index :
- Aucun index listé pour cet objet.

### Schéma `meteo`

Mesures météorologiques et climatiques.

#### Objet `meteo.mesure_evaporation`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 40 kB |
| PK | `temps`, `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `pas_temps` | character varying | NO | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | NO | Indicateur d'état métier ou technique. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_outlier` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_method_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_null_value` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `methode_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_meteo_evaporation_journalier_qa`

Index :
- `idx_meteo_evapo_station_tdesc`
- `idx_meteo_evapo_tdesc`
- `mesure_evaporation_pkey`
- `mesure_evaporation_temps_idx`

#### Objet `meteo.mesure_precipitation`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 32 kB |
| PK | `temps`, `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `val_observees` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_power_nasa` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_remplies` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |
| `pas_temps` | character varying | NO | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | NO | Indicateur d'état métier ou technique. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_null_filled` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_fill_inconsistency` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_source_nasa_only` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_method_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `methode_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_meteo_precipitation_journalier_qa`

Index :
- `idx_meteo_precip_tr_station_tdesc`
- `mesure_precipitation_traitee_pkey`
- `mesure_precipitation_traitee_temps_idx`

#### Objet `meteo.mesure_precipitation_annuelle_max`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 2085 |
| Taille | 3200 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `annee` | integer | YES | Attribut métier ou technique du modèle. |
| `date_jr` | date | YES | Attribut métier ou technique du modèle. |
| `p_max` | double precision | YES | Attribut métier ou technique du modèle. |
| `p_annuelle` | double precision | YES | Attribut métier ou technique du modèle. |
| `nbr_val_jr_mqt` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_mois` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_j_avec_0` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_j_sans_0` | integer | YES | Attribut métier ou technique du modèle. |
| `y` | double precision | YES | Attribut métier ou technique du modèle. |
| `ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `mapping_status` | text | NO | Attribut métier ou technique du modèle. |
| `qa_flags` | jsonb | NO | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `annee_civile` | integer | YES | Attribut métier ou technique du modèle. |
| `annee_hydrologique_calculee` | integer | YES | Attribut métier ou technique du modèle. |
| `annee_hydrologique_debut_mois` | smallint | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_meteo_precipitation_annuelle_max`

Index :
- `idx_meteo_precip_ann_max_date`
- `idx_meteo_precip_ann_max_ire_station`
- `idx_meteo_precip_ann_max_station_year`
- `mesure_precipitation_annuelle_max_pkey`

#### Objet `meteo.mesure_temperature`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | -1 |
| Taille | 24 kB |
| PK | `temps`, `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `val_min` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_max` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_moy` | double precision | YES | Valeur mesurée, calculée ou agrégée. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_meteo_temperature_journalier`

Index :
- `idx_meteo_temp_station_temps`
- `mesure_temperature_pkey`
- `mesure_temperature_temps_idx`

#### Objet `meteo.regle_qualite_evaporation_station`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `meteo` utilisée par le SAD. |
| Lignes estimées | 390 |
| Taille | 112 kB |
| PK | `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `min_valeur` | double precision | YES | Attribut métier ou technique du modèle. |
| `max_valeur` | double precision | YES | Attribut métier ou technique du modèle. |
| `active` | boolean | NO | Attribut métier ou technique du modèle. |
| `commentaire` | text | YES | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`

Index :
- `regle_qualite_evaporation_station_pkey`

### Schéma `modeles`

Référentiels structurants associés aux modèles.

#### Objet `modeles.resultat_swat`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de résultats simulés ou consolidés. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `temps`, `scenario_id`, `sous_bassin_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `scenario_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `sous_bassin_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `precip_mm` | double precision | YES | Attribut métier ou technique du modèle. |
| `etp_mm` | double precision | YES | Attribut métier ou technique du modèle. |
| `ruissellement_mm` | double precision | YES | Attribut métier ou technique du modèle. |
| `debit_m3s` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `scenario_id` -> `modeles.scenario_simulation.id`
- FK `sous_bassin_id` -> `geo.sous_bassin_abh.id`

Index :
- `resultat_swat_pkey`
- `resultat_swat_temps_idx`

#### Objet `modeles.resultat_wasp`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de résultats simulés ou consolidés. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `temps`, `scenario_id`, `cours_eau_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `scenario_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `cours_eau_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `oxygene_dissous_mgl` | double precision | YES | Attribut métier ou technique du modèle. |
| `bod_mgl` | double precision | YES | Attribut métier ou technique du modèle. |
| `nitrates_mgl` | double precision | YES | Attribut métier ou technique du modèle. |
| `phosphore_mgl` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `scenario_id` -> `modeles.scenario_simulation.id`

Index :
- `resultat_wasp_pkey`
- `resultat_wasp_temps_idx`

#### Objet `modeles.scenario_simulation`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de scénarios utilisée pour référencer les jeux de simulation. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `nom_scenario` | character varying | NO | Libellé métier affiché dans l'application. |
| `modele` | character varying | YES | Attribut métier ou technique du modèle. |
| `date_run` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `parametres_globaux` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `scenario_simulation_pkey`

### Schéma `monitoring`

Objets de supervision métier ou technique.

#### Objet `monitoring.alerte_seuil`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `monitoring` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 8192 bytes |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `parametre_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `valeur_mesuree` | double precision | YES | Attribut métier ou technique du modèle. |
| `seuil_depasse` | double precision | YES | Attribut métier ou technique du modèle. |
| `statut` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`

Index :
- `alerte_seuil_pkey`

#### Objet `monitoring.flux_iot_brut`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `monitoring` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 24 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `temps_reception` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `payload` | jsonb | NO | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `traite` | boolean | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`

Index :
- `flux_iot_brut_pkey`
- `idx_flux_iot_traite`

#### Objet `monitoring.statut_capteur`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `monitoring` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 8192 bytes |
| PK | `station_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `temps_derniere_com` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `niveau_batterie_pct` | numeric | YES | Attribut métier ou technique du modèle. |
| `statut_operationnel` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`

Index :
- `statut_capteur_pkey`

### Schéma `public`

Compatibilité résiduelle et reliquats historiques.

#### Objet `public.spatial_ref_sys`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `public` utilisée par le SAD. |
| Lignes estimées | 8500 |
| Taille | 7144 kB |
| PK | `srid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `srid` | integer | NO | Attribut métier ou technique du modèle. |
| `auth_name` | character varying | YES | Libellé métier affiché dans l'application. |
| `auth_srid` | integer | YES | Attribut métier ou technique du modèle. |
| `srtext` | character varying | YES | Attribut métier ou technique du modèle. |
| `proj4text` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `spatial_ref_sys_pkey`

#### Objet `public.geography_columns`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue du schéma `public` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `f_table_catalog` | name | YES | Attribut métier ou technique du modèle. |
| `f_table_schema` | name | YES | Attribut métier ou technique du modèle. |
| `f_table_name` | name | YES | Libellé métier affiché dans l'application. |
| `f_geography_column` | name | YES | Attribut métier ou technique du modèle. |
| `coord_dimension` | integer | YES | Attribut métier ou technique du modèle. |
| `srid` | integer | YES | Attribut métier ou technique du modèle. |
| `type` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `public.geometry_columns`

| Champ | Valeur |
|---|---|
| Type | view |
| Description | Vue du schéma `public` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 0 bytes |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `f_table_catalog` | character varying | YES | Attribut métier ou technique du modèle. |
| `f_table_schema` | name | YES | Attribut métier ou technique du modèle. |
| `f_table_name` | name | YES | Libellé métier affiché dans l'application. |
| `f_geometry_column` | name | YES | Attribut métier ou technique du modèle. |
| `coord_dimension` | integer | YES | Attribut métier ou technique du modèle. |
| `srid` | integer | YES | Attribut métier ou technique du modèle. |
| `type` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

### Schéma `qa`

Seuils et objets de contrôle qualité.

#### Objet `qa.variable_thresholds`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `qa` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `model` | character varying | NO | Attribut métier ou technique du modèle. |
| `variable_name` | character varying | NO | Libellé métier affiché dans l'application. |
| `scenario_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `min_value` | double precision | YES | Attribut métier ou technique du modèle. |
| `max_value` | double precision | YES | Attribut métier ou technique du modèle. |
| `warn_z_info` | double precision | NO | Attribut métier ou technique du modèle. |
| `warn_z_avertissement` | double precision | NO | Attribut métier ou technique du modèle. |
| `is_active` | boolean | NO | Indicateur d'état métier ou technique. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `uq_variable_thresholds_model_var_scenario`
- `variable_thresholds_pkey`

### Schéma `qualite`

Mesures de qualité des eaux et tables de prélèvement associées.

#### Objet `qualite.mesure_qualite_barrage`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 40 kB |
| PK | `temps`, `station_id`, `parametre_qualite`, `source_row_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | NO | Attribut métier ou technique du modèle. |
| `milieu_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `pas_temps` | character varying | NO | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | NO | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_qualite_barrages_mesures`, `metadata.v_mapping_parametre_coverage`

Index :
- `idx_qbar_param_tdesc`
- `idx_qbar_station_tdesc`
- `mesure_qualite_barrage_pkey`
- `mesure_qualite_barrage_temps_idx`

#### Objet `qualite.mesure_qualite_nappe`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 48 kB |
| PK | `temps`, `station_id`, `parametre_qualite`, `source_row_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `nappe_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_nappe` | text | YES | Code métier ou identifiant source. |
| `parametre_qualite` | text | NO | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `pas_temps` | character varying | NO | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | NO | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_nappe_unmapped` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_qualite_nappes_mesures`

Index :
- `idx_qnap_nappe_tdesc`
- `idx_qnap_param_tdesc`
- `idx_qnap_station_tdesc`
- `mesure_qualite_nappe_pkey`
- `mesure_qualite_nappe_temps_idx`

#### Objet `qualite.mesure_qualite_riviere`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 40 kB |
| PK | `temps`, `station_id`, `parametre_qualite`, `source_row_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | NO | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `pas_temps` | character varying | NO | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | NO | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `parametre_ref_id` -> `metadata.referentiel_parametre.id`
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_qualite_riviere_mesures`

Index :
- `idx_qriv_param_tdesc`
- `idx_qriv_station_tdesc`
- `mesure_qualite_riviere_pkey`
- `mesure_qualite_riviere_temps_idx`

#### Objet `qualite.mesure_qualite_sebou`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 40 kB |
| PK | `temps`, `station_id`, `parametre_qualite`, `source_row_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | NO | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `pas_temps` | character varying | NO | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | NO | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `parametre_ref_id` -> `metadata.referentiel_parametre.id`
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_qualite_sebou_mesures`

Index :
- `idx_qseb_param_tdesc`
- `idx_qseb_station_tdesc`
- `mesure_qualite_sebou_pkey`
- `mesure_qualite_sebou_temps_idx`

#### Objet `qualite.source_pollution_mesure_param`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `qualite` utilisée par le SAD. |
| Lignes estimées | 7191 |
| Taille | 3256 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `prelevement_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `param_code_legacy` | text | NO | Code métier ou identifiant source. |
| `valeur_raw` | text | YES | Attribut métier ou technique du modèle. |
| `valeur_num` | double precision | YES | Attribut métier ou technique du modèle. |
| `valeur_qualifier` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `qa_flag_value_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_value_non_numeric` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_unmapped` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `parametre_ref_id` -> `metadata.referentiel_parametre.id`
- FK `prelevement_id` -> `qualite.source_pollution_prelevement.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_sources_mesures_detail`, `api.v_source_pollution_prelevement`

Index :
- `idx_sp_mesure_param_code`
- `idx_sp_mesure_param_prelevement`
- `idx_sp_mesure_param_ref`
- `source_pollution_mesure_param_pkey`
- `source_pollution_mesure_param_prelevement_id_param_code_leg_key`

#### Objet `qualite.source_pollution_prelevement`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `qualite` utilisée par le SAD. |
| Lignes estimées | 141 |
| Taille | 128 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | uuid | NO | Identifiant technique primaire. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `date_reception` | date | YES | Attribut métier ou technique du modèle. |
| `date_prelevement` | date | YES | Attribut métier ou technique du modèle. |
| `point_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `abh` | text | YES | Attribut métier ou technique du modèle. |
| `cercle` | text | YES | Attribut métier ou technique du modèle. |
| `province` | text | YES | Attribut métier ou technique du modèle. |
| `commune` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `debit_raw` | text | YES | Attribut métier ou technique du modèle. |
| `nature` | text | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `observation_2` | text | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `qa_flag_missing_geom` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_missing_commune` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_inventaire_pollution_sources_mesures_detail`, `api.v_source_pollution_prelevement`

Index :
- `idx_sp_prelevement_date`
- `idx_sp_prelevement_geom`
- `source_pollution_prelevement_pkey`
- `source_pollution_prelevement_source_row_id_key`

#### Objet `qualite.source_pollution_prelevement_lien`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `qualite` utilisée par le SAD. |
| Lignes estimées | 116 |
| Taille | 104 kB |
| PK | `prelevement_id`, `entite_type`, `entite_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `prelevement_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `entite_type` | text | NO | Attribut métier ou technique du modèle. |
| `entite_id` | text | NO | Identifiant de liaison vers l'entité référencée. |
| `mapping_method` | text | NO | Attribut métier ou technique du modèle. |
| `is_primary` | boolean | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `prelevement_id` -> `qualite.source_pollution_prelevement.id`
- Consommateurs identifiés : `api.v_inventaire_pollution_sources_mesures_detail`, `api.v_source_pollution_prelevement`

Index :
- `idx_sp_lien_type_id`
- `source_pollution_prelevement_lien_pkey`

#### Objet `qualite.suivi_qualite_barrage_garde_hebdo`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `qualite` utilisée par le SAD. |
| Lignes estimées | 0 |
| Taille | 40 kB |
| PK | `temps`, `station_id`, `parametre_qualite`, `source_row_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `barrage_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `milieu_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | NO | Attribut métier ou technique du modèle. |
| `parametre_ref_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `source_row_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `pas_temps` | character varying | NO | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | NO | Indicateur d'état métier ou technique. |
| `qa_flag_null_value` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_negative` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_param_missing` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_station_unmapped` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_barrage_unmapped` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_checked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `station_id` -> `infra.stations_mesure.id`
- Consommateurs identifiés : `api.v_suivi_qualite_barrage_garde_hebdo`

Index :
- `idx_qbrghebdo_param_tdesc`
- `idx_qbrghebdo_station_tdesc`
- `suivi_qualite_barrage_hebdo_pkey`
- `suivi_qualite_barrage_hebdo_temps_idx`

### Schéma `security`

Utilisateurs, rôles, permissions et journaux de sécurité.

#### Objet `security.activity_logs`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Journal détaillé des actions applicatives et des appels API. |
| Lignes estimées | 67048 |
| Taille | 26 MB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `user_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `username` | character varying | YES | Libellé métier affiché dans l'application. |
| `method` | character varying | NO | Attribut métier ou technique du modèle. |
| `path` | character varying | NO | Attribut métier ou technique du modèle. |
| `status_code` | integer | NO | Code métier ou identifiant source. |
| `duration_ms` | integer | NO | Attribut métier ou technique du modèle. |
| `ip_address` | character varying | YES | Attribut métier ou technique du modèle. |
| `user_agent` | text | YES | Attribut métier ou technique du modèle. |
| `query_params` | text | YES | Attribut métier ou technique du modèle. |
| `request_payload` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `activity_logs_pkey`
- `idx_activity_logs_created_at`
- `idx_activity_logs_user_id`
- `idx_activity_logs_username`

#### Objet `security.auth_logs`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Journal des authentifications et connexions. |
| Lignes estimées | 61 |
| Taille | 104 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `user_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `username_attempted` | character varying | YES | Libellé métier affiché dans l'application. |
| `action` | character varying | NO | Attribut métier ou technique du modèle. |
| `status` | character varying | NO | Attribut métier ou technique du modèle. |
| `ip_address` | inet | YES | Attribut métier ou technique du modèle. |
| `user_agent` | text | YES | Attribut métier ou technique du modèle. |
| `details` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `user_id` -> `security.users.id`

Index :
- `auth_logs_pkey`
- `idx_auth_logs_created_at`
- `idx_auth_logs_user_id`

#### Objet `security.log_audit`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Objet de journalisation et de traçabilité. |
| Lignes estimées | 391 |
| Taille | 352 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `nom_table` | character varying | NO | Libellé métier affiché dans l'application. |
| `operation` | character varying | NO | Attribut métier ou technique du modèle. |
| `utilisateur_db` | character varying | NO | Attribut métier ou technique du modèle. |
| `date_action` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `donnees_anciennes` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `donnees_nouvelles` | jsonb | YES | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `log_audit_pkey`

#### Objet `security.password_history`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `security` utilisée par le SAD. |
| Lignes estimées | 7 |
| Taille | 24 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `user_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `password_hash` | character varying | NO | Attribut métier ou technique du modèle. |
| `changed_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `changed_by` | integer | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `user_id` -> `security.users.id`

Index :
- `password_history_pkey`

#### Objet `security.password_reset_requests`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `security` utilisée par le SAD. |
| Lignes estimées | 2 |
| Taille | 64 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `user_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `username_requested` | character varying | YES | Libellé métier affiché dans l'application. |
| `email_requested` | character varying | YES | Attribut métier ou technique du modèle. |
| `status` | character varying | NO | Attribut métier ou technique du modèle. |
| `requested_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `processed_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `processed_by` | integer | YES | Attribut métier ou technique du modèle. |
| `notes` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `user_id` -> `security.users.id`

Index :
- `idx_reset_requests_requested_at`
- `idx_reset_requests_status`
- `password_reset_requests_pkey`

#### Objet `security.password_reset_tokens`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `security` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 8192 bytes |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `user_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `token_hash` | character varying | NO | Attribut métier ou technique du modèle. |
| `expires_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `used_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `user_id` -> `security.users.id`

Index :
- `password_reset_tokens_pkey`

#### Objet `security.permissions`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `security` utilisée par le SAD. |
| Lignes estimées | 10 |
| Taille | 48 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code` | character varying | NO | Code métier ou identifiant source. |
| `label` | character varying | NO | Attribut métier ou technique du modèle. |
| `description` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `permissions_code_key`
- `permissions_pkey`

#### Objet `security.refresh_tokens`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `security` utilisée par le SAD. |
| Lignes estimées | 28 |
| Taille | 24 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `user_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `token_hash` | character varying | NO | Attribut métier ou technique du modèle. |
| `expires_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `revoked_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `user_id` -> `security.users.id`

Index :
- `refresh_tokens_pkey`

#### Objet `security.role_permissions`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `security` utilisée par le SAD. |
| Lignes estimées | 16 |
| Taille | 24 kB |
| PK | `role_id`, `permission_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `role_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `permission_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |

Relations :
- FK `permission_id` -> `security.permissions.id`
- FK `role_id` -> `security.roles.id`

Index :
- `role_permissions_pkey`

#### Objet `security.roles`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `security` utilisée par le SAD. |
| Lignes estimées | 3 |
| Taille | 48 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code` | character varying | NO | Code métier ou identifiant source. |
| `label` | character varying | NO | Attribut métier ou technique du modèle. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `roles_code_key`
- `roles_pkey`

#### Objet `security.users`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Comptes utilisateurs nominatifs de la plateforme. |
| Lignes estimées | 3 |
| Taille | 96 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `username` | character varying | NO | Libellé métier affiché dans l'application. |
| `email` | character varying | NO | Attribut métier ou technique du modèle. |
| `full_name` | character varying | YES | Libellé métier affiché dans l'application. |
| `password_hash` | character varying | NO | Attribut métier ou technique du modèle. |
| `role_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `is_active` | boolean | NO | Indicateur d'état métier ou technique. |
| `must_change_password` | boolean | NO | Attribut métier ou technique du modèle. |
| `failed_login_attempts` | integer | NO | Attribut métier ou technique du modèle. |
| `last_login_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `last_login_ip` | inet | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `updated_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `created_by` | integer | YES | Attribut métier ou technique du modèle. |
| `updated_by` | integer | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `role_id` -> `security.roles.id`

Index :
- `idx_users_email`
- `idx_users_username`
- `users_email_key`
- `users_pkey`
- `users_username_key`

### Schéma `staging`

Zone d'intégration et d'historisation intermédiaire.

#### Objet `staging._legacy_qualite_riviere`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 60097 |
| Taille | 3664 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `date_prelevement` | date | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `val_qual_riv` | double precision | YES | Valeur mesurée, calculée ou agrégée. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.decharges`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 139 |
| Taille | 80 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Date` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `Région` | character varying | YES | Attribut métier ou technique du modèle. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Ville` | character varying | YES | Attribut métier ou technique du modèle. |
| `Population` | character varying | YES | Attribut métier ou technique du modèle. |
| `nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `Code` | character varying | YES | Code métier ou identifiant source. |
| `X` | bigint | YES | Attribut métier ou technique du modèle. |
| `Y` | bigint | YES | Attribut métier ou technique du modèle. |
| `Z` | character varying | YES | Attribut métier ou technique du modèle. |
| `Type` | character varying | YES | Attribut métier ou technique du modèle. |
| `Surface_to` | character varying | YES | Attribut métier ou technique du modèle. |
| `Surface_oc` | character varying | YES | Attribut métier ou technique du modèle. |
| `Quantité` | character varying | YES | Attribut métier ou technique du modèle. |
| `Date_de_mi` | character varying | YES | Attribut métier ou technique du modèle. |
| `Station_tr` | character varying | YES | Attribut métier ou technique du modèle. |
| `Exitance_P` | character varying | YES | Attribut métier ou technique du modèle. |
| `Observatio` | character varying | YES | Attribut métier ou technique du modèle. |
| `Enquêteur` | character varying | YES | Attribut métier ou technique du modèle. |
| `Superviseu` | character varying | YES | Attribut métier ou technique du modèle. |
| `Abréviati` | character varying | YES | Attribut métier ou technique du modèle. |
| `Colonne1` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.decharges_Abondonees`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 11 |
| Taille | 16 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Date` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `Région` | character varying | YES | Attribut métier ou technique du modèle. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Ville` | character varying | YES | Attribut métier ou technique du modèle. |
| `Nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `x` | numeric | YES | Attribut métier ou technique du modèle. |
| `y` | numeric | YES | Attribut métier ou technique du modèle. |
| `F9` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.huileries`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 606 |
| Taille | 320 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Date` | character varying | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `Région` | character varying | YES | Attribut métier ou technique du modèle. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Cercle` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Localité` | character varying | YES | Attribut métier ou technique du modèle. |
| `Nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `Code` | character varying | YES | Code métier ou identifiant source. |
| `X` | numeric | YES | Attribut métier ou technique du modèle. |
| `Y` | numeric | YES | Attribut métier ou technique du modèle. |
| `Etat` | character varying | YES | Attribut métier ou technique du modèle. |
| `Type` | character varying | YES | Attribut métier ou technique du modèle. |
| `Adresse` | character varying | YES | Attribut métier ou technique du modèle. |
| `Propriéta` | character varying | YES | Attribut métier ou technique du modèle. |
| `Exploitant` | character varying | YES | Attribut métier ou technique du modèle. |
| `DC` | numeric | YES | Attribut métier ou technique du modèle. |
| `ST__m²_` | numeric | YES | Attribut métier ou technique du modèle. |
| `SC____` | numeric | YES | Attribut métier ou technique du modèle. |
| `SA__m²_` | numeric | YES | Attribut métier ou technique du modèle. |
| `SA__m²_1` | numeric | YES | Attribut métier ou technique du modèle. |
| `Accès` | character varying | YES | Attribut métier ou technique du modèle. |
| `PP` | numeric | YES | Attribut métier ou technique du modèle. |
| `PS` | numeric | YES | Attribut métier ou technique du modèle. |
| `EIE` | character varying | YES | Attribut métier ou technique du modèle. |
| `AE` | character varying | YES | Attribut métier ou technique du modèle. |
| `PE` | character varying | YES | Attribut métier ou technique du modèle. |
| `DCO` | date | YES | Attribut métier ou technique du modèle. |
| `FCO` | date | YES | Attribut métier ou technique du modèle. |
| `NJ` | numeric | YES | Attribut métier ou technique du modèle. |
| `CP__H_` | numeric | YES | Attribut métier ou technique du modèle. |
| `CMT_T_J_` | character varying | YES | Attribut métier ou technique du modèle. |
| `NLI` | numeric | YES | Attribut métier ou technique du modèle. |
| `QM__T_J_` | numeric | YES | Attribut métier ou technique du modèle. |
| `LS` | character varying | YES | Attribut métier ou technique du modèle. |
| `TS` | character varying | YES | Attribut métier ou technique du modèle. |
| `QS__T_` | numeric | YES | Attribut métier ou technique du modèle. |
| `DS__J_` | numeric | YES | Attribut métier ou technique du modèle. |
| `ETT` | character varying | YES | Attribut métier ou technique du modèle. |
| `ET_DDQ_kg_` | character varying | YES | Attribut métier ou technique du modèle. |
| `LT` | character varying | YES | Attribut métier ou technique du modèle. |
| `L_DDQ` | character varying | YES | Attribut métier ou technique du modèle. |
| `AS_` | character varying | YES | Attribut métier ou technique du modèle. |
| `QT__KGS_TO` | character varying | YES | Attribut métier ou technique du modèle. |
| `OMOY_T_J_` | character varying | YES | Attribut métier ou technique du modèle. |
| `OMOY_T_C_` | numeric | YES | Attribut métier ou technique du modèle. |
| `OMOY_T_AN_` | character varying | YES | Attribut métier ou technique du modèle. |
| `SMY_T_J_` | character varying | YES | Attribut métier ou technique du modèle. |
| `SMOY_T_C_` | character varying | YES | Attribut métier ou technique du modèle. |
| `SMOY_T_AN_` | character varying | YES | Attribut métier ou technique du modèle. |
| `NaOHM_T_J_` | character varying | YES | Attribut métier ou technique du modèle. |
| `NaOHM_T_C_` | character varying | YES | Attribut métier ou technique du modèle. |
| `NaOHM_T_A_` | character varying | YES | Attribut métier ou technique du modèle. |
| `HOM_l_J_` | numeric | YES | Attribut métier ou technique du modèle. |
| `HOM_m3_C_` | numeric | YES | Attribut métier ou technique du modèle. |
| `HOM_m3_An_` | character varying | YES | Attribut métier ou technique du modèle. |
| `SM_l_J_` | character varying | YES | Attribut métier ou technique du modèle. |
| `SM_m3_C_` | character varying | YES | Attribut métier ou technique du modèle. |
| `SM_m3_An_` | character varying | YES | Attribut métier ou technique du modèle. |
| `GMoy_l_J_` | character varying | YES | Attribut métier ou technique du modèle. |
| `GMoy_m3_C_` | character varying | YES | Attribut métier ou technique du modèle. |
| `GMoy___m3_` | character varying | YES | Attribut métier ou technique du modèle. |
| `O22_23_T_A` | character varying | YES | Attribut métier ou technique du modèle. |
| `S22_23_T_A` | character varying | YES | Attribut métier ou technique du modèle. |
| `HO22_23` | character varying | YES | Attribut métier ou technique du modèle. |
| `O23_24_T_A` | character varying | YES | Attribut métier ou technique du modèle. |
| `S23_24_T_A` | character varying | YES | Attribut métier ou technique du modèle. |
| `HO22_24` | character varying | YES | Attribut métier ou technique du modèle. |
| `OE` | character varying | YES | Attribut métier ou technique du modèle. |
| `VPm3_j` | character varying | YES | Attribut métier ou technique du modèle. |
| `VSm3_j` | character varying | YES | Attribut métier ou technique du modèle. |
| `VLm3_j` | character varying | YES | Attribut métier ou technique du modèle. |
| `UEP_` | character varying | YES | Attribut métier ou technique du modèle. |
| `UES_` | character varying | YES | Attribut métier ou technique du modèle. |
| `UEL_` | character varying | YES | Attribut métier ou technique du modèle. |
| `LSRL_X` | numeric | YES | Attribut métier ou technique du modèle. |
| `LSRL_Y` | numeric | YES | Attribut métier ou technique du modèle. |
| `LSRL_Z` | character varying | YES | Attribut métier ou technique du modèle. |
| `TS2` | character varying | YES | Attribut métier ou technique du modèle. |
| `NB` | numeric | YES | Attribut métier ou technique du modèle. |
| `Vm3_B` | character varying | YES | Attribut métier ou technique du modèle. |
| `PB_M` | character varying | YES | Attribut métier ou technique du modèle. |
| `PT` | character varying | YES | Attribut métier ou technique du modèle. |
| `TPT` | character varying | YES | Attribut métier ou technique du modèle. |
| `Quantité` | character varying | YES | Attribut métier ou technique du modèle. |
| `MR_X` | character varying | YES | Attribut métier ou technique du modèle. |
| `MR_Y` | character varying | YES | Attribut métier ou technique du modèle. |
| `MR_Z` | character varying | YES | Attribut métier ou technique du modèle. |
| `RCµs_cm` | character varying | YES | Attribut métier ou technique du modèle. |
| `RC_Ph` | character varying | YES | Attribut métier ou technique du modèle. |
| `RC_T°` | character varying | YES | Attribut métier ou technique du modèle. |
| `RC_MES_mg_` | character varying | YES | Attribut métier ou technique du modèle. |
| `RC_HG_mg_l` | character varying | YES | Attribut métier ou technique du modèle. |
| `RC_DBO5` | character varying | YES | Attribut métier ou technique du modèle. |
| `RC_DCO` | character varying | YES | Attribut métier ou technique du modèle. |
| `RCl_s` | character varying | YES | Attribut métier ou technique du modèle. |
| `G_MR` | character varying | YES | Attribut métier ou technique du modèle. |
| `G_QST_J` | numeric | YES | Attribut métier ou technique du modèle. |
| `GV` | character varying | YES | Attribut métier ou technique du modèle. |
| `DO_MR` | character varying | YES | Attribut métier ou technique du modèle. |
| `DO_QT_T_J` | numeric | YES | Attribut métier ou technique du modèle. |
| `DV` | character varying | YES | Attribut métier ou technique du modèle. |
| `AD_MR` | character varying | YES | Attribut métier ou technique du modèle. |
| `AD_QS_T_j` | character varying | YES | Attribut métier ou technique du modèle. |
| `AD_V` | character varying | YES | Attribut métier ou technique du modèle. |
| `Observatio` | character varying | YES | Attribut métier ou technique du modèle. |
| `Enquêteur` | character varying | YES | Attribut métier ou technique du modèle. |
| `Superviseu` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.mesure_precipitation_old_model`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 507930 |
| Taille | 34 MB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `temps` | timestamp with time zone | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `station_id` | uuid | YES | Identifiant de liaison vers l'entité référencée. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `pas_temps` | character varying | YES | Attribut métier ou technique du modèle. |
| `est_valide` | boolean | YES | Indicateur d'état métier ou technique. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.mesures_debit_jr`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 173251 |
| Taille | 18 MB |
| PK | `code_debit` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `code_debit` | integer | NO | Code métier ou identifiant source. |
| `date_jr` | date | NO | Attribut métier ou technique du modèle. |
| `debit_jr` | double precision | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_mesures_debit_station_date`
- `mesures_debit_jr_pkey`

#### Objet `staging.mesures_debit_m`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 19316 |
| Taille | 2448 kB |
| PK | `code_debit_m` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `code_debit_m` | integer | NO | Code métier ou identifiant source. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `mois` | text | YES | Attribut métier ou technique du modèle. |
| `annee` | text | YES | Attribut métier ou technique du modèle. |
| `debit_m` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_mesures_debit_m_station_month`
- `mesures_debit_m_pkey`

#### Objet `staging.mesures_debit_sources`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 2816 |
| Taille | 408 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `moment` | timestamp without time zone | YES | Attribut métier ou technique du modèle. |
| `ire_source` | text | YES | Attribut métier ou technique du modèle. |
| `debit` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_mds_ire_moment`
- `mesures_debit_sources_pkey`

#### Objet `staging.mesures_evaporation_jr`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 48900 |
| Taille | 5208 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `date_mesure` | date | YES | Attribut métier ou technique du modèle. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `val_evaporation` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_mevapo_station_date`
- `mesures_evaporation_jr_pkey`

#### Objet `staging.mesures_niv_eau_barrages`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 85166 |
| Taille | 11 MB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `date_jr` | date | YES | Attribut métier ou technique du modèle. |
| `ire_barrage` | text | YES | Attribut métier ou technique du modèle. |
| `niveau_eau_m_ngm` | double precision | YES | Attribut métier ou technique du modèle. |
| `volume_mm3` | double precision | YES | Attribut métier ou technique du modèle. |
| `restitutions_mm3` | double precision | YES | Attribut métier ou technique du modèle. |
| `transfert_mm3` | double precision | YES | Attribut métier ou technique du modèle. |
| `apports_mm3` | double precision | YES | Attribut métier ou technique du modèle. |
| `observations` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_niv_barrages_ire_date`
- `mesures_niv_eau_barrages_pkey`

#### Objet `staging.mesures_precip`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 669880 |
| Taille | 63 MB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id_precipitation_jr` | integer | YES | Attribut métier ou technique du modèle. |
| `ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |
| `date_jr` | date | YES | Attribut métier ou technique du modèle. |
| `precipitation_jr` | double precision | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_mesures_precip_station_date`

#### Objet `staging.mesures_precipitations_jr_max`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 2085 |
| Taille | 432 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `annee` | integer | YES | Attribut métier ou technique du modèle. |
| `date_jr` | date | YES | Attribut métier ou technique du modèle. |
| `p_max` | double precision | YES | Attribut métier ou technique du modèle. |
| `p_annuelle` | double precision | YES | Attribut métier ou technique du modèle. |
| `nbr_val_jr_mqt` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_mois` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_j_avec_0` | integer | YES | Attribut métier ou technique du modèle. |
| `nb_j_sans_0` | integer | YES | Attribut métier ou technique du modèle. |
| `y` | double precision | YES | Attribut métier ou technique du modèle. |
| `ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_precip_max_ire_precip`
- `idx_stg_precip_max_station_year`
- `mesures_precipitations_jr_max_pkey`

#### Objet `staging.mesures_precipitations_jr_traitees`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 546007 |
| Taille | 69 MB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `date_jr` | date | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `val_observees` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_power_nasa` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `val_remplies` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `ire_precipitation` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_precip_tr_station_date`
- `mesures_precipitations_jr_traitees_pkey`

#### Objet `staging.mesures_qualite_barrages`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 8714 |
| Taille | 1168 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `date_prelevement` | date | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `milieu_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `val_qual_barr` | double precision | YES | Valeur mesurée, calculée ou agrégée. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_qbar_station_date_param`
- `mesures_qualite_barrages_pkey`

#### Objet `staging.mesures_qualite_nappes`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 63088 |
| Taille | 7392 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `date_prelevement` | date | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `val_qual_nap` | double precision | YES | Valeur mesurée, calculée ou agrégée. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_qnap_station_date_param`
- `mesures_qualite_nappes_pkey`

#### Objet `staging.mines`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 39 |
| Taille | 16 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `N°_Licenc` | numeric | YES | Attribut métier ou technique du modèle. |
| `X` | numeric | YES | Attribut métier ou technique du modèle. |
| `Y` | numeric | YES | Attribut métier ou technique du modèle. |
| `Nat_des_mi` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.points_eau_abhs`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 46 |
| Taille | 56 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_pt_eau` | text | YES | Code métier ou identifiant source. |
| `utilisation` | text | YES | Attribut métier ou technique du modèle. |
| `dist_pt_eau_foyer_pollut_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `foyer_pollution` | text | YES | Attribut métier ou technique du modèle. |
| `nom_pt_eau` | text | YES | Libellé métier affiché dans l'application. |
| `date_realisation` | date | YES | Attribut métier ou technique du modèle. |
| `profond_tot_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `vol_preleve_m3_an` | double precision | YES | Attribut métier ou technique du modèle. |
| `nature` | text | YES | Attribut métier ou technique du modèle. |
| `niv_piezometrique_m` | double precision | YES | Attribut métier ou technique du modèle. |
| `equipe` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z` | double precision | YES | Attribut métier ou technique du modèle. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_points_eau_code`
- `points_eau_abhs_pkey`

#### Objet `staging.profils_stations`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 1980 |
| Taille | 360 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `points` | text | YES | Attribut métier ou technique du modèle. |
| `type_profil` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `altitude_z` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_profils_station_ire`
- `profils_stations_pkey`

#### Objet `staging.rejet_abattoir`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 56 |
| Taille | 16 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `X` | numeric | YES | Attribut métier ou technique du modèle. |
| `Y` | numeric | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.rejets_brutes`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 277 |
| Taille | 104 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Date` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `Région` | character varying | YES | Attribut métier ou technique du modèle. |
| `Provinces` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Ville` | character varying | YES | Attribut métier ou technique du modèle. |
| `Population` | numeric | YES | Attribut métier ou technique du modèle. |
| `Code_rejet` | character varying | YES | Code métier ou identifiant source. |
| `X` | numeric | YES | Attribut métier ou technique du modèle. |
| `Y` | numeric | YES | Attribut métier ou technique du modèle. |
| `Ø` | numeric | YES | Attribut métier ou technique du modèle. |
| `Forme` | character varying | YES | Attribut métier ou technique du modèle. |
| `Q__l_s_` | numeric | YES | Attribut métier ou technique du modèle. |
| `Milieu_ré` | character varying | YES | Attribut métier ou technique du modèle. |
| `Réutilisa` | character varying | YES | Attribut métier ou technique du modèle. |
| `Observatio` | character varying | YES | Attribut métier ou technique du modèle. |
| `Enquêteur` | character varying | YES | Attribut métier ou technique du modèle. |
| `Superviseu` | character varying | YES | Attribut métier ou technique du modèle. |
| `Abréviati` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.sources_polution_mesure`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 141 |
| Taille | 88 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Date_Recep` | date | YES | Attribut métier ou technique du modèle. |
| `Point_de_p` | character varying | YES | Attribut métier ou technique du modèle. |
| `X` | numeric | YES | Attribut métier ou technique du modèle. |
| `Y` | numeric | YES | Attribut métier ou technique du modèle. |
| `T_air` | numeric | YES | Attribut métier ou technique du modèle. |
| `T_eau` | numeric | YES | Attribut métier ou technique du modèle. |
| `pH` | numeric | YES | Attribut métier ou technique du modèle. |
| `Conduc` | numeric | YES | Attribut métier ou technique du modèle. |
| `O2_Diss` | numeric | YES | Attribut métier ou technique du modèle. |
| `Turbidité` | numeric | YES | Attribut métier ou technique du modèle. |
| `DCO` | numeric | YES | Attribut métier ou technique du modèle. |
| `DBO5` | numeric | YES | Attribut métier ou technique du modèle. |
| `NTK` | numeric | YES | Attribut métier ou technique du modèle. |
| `NH4_` | numeric | YES | Attribut métier ou technique du modèle. |
| `PT` | numeric | YES | Attribut métier ou technique du modèle. |
| `PO43_` | numeric | YES | Attribut métier ou technique du modèle. |
| `MES` | character varying | YES | Attribut métier ou technique du modèle. |
| `Phénol` | character varying | YES | Attribut métier ou technique du modèle. |
| `Huiles_Gra` | character varying | YES | Attribut métier ou technique du modèle. |
| `NO3_` | character varying | YES | Attribut métier ou technique du modèle. |
| `NO2_` | character varying | YES | Attribut métier ou technique du modèle. |
| `Cl_` | numeric | YES | Attribut métier ou technique du modèle. |
| `SO4__` | numeric | YES | Attribut métier ou technique du modèle. |
| `Ca__` | numeric | YES | Attribut métier ou technique du modèle. |
| `Mg__` | numeric | YES | Attribut métier ou technique du modèle. |
| `TH` | numeric | YES | Attribut métier ou technique du modèle. |
| `Na_` | numeric | YES | Attribut métier ou technique du modèle. |
| `K_` | numeric | YES | Attribut métier ou technique du modèle. |
| `Ag` | character varying | YES | Attribut métier ou technique du modèle. |
| `Al` | character varying | YES | Attribut métier ou technique du modèle. |
| `As_` | character varying | YES | Attribut métier ou technique du modèle. |
| `Ba` | character varying | YES | Attribut métier ou technique du modèle. |
| `Be` | character varying | YES | Attribut métier ou technique du modèle. |
| `Cd` | character varying | YES | Attribut métier ou technique du modèle. |
| `Co` | character varying | YES | Attribut métier ou technique du modèle. |
| `CrT` | character varying | YES | Attribut métier ou technique du modèle. |
| `Cu` | character varying | YES | Attribut métier ou technique du modèle. |
| `Fe` | character varying | YES | Attribut métier ou technique du modèle. |
| `Hg` | character varying | YES | Attribut métier ou technique du modèle. |
| `Fe2_` | character varying | YES | Attribut métier ou technique du modèle. |
| `Mn` | character varying | YES | Attribut métier ou technique du modèle. |
| `Mo` | character varying | YES | Attribut métier ou technique du modèle. |
| `Ni` | character varying | YES | Attribut métier ou technique du modèle. |
| `Pb` | character varying | YES | Attribut métier ou technique du modèle. |
| `Sb` | character varying | YES | Attribut métier ou technique du modèle. |
| `Se` | character varying | YES | Attribut métier ou technique du modèle. |
| `Tl` | character varying | YES | Attribut métier ou technique du modèle. |
| `Sn` | character varying | YES | Attribut métier ou technique du modèle. |
| `V` | character varying | YES | Attribut métier ou technique du modèle. |
| `Zn` | character varying | YES | Attribut métier ou technique du modèle. |
| `Li` | character varying | YES | Attribut métier ou technique du modèle. |
| `Sr` | character varying | YES | Attribut métier ou technique du modèle. |
| `CT` | character varying | YES | Attribut métier ou technique du modèle. |
| `CF` | character varying | YES | Attribut métier ou technique du modèle. |
| `SF` | character varying | YES | Attribut métier ou technique du modèle. |
| `Date_de__p` | date | YES | Attribut métier ou technique du modèle. |
| `ABH` | character varying | YES | Attribut métier ou technique du modèle. |
| `Cercle` | character varying | YES | Attribut métier ou technique du modèle. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Observatio` | character varying | YES | Attribut métier ou technique du modèle. |
| `Débit` | character varying | YES | Attribut métier ou technique du modèle. |
| `Obdervatio` | character varying | YES | Attribut métier ou technique du modèle. |
| `Nature` | character varying | YES | Attribut métier ou technique du modèle. |
| `Parametre` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.sous_bassin_swat_bas_sebou_new`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 29 |
| Taille | 432 kB |
| PK | `gid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `gid` | integer | NO | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `sll` | numeric | YES | Attribut métier ou technique du modèle. |
| `csl` | numeric | YES | Attribut métier ou technique du modèle. |
| `wid1` | numeric | YES | Attribut métier ou technique du modèle. |
| `dep1` | numeric | YES | Attribut métier ou technique du modèle. |
| `lat` | numeric | YES | Attribut métier ou technique du modèle. |
| `long_` | numeric | YES | Attribut métier ou technique du modèle. |
| `elev` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmin` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmax` | numeric | YES | Attribut métier ou technique du modèle. |
| `bname` | character varying | YES | Libellé métier affiché dans l'application. |
| `shape_len` | numeric | YES | Attribut métier ou technique du modèle. |
| `shape_area` | numeric | YES | Attribut métier ou technique du modèle. |
| `hydroid` | integer | YES | Attribut métier ou technique du modèle. |
| `outletid` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `sous_bassin_swat_bas_sebou_new_geom_idx`
- `sous_bassin_swat_bas_sebou_new_pkey`

#### Objet `staging.sous_bassin_swat_bassin_cotier_new`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 23 |
| Taille | 328 kB |
| PK | `gid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `gid` | integer | NO | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `sll` | numeric | YES | Attribut métier ou technique du modèle. |
| `csl` | numeric | YES | Attribut métier ou technique du modèle. |
| `wid1` | numeric | YES | Attribut métier ou technique du modèle. |
| `dep1` | numeric | YES | Attribut métier ou technique du modèle. |
| `lat` | numeric | YES | Attribut métier ou technique du modèle. |
| `long_` | numeric | YES | Attribut métier ou technique du modèle. |
| `elev` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmin` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmax` | numeric | YES | Attribut métier ou technique du modèle. |
| `bname` | character varying | YES | Libellé métier affiché dans l'application. |
| `shape_len` | numeric | YES | Attribut métier ou technique du modèle. |
| `shape_area` | numeric | YES | Attribut métier ou technique du modèle. |
| `hydroid` | integer | YES | Attribut métier ou technique du modèle. |
| `outletid` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `sous_bassin_swat_bassin_cotier_new_geom_idx`
- `sous_bassin_swat_bassin_cotier_new_pkey`

#### Objet `staging.sous_bassin_swat_beht_new`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 27 |
| Taille | 488 kB |
| PK | `gid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `gid` | integer | NO | Attribut métier ou technique du modèle. |
| `polygonid` | double precision | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `sous_bassin_swat_beht_new_geom_idx`
- `sous_bassin_swat_beht_new_pkey`

#### Objet `staging.sous_bassin_swat_haut_sebou_new`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 22 |
| Taille | 448 kB |
| PK | `gid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `gid` | integer | NO | Attribut métier ou technique du modèle. |
| `polygonid` | double precision | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `sous_bassin_swat_haut_sebou_new_geom_idx`
- `sous_bassin_swat_haut_sebou_new_pkey`

#### Objet `staging.sous_bassin_swat_leben_innaouen_new`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 18 |
| Taille | 408 kB |
| PK | `gid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `gid` | integer | NO | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `hydroid` | integer | YES | Attribut métier ou technique du modèle. |
| `outletid` | integer | YES | Attribut métier ou technique du modèle. |
| `nom_stat` | character varying | YES | Libellé métier affiché dans l'application. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `sous_bassin_swat_leben_innaouen_new_geom_idx`
- `sous_bassin_swat_leben_innaouen_new_pkey`

#### Objet `staging.sous_bassin_swat_moyen_sebou_new`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 16 |
| Taille | 320 kB |
| PK | `gid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `gid` | integer | NO | Attribut métier ou technique du modèle. |
| `polygonid` | double precision | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `sous_bassin_swat_moyen_sebou_new_geom_idx`
- `sous_bassin_swat_moyen_sebou_new_pkey`

#### Objet `staging.sous_bassin_swat_ouergha_new`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 39 |
| Taille | 544 kB |
| PK | `gid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `gid` | integer | NO | Attribut métier ou technique du modèle. |
| `subbasin` | integer | YES | Attribut métier ou technique du modèle. |
| `area` | numeric | YES | Attribut métier ou technique du modèle. |
| `slo1` | numeric | YES | Attribut métier ou technique du modèle. |
| `len1` | numeric | YES | Attribut métier ou technique du modèle. |
| `sll` | numeric | YES | Attribut métier ou technique du modèle. |
| `csl` | numeric | YES | Attribut métier ou technique du modèle. |
| `wid1` | numeric | YES | Attribut métier ou technique du modèle. |
| `dep1` | numeric | YES | Attribut métier ou technique du modèle. |
| `lat` | numeric | YES | Attribut métier ou technique du modèle. |
| `long_` | numeric | YES | Attribut métier ou technique du modèle. |
| `elev` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmin` | numeric | YES | Attribut métier ou technique du modèle. |
| `elevmax` | numeric | YES | Attribut métier ou technique du modèle. |
| `bname` | character varying | YES | Libellé métier affiché dans l'application. |
| `shape_len` | numeric | YES | Attribut métier ou technique du modèle. |
| `shape_area` | numeric | YES | Attribut métier ou technique du modèle. |
| `hydroid` | integer | YES | Attribut métier ou technique du modèle. |
| `outletid` | integer | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `sous_bassin_swat_ouergha_new_geom_idx`
- `sous_bassin_swat_ouergha_new_pkey`

#### Objet `staging.step_ind_abhs`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 15 |
| Taille | 32 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | character varying | YES | Identifiant technique primaire. |
| `code_commune` | character varying | YES | Code métier ou identifiant source. |
| `code_step` | character varying | YES | Code métier ou identifiant source. |
| `nom_step` | character varying | YES | Libellé métier affiché dans l'application. |
| `secteur` | character varying | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_step_ind_code_commune`

#### Objet `staging.steps`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 49 |
| Taille | 48 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Date` | character varying | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `Région` | character varying | YES | Attribut métier ou technique du modèle. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Ville` | character varying | YES | Attribut métier ou technique du modèle. |
| `Population` | character varying | YES | Attribut métier ou technique du modèle. |
| `Code_STEP` | character varying | YES | Code métier ou identifiant source. |
| `X` | numeric | YES | Attribut métier ou technique du modèle. |
| `Y` | numeric | YES | Attribut métier ou technique du modèle. |
| `Type_de_st` | character varying | YES | Attribut métier ou technique du modèle. |
| `Niveau__d_` | character varying | YES | Attribut métier ou technique du modèle. |
| `Etat` | character varying | YES | Attribut métier ou technique du modèle. |
| `Superficie` | character varying | YES | Attribut métier ou technique du modèle. |
| `Volume_eau` | character varying | YES | Attribut métier ou technique du modèle. |
| `Capacité` | character varying | YES | Attribut métier ou technique du modèle. |
| `DBO5___fil` | character varying | YES | Attribut métier ou technique du modèle. |
| `DCO__filtr` | character varying | YES | Attribut métier ou technique du modèle. |
| `MES__brut_` | character varying | YES | Attribut métier ou technique du modèle. |
| `Réutilisa` | character varying | YES | Attribut métier ou technique du modèle. |
| `Usage` | character varying | YES | Attribut métier ou technique du modèle. |
| `Observatio` | character varying | YES | Attribut métier ou technique du modèle. |
| `Enquêteur` | character varying | YES | Attribut métier ou technique du modèle. |
| `Superviseu` | character varying | YES | Attribut métier ou technique du modèle. |
| `Abréviati` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.steps_industrielles`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `Secteur` | character varying | YES | Attribut métier ou technique du modèle. |
| `DBO5_mgO2_` | character varying | YES | Attribut métier ou technique du modèle. |
| `DCO_mgO2_l` | character varying | YES | Attribut métier ou technique du modèle. |
| `MES_mg_l_` | character varying | YES | Attribut métier ou technique du modèle. |
| `X` | numeric | YES | Attribut métier ou technique du modèle. |
| `Y` | numeric | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.stm_abhs`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 18 |
| Taille | 48 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `code_commune` | text | YES | Code métier ou identifiant source. |
| `code_stm` | text | YES | Code métier ou identifiant source. |
| `nom_stm` | text | YES | Libellé métier affiché dans l'application. |
| `etat` | text | YES | Attribut métier ou technique du modèle. |
| `coord_x` | double precision | YES | Attribut métier ou technique du modèle. |
| `coord_y` | double precision | YES | Attribut métier ou technique du modèle. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_stm_code_commune`
- `stm_abhs_pkey`

#### Objet `staging.stms`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 19 |
| Taille | 16 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `Province` | character varying | YES | Attribut métier ou technique du modèle. |
| `Commune` | character varying | YES | Attribut métier ou technique du modèle. |
| `Nom` | character varying | YES | Libellé métier affiché dans l'application. |
| `Etat` | character varying | YES | Attribut métier ou technique du modèle. |
| `X` | numeric | YES | Attribut métier ou technique du modèle. |
| `Y` | numeric | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `staging.suivi_qualite_brg_garde_hebdo`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 7094 |
| Taille | 912 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `date_prelevement` | date | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `milieu_prelevement` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `val_qual_brg_garde_hebdo` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `idx_stg_suivi_brg_station_date_param`
- `suivi_qualite_brg_garde_hebdo_pkey`

#### Objet `staging.suivi_qualite_sebou`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `staging` utilisée par le SAD. |
| Lignes estimées | 51402 |
| Taille | 3304 kB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | YES | Identifiant technique primaire. |
| `date_prelevement` | date | YES | Attribut métier ou technique du modèle. |
| `ire_station` | text | YES | Attribut métier ou technique du modèle. |
| `parametre_qualite` | text | YES | Attribut métier ou technique du modèle. |
| `val_qual_sebou_jr` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `observation` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

### Schéma `swat_output`

Sorties et référentiels issus du modèle SWAT.

#### Objet `swat_output.mesure_qualite_subbasin_ts`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 48 kB |
| PK | `run_id`, `subbasin_uid`, `temps`, `param_code` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `run_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `subbasin_uid` | text | NO | Attribut métier ou technique du modèle. |
| `temps` | date | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `param_code` | text | NO | Code métier ou identifiant source. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `qa_flag_null` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_non_numeric` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `qa_flag_outlier` | boolean | NO | Indicateur booléen signalant une anomalie QA spécifique. |
| `source_system` | text | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `param_code` -> `swat_output.ref_parametre_qualite.param_code`
- FK `run_id` -> `swat_output.ref_run_modele.run_id`
- FK `subbasin_uid` -> `swat_output.ref_subbasin.subbasin_uid`
- Consommateurs identifiés : `api.v_hierarchie_metier_listing`, `api.v_swat_qualite_subbasin_consolide`

Index :
- `idx_swat_q_run_param_tdesc`
- `idx_swat_q_run_sub_tdesc`
- `idx_swat_q_sub_param_tdesc`
- `mesure_qualite_subbasin_ts_pkey`
- `mesure_qualite_subbasin_ts_temps_idx`

#### Objet `swat_output.ref_bassin`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `swat_output` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `bassin_code` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `bassin_code` | text | NO | Code métier ou identifiant source. |
| `bassin_nom` | text | NO | Libellé métier affiché dans l'application. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_swat_qualite_subbasin_consolide`, `api.v_wasp_qualite_segment_consolide`

Index :
- `ref_bassin_pkey`

#### Objet `swat_output.ref_parametre_qualite`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `swat_output` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `param_code` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `param_code` | text | NO | Code métier ou identifiant source. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_hierarchie_metier_listing`, `api.v_swat_qualite_subbasin_consolide`

Index :
- `ref_parametre_qualite_pkey`

#### Objet `swat_output.ref_run_modele`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `swat_output` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 48 kB |
| PK | `run_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `run_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `run_code` | text | NO | Code métier ou identifiant source. |
| `bassin_code` | text | NO | Code métier ou identifiant source. |
| `scenario_code` | text | NO | Code métier ou identifiant source. |
| `version_modele` | text | YES | Attribut métier ou technique du modèle. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `date_run` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `is_reference` | boolean | NO | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `bassin_code` -> `swat_output.ref_bassin.bassin_code`
- FK `scenario_code` -> `swat_output.ref_scenario.scenario_code`
- Consommateurs identifiés : `api.v_swat_qualite_subbasin_consolide`

Index :
- `ref_run_modele_pkey`
- `ref_run_modele_run_code_key`

#### Objet `swat_output.ref_scenario`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de scénarios utilisée pour référencer les jeux de simulation. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `scenario_code` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `scenario_code` | text | NO | Code métier ou identifiant source. |
| `scenario_nom` | text | NO | Libellé métier affiché dans l'application. |
| `scenario_type` | text | NO | Attribut métier ou technique du modèle. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_swat_qualite_subbasin_consolide`, `api.v_wasp_qualite_segment_consolide`

Index :
- `ref_scenario_pkey`

#### Objet `swat_output.ref_subbasin`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `swat_output` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 424 kB |
| PK | `subbasin_uid` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `subbasin_uid` | text | NO | Attribut métier ou technique du modèle. |
| `bassin_code` | text | NO | Code métier ou identifiant source. |
| `subbasin_local_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `geo_sous_bassin_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `hydro_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `outlet_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `geom` | USER-DEFINED | YES | Géométrie spatiale utilisée pour la cartographie. |
| `created_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- FK `bassin_code` -> `swat_output.ref_bassin.bassin_code`
- FK `geo_sous_bassin_id` -> `geo.sous_bassin_swat_leben_innaouen.id`
- Consommateurs identifiés : `api.v_swat_qualite_subbasin_consolide`

Index :
- `idx_ref_subbasin_geom`
- `ref_subbasin_bassin_code_subbasin_local_id_key`
- `ref_subbasin_pkey`

#### Objet `swat_output.stg_swat_qualite_long`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `swat_output` utilisée par le SAD. |
| Lignes estimées | 745110 |
| Taille | 167 MB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `run_code` | text | NO | Code métier ou identifiant source. |
| `bassin_code` | text | NO | Code métier ou identifiant source. |
| `scenario_code` | text | NO | Code métier ou identifiant source. |
| `param_code` | text | NO | Code métier ou identifiant source. |
| `date_txt` | text | NO | Attribut métier ou technique du modèle. |
| `subbasin_local_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `valeur_txt` | text | YES | Attribut métier ou technique du modèle. |
| `valeur_num` | double precision | YES | Attribut métier ou technique du modèle. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `loaded_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

#### Objet `swat_output.stg_swat_qualite_meta`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `swat_output` utilisée par le SAD. |
| Lignes estimées | 123 |
| Taille | 96 kB |
| PK | `run_code`, `sheet_name`, `row_idx` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `run_code` | text | NO | Code métier ou identifiant source. |
| `sheet_name` | text | NO | Libellé métier affiché dans l'application. |
| `row_idx` | integer | NO | Attribut métier ou technique du modèle. |
| `payload` | jsonb | NO | Charge JSON utilisée pour stocker des attributs ou paramètres dynamiques. |
| `loaded_at` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `stg_swat_qualite_meta_pkey`

### Schéma `swat_sebou`

Scénarios et résultats SWAT consolidés pour Sebou.

#### Objet `swat_sebou.swat_models`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `swat_sebou` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 16 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `name` | text | NO | Libellé métier affiché dans l'application. |
| `version` | text | YES | Attribut métier ou technique du modèle. |
| `description` | text | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `swat_models_pkey`

#### Objet `swat_sebou.swat_reach_results`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de résultats simulés ou consolidés. |
| Lignes estimées | -1 |
| Taille | 8192 bytes |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `scenario_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `reach` | integer | NO | Attribut métier ou technique du modèle. |
| `date` | date | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `flow_in` | double precision | YES | Attribut métier ou technique du modèle. |
| `flow_out` | double precision | YES | Attribut métier ou technique du modèle. |
| `sed_in` | double precision | YES | Attribut métier ou technique du modèle. |
| `sed_out` | double precision | YES | Attribut métier ou technique du modèle. |
| `no3_out` | double precision | YES | Attribut métier ou technique du modèle. |
| `orgp_out` | double precision | YES | Attribut métier ou technique du modèle. |
| `chla_out` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `scenario_id` -> `swat_sebou.swat_scenarios.id`

Index :
- `swat_reach_results_pkey`

#### Objet `swat_sebou.swat_scenarios`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Référentiel des scénarios SWAT disponibles. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `model_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `name` | text | NO | Libellé métier affiché dans l'application. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `start_date` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `end_date` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `timestep` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `model_id` -> `swat_sebou.swat_models.id`

Index :
- `swat_scenarios_pkey`

#### Objet `swat_sebou.swat_subbasin_results`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Résultats SWAT consolidés par sous-bassin et par date. |
| Lignes estimées | -1 |
| Taille | 8192 bytes |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `scenario_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `subbasin` | integer | NO | Attribut métier ou technique du modèle. |
| `date` | date | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `precip` | double precision | YES | Attribut métier ou technique du modèle. |
| `surq` | double precision | YES | Attribut métier ou technique du modèle. |
| `gw_q` | double precision | YES | Attribut métier ou technique du modèle. |
| `wyld` | double precision | YES | Attribut métier ou technique du modèle. |
| `sedp` | double precision | YES | Attribut métier ou technique du modèle. |
| `orgn` | double precision | YES | Attribut métier ou technique du modèle. |
| `solp` | double precision | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `scenario_id` -> `swat_sebou.swat_scenarios.id`

Index :
- `swat_subbasin_results_pkey`

### Schéma `wasp_output`

Sorties et référentiels issus du modèle WASP.

#### Objet `wasp_output.mesure_qualite_segment_ts`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table de mesures métier historisées par date et entité. |
| Lignes estimées | 0 |
| Taille | 56 kB |
| PK | `run_id`, `code_parametre`, `segment_local_id`, `ts_utc` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `run_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `bassin_code` | text | NO | Code métier ou identifiant source. |
| `scenario_code` | text | NO | Code métier ou identifiant source. |
| `segment_local_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `reseau_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `code_parametre` | text | NO | Code métier ou identifiant source. |
| `ts_utc` | timestamp with time zone | NO | Attribut métier ou technique du modèle. |
| `bucket_day` | date | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `source_system` | text | YES | Attribut métier ou technique du modèle. |
| `qa_flags` | ARRAY | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `bassin_code` -> `wasp_output.ref_segment_modele.bassin_code`
- FK `segment_local_id` -> `wasp_output.ref_segment_modele.segment_local_id`
- FK `code_parametre` -> `wasp_output.ref_parametre_qualite.code_parametre`
- FK `run_id` -> `wasp_output.ref_run_modele.run_id`
- Consommateurs identifiés : `api.v_hierarchie_metier_listing`, `api.v_wasp_qualite_segment_consolide`

Index :
- `idx_wasp_mesure_segment_ts_bucket`
- `idx_wasp_mesure_segment_ts_param`
- `idx_wasp_mesure_segment_ts_run`
- `idx_wasp_mesure_segment_ts_segment`
- `mesure_qualite_segment_ts_pkey`
- `mesure_qualite_segment_ts_ts_utc_idx`

#### Objet `wasp_output.ref_parametre_qualite`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `wasp_output` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `code_parametre` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `code_parametre` | text | NO | Code métier ou identifiant source. |
| `nom_parametre` | text | NO | Libellé métier affiché dans l'application. |
| `unite` | text | YES | Attribut métier ou technique du modèle. |
| `famille` | text | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.
- Consommateurs identifiés : `api.v_hierarchie_metier_listing`, `api.v_wasp_qualite_segment_consolide`

Index :
- `ref_parametre_qualite_pkey`

#### Objet `wasp_output.ref_run_modele`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `wasp_output` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 48 kB |
| PK | `run_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `run_id` | uuid | NO | Identifiant de liaison vers l'entité référencée. |
| `run_code` | text | NO | Code métier ou identifiant source. |
| `bassin_code` | text | NO | Code métier ou identifiant source. |
| `scenario_code` | text | NO | Code métier ou identifiant source. |
| `version_modele` | text | YES | Attribut métier ou technique du modèle. |
| `source_file` | text | YES | Attribut métier ou technique du modèle. |
| `date_run` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |
| `is_reference` | boolean | YES | Attribut métier ou technique du modèle. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `bassin_code` -> `swat_output.ref_bassin.bassin_code`
- FK `scenario_code` -> `swat_output.ref_scenario.scenario_code`
- Consommateurs identifiés : `api.v_wasp_qualite_segment_consolide`

Index :
- `ref_run_modele_pkey`
- `ref_run_modele_run_code_key`

#### Objet `wasp_output.ref_segment_modele`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `wasp_output` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `bassin_code`, `segment_local_id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `bassin_code` | text | NO | Code métier ou identifiant source. |
| `segment_local_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `reseau_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `libelle` | text | YES | Libellé métier affiché dans l'application. |
| `is_active` | boolean | YES | Indicateur d'état métier ou technique. |
| `created_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- FK `reseau_id` -> `geo.reseau_hydrographique.id`

Index :
- `ref_segment_modele_pkey`

#### Objet `wasp_output.stg_wasp_qualite_long`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `wasp_output` utilisée par le SAD. |
| Lignes estimées | 931770 |
| Taille | 70 MB |
| PK | - |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `sheet_name` | text | YES | Libellé métier affiché dans l'application. |
| `date_serial` | double precision | YES | Attribut métier ou technique du modèle. |
| `segment_local_id` | integer | YES | Identifiant de liaison vers l'entité référencée. |
| `valeur` | double precision | YES | Valeur mesurée, calculée ou agrégée. |
| `loaded_at` | timestamp with time zone | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- Aucun index listé pour cet objet.

### Schéma `wasp_sebou`

Scénarios et résultats WASP consolidés pour Sebou.

#### Objet `wasp_sebou.wasp_results`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Résultats WASP consolidés par segment, variable et date. |
| Lignes estimées | 931770 |
| Taille | 74 MB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | bigint | NO | Identifiant technique primaire. |
| `scenario_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `variable_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `segment_id` | integer | NO | Identifiant de liaison vers l'entité référencée. |
| `date` | date | NO | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `value` | double precision | NO | Valeur mesurée, calculée ou agrégée. |

Relations :
- FK `scenario_id` -> `wasp_sebou.wasp_scenarios.id`
- FK `variable_id` -> `wasp_sebou.wasp_variables.id`

Index :
- `wasp_results_pkey`

#### Objet `wasp_sebou.wasp_scenarios`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Référentiel des scénarios WASP disponibles. |
| Lignes estimées | -1 |
| Taille | 32 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `name` | text | NO | Libellé métier affiché dans l'application. |
| `description` | text | YES | Attribut métier ou technique du modèle. |
| `model_version` | character varying | YES | Attribut métier ou technique du modèle. |
| `start_date` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |
| `end_date` | date | YES | Repère temporel de la mesure, de l'agrégat ou du scénario. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `wasp_scenarios_pkey`

#### Objet `wasp_sebou.wasp_variables`

| Champ | Valeur |
|---|---|
| Type | table |
| Description | Table du schéma `wasp_sebou` utilisée par le SAD. |
| Lignes estimées | -1 |
| Taille | 48 kB |
| PK | `id` |

Colonnes :

| Colonne | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | NO | Identifiant technique primaire. |
| `name` | text | NO | Libellé métier affiché dans l'application. |
| `code` | character varying | NO | Code métier ou identifiant source. |
| `unit` | character varying | YES | Attribut métier ou technique du modèle. |

Relations :
- Aucune FK déclarée ou exploitable directement via le catalogue.

Index :
- `wasp_variables_code_key`
- `wasp_variables_pkey`
