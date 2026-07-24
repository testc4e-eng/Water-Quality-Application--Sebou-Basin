# 23  Plan migration Docker vers PostgreSQL local

## 1. Statut

Statut : `PLAN_PROVISOIRE_A_VALIDER`

Aucune migration n'a ete executee. Ce plan sert a valider la strategie avant toute action.

## 2. Synthese

L'audit montre que PostgreSQL local `abh_sad` contient les schemas et tables metier requis par le MVP, tandis que Docker `sad-db` est incomplet pour la topologie. La migration prioritaire n'est donc pas Docker -> local en masse, mais validation des rares objets Docker-only et bascule controlee du backend vers la base locale.

## 3. Actions objet par objet

| Objet Docker | Existe localement | Action | Methode | Risque | Validation |
|---|---:|---|---|---|---|
| `function public._st_concavehull(geometry)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.addauth(text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.checkauth(text, text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.checkauth(text, text, text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.checkauthtrigger()` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.daitch_mokotoff(text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.difference(text, text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.disablelongtransactions()` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.dmetaphone(text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.dmetaphone_alt(text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.enablelongtransactions()` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.gettransactionid()` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.levenshtein(text, text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.levenshtein(text, text, integer, integer, integer)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.levenshtein_less_equal(text, text, integer)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.levenshtein_less_equal(text, text, integer, integer, integer, i` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.lockrow(text, text, text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.lockrow(text, text, text, text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.lockrow(text, text, text, text, timestamp without time zone)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.lockrow(text, text, text, timestamp without time zone)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.longtransactionsenabled()` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.metaphone(text, integer)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.soundex(text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.st_asgeojson(record, text, integer, boolean)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.text_soundex(text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function public.unlockrows(text)` | non | MANUAL_REVIEW | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.count_words(character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.create_census_base_tables()` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.cull_null(character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.diff_zip(character varying, character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.drop_dupe_featnames_generate_script()` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.drop_indexes_generate_script(text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.drop_nation_tables_generate_script(text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.drop_state_tables_generate_script(text, text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.end_soundex(character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.geocode(character varying, integer, geometry)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.geocode(norm_addy, integer, geometry)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.geocode_address(norm_addy, integer, geometry)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.geocode_intersection(text, text, text, text, text, integer)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.geocode_location(norm_addy, geometry)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.get_geocode_setting(text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.get_last_words(character varying, integer)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.get_tract(geometry, text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.greatest_hn(character varying, character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.includes_address(integer, integer, integer, integer, integer)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.install_geocode_settings()` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.install_missing_indexes()` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.install_pagc_tables()` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.interpolate_from_address(integer, character varying, character ` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.is_pretype(text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.least_hn(character varying, character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.levenshtein_ignore_case(character varying, character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.loader_generate_census_script(text[], text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.loader_generate_nation_script(text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.loader_generate_script(text[], text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.loader_load_staged_data(text, text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.loader_load_staged_data(text, text, text[])` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.loader_macro_replace(text, text[], text[])` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.location_extract(character varying, character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.location_extract_countysub_exact(character varying, character v` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.location_extract_countysub_fuzzy(character varying, character v` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.location_extract_place_exact(character varying, character varyi` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.location_extract_place_fuzzy(character varying, character varyi` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.missing_indexes_generate_script()` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.normalize_address(character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.nullable_levenshtein(character varying, character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.numeric_streets_equal(character varying, character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.pagc_normalize_address(character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.pprint_addy(norm_addy)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.rate_attributes(character varying, character varying, character` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.reverse_geocode(geometry, boolean)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.set_geocode_setting(text, text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.setsearchpathforinstall(text)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.state_extract(character varying)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.topology_load_tiger(character varying, character varying, chara` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.utmzone(geometry)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function tiger.zip_range(text, integer, integer)` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function topology._asgmledge(integer, integer, integer, geometry, regclass, text,` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function topology._asgmlface(text, integer, regclass, text, integer, integer, tex` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |
| `function topology._asgmlnode(integer, geometry, text, integer, integer, text, int` | non | DO_NOT_MIGRATE_OR_RECREATE_EXTENSION_IF_NEEDED | revue DDL + origine | faible a moyen | extension/tests applicatifs |

## 4. Ordre de consolidation recommande

1. Backup complet local et Docker.
2. Verification que la base locale expose les extensions necessaires (`postgis`, `pgrouting` si requis, `timescaledb` si requis).
3. Creation d'un utilisateur applicatif local dedie, sans exposer le superuser au backend.
4. Test de connexion depuis `sad-backend` vers `host.docker.internal:5432`.
5. Bascule `.env` backend vers la base locale.
6. Recreate backend uniquement.
7. Smoke tests `/api/v1/propagation/source-to-garde`, declaration `create -> submit -> evaluate -> report`.
8. Conservation de `sad-db` Docker comme fallback jusqu'a validation utilisateur.

## 5. Interdits avant validation

- Pas de `docker compose down -v`.
- Pas de DROP/TRUNCATE/DELETE.
- Pas d'import aveugle des objets Docker.
- Pas de suppression de `sad-db` avant backup restaurable et recette complete.

## 6. Decision attendue

Validation utilisateur requise avant toute bascule runtime vers PostgreSQL local ou toute migration d'objet.
