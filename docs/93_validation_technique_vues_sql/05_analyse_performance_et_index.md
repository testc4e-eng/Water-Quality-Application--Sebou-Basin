# Analyse performance et index

## Index existants observes

| Vue | Tables lourdes | Index presents | Risque FULL SCAN | Recommendation |
|---|---|---|---|---|
| `api.v_meteo_temperature` | `meteo.mesure_temperature` vide | PK `(temps, station_id)`, `(station_id, temps desc)`, `(temps desc)` | faible aujourd'hui | OK V1 |
| `api.v_meteo_precipitation` | `meteo.mesure_precipitation` 546007 | PK `(temps, station_id)`, `(station_id, temps desc)`, `(temps desc)` | moyen si dashboard sans date | imposer filtres temps/station, materialisation possible |
| `api.v_meteo_evaporation` | `meteo.mesure_evaporation` 48900 | PK `(temps, station_id)`, `(station_id, temps desc)`, `(temps desc)` | faible/moyen | OK V1 |
| `api.v_barrage_parametres` | `hydro.mesure_barrage_param` 272652 | `(barrage_id, temps desc)`, `(parametre_code, temps desc)`, hashs | faible si filtre parametre/barrage | OK V1 |
| `api.v_barrage_qualite` | qualite barrage + garde | `(parametre_qualite, temps desc)`, `(station_id, temps desc)` | faible | filtrer `DISQUE_SECCHI` dans chaque branche |
| vues qualite multi-supports | riviere 59534, nappe 63047, Sebou 49954, barrage 7820, garde 1780 | `(parametre_qualite, temps desc)`, `(station_id, temps desc)`, `(temps desc)` | moyen si famille large et sans date | filtres par famille dans branches ; materialiser si usages lourds |
| `api.v_pollution_constat_prealable` | 141 | PK, `date_reception`, GIST `geom` | faible | OK V1 |
| `api.v_pollution_analyses_finales` | 7191 | `prelevement_id`, `parametre_ref_id`, `param_code_legacy` | faible | OK V1 |
| `api.v_idp_points` | 141 | GIST `geom` | faible | OK V1 |
| `api.v_idp_points_non_resolus` | 141 / future table | GIST `geom` si source prelevement | faible | future table dediee si volumetrie augmente |

## Index manquants / a considerer

| Besoin | Recommendation |
|---|---|
| jointure qualite par `parametre_ref_id` | ajouter index sur `parametre_ref_id` dans tables qualite si les vues basculent vers FK |
| filtre frequent par famille | conserver filtres `parametre_qualite IN (...)` ; eventuellement partial indexes par famille si besoin |
| vues qualite dashboard global | materialized views par famille avec `date_mesure`, `support_type`, `code_parametre` |
| GEO qualite historique | ne pas joindre GEO dans V1 ; prevoir vues enrichies separees |
| pollution analyse par date | index compose possible sur `source_pollution_mesure_param(prelevement_id, parametre_ref_id)` deja couvert partiellement |

## Decision performance

Les vues specialisees sont faisables en V1. Les risques apparaissent surtout si le frontend consomme sans filtres temporels ou si une vue globale recompose toutes les familles qualite en temps reel.
