# Vues d'exposition metier proposees

## Meteo

- `api.v_meteo_temperature`
- `api.v_meteo_precipitation`
- `api.v_meteo_evaporation`
- `api.v_meteo_dashboard`

## Hydrologie

- `api.v_hydro_debit`
- `api.v_barrage_parametres`
- `api.v_hydro_dashboard`

## Qualite eau

- `api.v_qualite_physicochimie`
- `api.v_qualite_chimie_minerale`
- `api.v_qualite_metaux`
- `api.v_qualite_nutriments`
- `api.v_qualite_pollution_organique`
- `api.v_qualite_microbiologie`
- `api.v_qualite_biologique`
- `api.v_qualite_organoleptique`
- `api.v_qualite_terrain`
- `api.v_qualite_dashboard_global`

## Pollution / IDP

- `api.v_pollution_sources`
- `api.v_pollution_constat_prealable`
- `api.v_pollution_analyses_finales`
- `api.v_idp_points`
- `api.v_idp_points_non_resolus`

## Modelisation

- `api.v_swat_runs`
- `api.v_swat_results`
- `api.v_wasp_runs`
- `api.v_wasp_results`

## Regles de conception

- Les vues dashboard globales agregent des vues metier specialisees, pas l'inverse.
- Les vues qualite doivent conserver `support_type`, `support_id`, `parametre_ref_id`, `code_parametre`, `unite_reference`, `qa_status`, `source_row_id`.
- Les vues IDP/pollution doivent separer constat prealable, analyses finales et points non resolus.
- Les vues modeling doivent rester marquees `LEGACY_MODELING_TO_REPLACE` jusqu'au nouveau module ingestion.
