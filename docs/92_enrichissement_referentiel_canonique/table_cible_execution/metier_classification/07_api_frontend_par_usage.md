# API frontend par usage

| Ecran | API | Vue source | Usage | Filtres | Carte/Graph/Table |
|---|---|---|---|---|---|
| Observatoire meteo | `/api/meteo/temperature` | `api.v_meteo_temperature` | temperature station | station, periode, type temperature | graph + table |
| Observatoire meteo | `/api/meteo/precipitation` | `api.v_meteo_precipitation` | pluie | station, periode | graph + carte |
| Observatoire meteo | `/api/meteo/evaporation` | `api.v_meteo_evaporation` | evaporation | station, periode, qa_status | graph + table |
| Hydrologie / barrages | `/api/hydro/debits` | `api.v_hydro_debit` | debit | station, periode | graph |
| Hydrologie / barrages | `/api/hydro/barrages/parametres` | `api.v_barrage_parametres` | niveau, volume, flux barrage | barrage, parametre, scenario, periode | graph + table |
| Qualite eau globale | `/api/qualite/dashboard` | `api.v_qualite_dashboard_global` | synthese multi-sous-domaines | sous-domaine, support, periode | graph + table |
| Qualite par station | `/api/qualite/physicochimie` | `api.v_qualite_physicochimie` | pH, Eh | station, parametre, periode | graph |
| Qualite par nappe | `/api/qualite/chimie-minerale` | `api.v_qualite_chimie_minerale` | ions majeurs | nappe, station, parametre, periode | graph + table |
| Microbiologie | `/api/qualite/microbiologie` | `api.v_qualite_microbiologie` | CF, CT, SF | support, station, periode | graph + alert table |
| Metaux | `/api/qualite/metaux` | `api.v_qualite_metaux` | contamination metal | support, parametre, periode | graph + table |
| Pollution / IDP | `/api/pollution/sources` | `api.v_pollution_sources` | sources pollution | bassin, type, statut | carte + table |
| Pollution / IDP | `/api/pollution/constats` | `api.v_pollution_constat_prealable` | constats terrain | type, date, statut | carte + table |
| Pollution / IDP | `/api/pollution/analyses-finales` | `api.v_pollution_analyses_finales` | analyses labo pollution | point, parametre, qa_status | graph + table |
| Carte points non resolus | `/api/idp/points-non-resolus` | `api.v_idp_points_non_resolus` | validation geo progressive | geo_status, bbox | carte |
| Modelisation SWAT/WASP | `/api/modeling/swat/results`, `/api/modeling/wasp/results` | vues modeling | consultation legacy | run, scenario, variable | carte + graph |
| Admin ingestion / quarantaine | `/api/ingestion/batches`, `/api/ingestion/quarantine` | schema ingestion futur | supervision | statut, source, erreur | table |
