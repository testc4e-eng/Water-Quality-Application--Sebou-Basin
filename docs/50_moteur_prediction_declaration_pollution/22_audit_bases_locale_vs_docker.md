# 22  Audit bases locale vs Docker

Date audit : 2026-07-13T19:10:49

## 1. Statut

Statut : `AUDIT_DB_COMPLETE`

Audit realise en lecture seule. Aucune migration, suppression, import ou modification de base n'a ete execute.

## 2. Bases detectees

| Environnement | Hote | Port | Base | Taille | Version |
|---|---:|---:|---|---:|---|
| Local Windows | localhost | 5432 | abh_sad | 5593 MB | PostgreSQL 17 |
| Docker sad-db | localhost | 5434 | abh_sad | 19 MB | PostgreSQL 16 / PostGIS |

## 3. Schemas

### Local

_timescaledb_cache, _timescaledb_catalog, _timescaledb_config, _timescaledb_debug, _timescaledb_functions, _timescaledb_internal, admin, analytics, api, audit, data_admin, geo, geo_work, hydro, infra, metadata, meteo, modeles, monitoring, public, qa, qa_dry_run, qualite, security, staging, swat, swat_output, swat_sebou, timescaledb_experimental, timescaledb_information, wasp_output, wasp_sebou

### Docker

data_admin, public, tiger, tiger_data, topology

Conclusion : la base locale contient les schemas metier SAD/WQDSS. La base Docker ne contient pas les schemas applicatifs critiques (`geo`, `geo_work`, `qualite`, `api`, `hydro`, `wasp_output`).

## 4. Comparaison objets

Fichier detaille : `db_comparison_objects.csv`

| Statut | Nombre |
|---|---:|
| LOCAL_ONLY | 8880 |
| DOCKER_ONLY | 235 |
| DIFFERENT_DEFINITION | 18 |
| IDENTICAL | 721 |

### Exemples objets uniquement locaux

- `function _timescaledb_debug.extension_state()`
- `function _timescaledb_functions.accept_hypertable_invalidations(regclass, text)`
- `function _timescaledb_functions.add_materialization_invalidations(regclass, tsrange)`
- `function _timescaledb_functions.add_materialization_invalidations(regclass, tstzrange)`
- `function _timescaledb_functions.align_to_bucket(interval, anyrange)`
- `function _timescaledb_functions.alter_job_set_hypertable_id(integer, regclass)`
- `function _timescaledb_functions.attach_osm_table_chunk(regclass, regclass)`
- `function _timescaledb_functions.bloom1_contains(_timescaledb_internal.bloom1, anyelement)`
- `function _timescaledb_functions.bloom1in(cstring)`
- `function _timescaledb_functions.bloom1out(_timescaledb_internal.bloom1)`
- `function _timescaledb_functions.bookend_deserializefunc(bytea, internal)`
- `function _timescaledb_functions.bookend_finalfunc(internal, anyelement, "any")`
- `function _timescaledb_functions.bookend_serializefunc(internal)`
- `function _timescaledb_functions.cagg_get_bucket_function_info(integer)`
- `function _timescaledb_functions.cagg_migrate_create_plan(_timescaledb_catalog.continuous_agg, t`
- `function _timescaledb_functions.cagg_migrate_execute_copy_data(_timescaledb_catalog.continuous_`
- `function _timescaledb_functions.cagg_migrate_execute_copy_policies(_timescaledb_catalog.continu`
- `function _timescaledb_functions.cagg_migrate_execute_create_new_cagg(_timescaledb_catalog.conti`
- `function _timescaledb_functions.cagg_migrate_execute_disable_policies(_timescaledb_catalog.cont`
- `function _timescaledb_functions.cagg_migrate_execute_drop_old_cagg(_timescaledb_catalog.continu`
- `function _timescaledb_functions.cagg_migrate_execute_enable_policies(_timescaledb_catalog.conti`
- `function _timescaledb_functions.cagg_migrate_execute_override_cagg(_timescaledb_catalog.continu`
- `function _timescaledb_functions.cagg_migrate_execute_plan(_timescaledb_catalog.continuous_agg)`
- `function _timescaledb_functions.cagg_migrate_execute_refresh_new_cagg(_timescaledb_catalog.cont`
- `function _timescaledb_functions.cagg_migrate_plan_exists(integer)`
- `function _timescaledb_functions.cagg_migrate_pre_validation(text, text, text)`
- `function _timescaledb_functions.cagg_migrate_to_time_bucket(regclass)`
- `function _timescaledb_functions.cagg_migrate_update_watermark(integer)`
- `function _timescaledb_functions.cagg_parse_invalidation_record(bytea)`
- `function _timescaledb_functions.cagg_validate_query(text)`
- `function _timescaledb_functions.cagg_watermark(integer)`
- `function _timescaledb_functions.cagg_watermark_materialized(integer)`
- `function _timescaledb_functions.calculate_chunk_interval(integer, bigint, bigint)`
- `function _timescaledb_functions.chunk_constraint_add_table_constraint(_timescaledb_catalog.chun`
- `function _timescaledb_functions.chunk_id_from_relid(oid)`
- `function _timescaledb_functions.chunk_status(regclass)`
- `function _timescaledb_functions.chunks_local_size(name, name)`
- `function _timescaledb_functions.compressed_chunk_local_stats(name, name)`
- `function _timescaledb_functions.compressed_data_has_nulls(_timescaledb_internal.compressed_data`
- `function _timescaledb_functions.compressed_data_in(cstring)`

### Exemples objets uniquement Docker

- `function public._st_concavehull(geometry)`
- `function public.addauth(text)`
- `function public.checkauth(text, text)`
- `function public.checkauth(text, text, text)`
- `function public.checkauthtrigger()`
- `function public.daitch_mokotoff(text)`
- `function public.difference(text, text)`
- `function public.disablelongtransactions()`
- `function public.dmetaphone(text)`
- `function public.dmetaphone_alt(text)`
- `function public.enablelongtransactions()`
- `function public.gettransactionid()`
- `function public.levenshtein(text, text)`
- `function public.levenshtein(text, text, integer, integer, integer)`
- `function public.levenshtein_less_equal(text, text, integer)`
- `function public.levenshtein_less_equal(text, text, integer, integer, integer, i`
- `function public.lockrow(text, text, text)`
- `function public.lockrow(text, text, text, text)`
- `function public.lockrow(text, text, text, text, timestamp without time zone)`
- `function public.lockrow(text, text, text, timestamp without time zone)`
- `function public.longtransactionsenabled()`
- `function public.metaphone(text, integer)`
- `function public.soundex(text)`
- `function public.st_asgeojson(record, text, integer, boolean)`
- `function public.text_soundex(text)`
- `function public.unlockrows(text)`
- `function tiger.count_words(character varying)`
- `function tiger.create_census_base_tables()`
- `function tiger.cull_null(character varying)`
- `function tiger.diff_zip(character varying, character varying)`
- `function tiger.drop_dupe_featnames_generate_script()`
- `function tiger.drop_indexes_generate_script(text)`
- `function tiger.drop_nation_tables_generate_script(text)`
- `function tiger.drop_state_tables_generate_script(text, text)`
- `function tiger.end_soundex(character varying)`
- `function tiger.geocode(character varying, integer, geometry)`
- `function tiger.geocode(norm_addy, integer, geometry)`
- `function tiger.geocode_address(norm_addy, integer, geometry)`
- `function tiger.geocode_intersection(text, text, text, text, text, integer)`
- `function tiger.geocode_location(norm_addy, geometry)`

### Exemples definitions divergentes

- `function public._postgis_deprecate(text, text, text)`
- `function public._postgis_scripts_pgsql_version()`
- `function public.addgeometrycolumn(character varying, character varying, charact`
- `function public.dropgeometrycolumn(character varying, character varying, charac`
- `function public.geog_brin_inclusion_add_value(internal, internal, internal, int`
- `function public.json(geometry)`
- `function public.postgis_extensions_upgrade(text)`
- `function public.postgis_full_version()`
- `function public.postgis_scripts_build_date()`
- `function public.postgis_scripts_installed()`
- `function public.st_affine(geometry, double precision, double precision, double `
- `function public.st_angle(geometry, geometry)`
- `function public.st_concavehull(geometry, double precision, boolean)`
- `function public.st_makepoint(double precision, double precision, double precisi`
- `function public.st_symmetricdifference(geometry, geometry)`
- `function public.st_transform(geometry, text)`
- `function public.st_transform(geometry, text, integer)`
- `table data_admin.field_registry`

## 5. Comparaison donnees

Fichier detaille : `db_comparison_data.csv`. Les comptages sont des estimations catalogue (`reltuples`) pour eviter de charger lourdement la base avant validation DBA.

## 6. Topologie

| Objet | Local | Docker | Lignes locales | Lignes Docker | Geometrie locale |
|---|---:|---:|---:|---:|---|
| `geo_work.reseau_hydro_edges_final_candidate_20260602` | True | False | 746 |  | geom SRID=26191 type=LINESTRING; start_geom SRID=26191 type=POINT |
| `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr` | True | False | 752 |  | the_geom SRID=26191 type=POINT |
| `geo_work.reseau_hydro_nodes_final_candidate_20260602` | True | False | 752 |  | geom SRID=26191 type=POINT |
| `geo.reseau_hydrographique` | True | False | 697 |  | geom SRID=26191 type=MULTILINESTRING |

Conclusion topologie : l'objet critique `geo_work.reseau_hydro_edges_final_candidate_20260602` est present localement et absent de Docker. Le blocage Docker `TOPOLOGY_ENGINE_UNAVAILABLE` est coherent avec l'audit.

## 7. Connectivite backend vers PostgreSQL local

Test TCP depuis le conteneur `sad-backend` vers `host.docker.internal:5432` : OK.

Test SQL read-only depuis `sad-backend` vers la base locale `abh_sad` : OK.

Objet verifie :

```text
geo_work.reseau_hydro_edges_final_candidate_20260602
```

Resultat :

```text
table presente
count = 746
```

Conclusion : la bascule runtime du backend Docker vers PostgreSQL local est techniquement possible, sous reserve de validation utilisateur, backup et configuration securisee des identifiants.

## 8. Risques

- La base Docker n'est pas une source complete pour le MVP topologique.
- La bascule backend vers PostgreSQL local doit etre faite uniquement apres backup et test de connexion depuis Docker vers `host.docker.internal`.
- Les objets Docker-only semblent principalement lies aux extensions PostGIS de base (`tiger`, `topology`) et doivent etre revus avant migration.
- Les tailles et comptages exhaustifs de la base locale doivent etre completes si une migration destructive est envisagee, ce qui n'est pas le cas ici.

## 9. Decision recommandee

Ne pas migrer automatiquement. Pour la demonstration, reconnecter le backend a la base locale complete apres backup de configuration et test SQL depuis le conteneur. Conserver `sad-db` Docker intact tant que la recette n'est pas validee.
