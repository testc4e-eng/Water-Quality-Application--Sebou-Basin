# Classification des tables sources

| Table | Domaine | Type mesure | Support | Description | Vue metier cible | API cible |
|---|---|---|---|---|---|---|
| `meteo.mesure_temperature` | METEO | `STATION_AUTOMATIQUE` | station meteo | temperature a implementer dans pipeline actuel | `api.v_meteo_temperature` | `/api/meteo/temperature` |
| `meteo.mesure_precipitation` | METEO | `STATION_AUTOMATIQUE` | station meteo | precipitation | `api.v_meteo_precipitation` | `/api/meteo/precipitation` |
| `meteo.mesure_evaporation` | METEO | `STATION_AUTOMATIQUE` | station meteo | evaporation avec nulls source acceptes | `api.v_meteo_evaporation` | `/api/meteo/evaporation` |
| `hydro.mesure_debit` | HYDROLOGIE | `STATION_AUTOMATIQUE` | station hydrometrique | debit | `api.v_hydro_debit` | `/api/hydro/debits` |
| `hydro.mesure_barrage_param` | HYDROLOGIE | `STATION_AUTOMATIQUE` | barrage | niveau, volume, flux barrage | `api.v_barrage_parametres` | `/api/hydro/barrages/parametres` |
| `qualite.mesure_qualite_riviere` | QUALITE_EAU | `HISTORIQUE_RIVIERE` | station riviere | mesures qualite historiques | vues qualite par sous-domaine | APIs qualite specialisees |
| `qualite.mesure_qualite_nappe` | QUALITE_EAU | `HISTORIQUE_NAPPE` | station + nappe | mesures qualite nappes | vues qualite par sous-domaine | APIs qualite specialisees |
| `qualite.mesure_qualite_barrage` | QUALITE_EAU | `HISTORIQUE_BARRAGE` | barrage | table mentionnee, usage a verifier | `api.v_qualite_terrain` ou backlog | a confirmer |
| `qualite.mesure_qualite_sebou` | QUALITE_EAU | `SUIVI_SEBOU` | station | suivi specifique Sebou | vues qualite par sous-domaine | APIs qualite specialisees |
| `qualite.suivi_qualite_barrage_garde_hebdo` | QUALITE_EAU | `GARDE_HEBDO_BARRAGE` | barrage | suivi hebdomadaire | vues qualite par sous-domaine | APIs qualite specialisees |
| `qualite.source_pollution_prelevement` | POLLUTION_IDP | `IDP_GEO_POINT` | point X/Y | support spatial pollution | `api.v_idp_points` | `/api/idp/points` |
| `qualite.source_pollution_mesure_param` | POLLUTION_IDP | `INVENTAIRE_POLLUTION_ANALYSE_FINALE` | point pollution | mesures analytiques pollution | `api.v_pollution_analyses_finales` | `/api/pollution/analyses-finales` |
| `geo.points_non_resolus_idp` proposee | POLLUTION_IDP | `IDP_GEO_POINT` | point | points a valider | `api.v_idp_points_non_resolus` | `/api/idp/points-non-resolus` |
| `swat_output.*` | MODELISATION | `MODEL_OUTPUT` | subbasin | resultats legacy SWAT | `api.v_swat_runs`, `api.v_swat_results` | `/api/modeling/swat/*` |
| `wasp_output.*` | MODELISATION | `MODEL_OUTPUT` | segment | resultats legacy WASP | `api.v_wasp_runs`, `api.v_wasp_results` | `/api/modeling/wasp/*` |
