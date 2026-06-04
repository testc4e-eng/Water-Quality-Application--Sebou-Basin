# Matrice des tests API Docker

## Regle de lecture

Classes utilisees :

1. `OK sans donnees metier`
2. `OK avec base minimale`
3. `Echec car vue/table absente`
4. `Echec attendu car parametre requis ou route non applicable`

## Resultats observes

| Endpoint | Categorie | Statut observe | Observation |
|---|---|---|---|
| `GET /health` | 1 | 200 | service et ping DB OK |
| `GET /docs` | 1 | 200 | docs FastAPI OK |
| `GET /openapi.json` | 1 | 200 | contrat OpenAPI disponible |
| `GET /api/v1/map/catalog` | 1 | 200 | route statique sans SQL metier |
| `GET /api/v1/routing/topology-qa` | 1 | 200 | route OK dans le socle actuel |
| `GET /api/v1/observatory/popup-rules` | 1 | 200 | fallback par defaut si `metadata.popup_rules_config` absente |
| `GET /api/v1/alerts` | 1 | non teste | route placeholder attendue sans dependance metier forte |
| `GET /api/v1/stations` | 2 | 200 | route actuellement exploitable, mais une base minimale explicite reste recommandee |
| `GET /api/v1/barrages` | 2 | 500 | deviendrait OK avec `infra.barrages` minimale |
| `GET /api/v1/quality/stations` | 2 | 500 | deviendrait OK avec `qualite.mesure_qualite_riviere` + `api.v_station_dimension` |
| `GET /api/v1/pollution/sites.geojson` | 2 | 500 | deviendrait OK avec `api.v_pollution_sites` + `api.v_pollution_latest_results` vides ou demo |
| `GET /api/v1/observatory/hierarchy/themes` | 2 | 500 | deviendrait OK avec `api.v_hierarchie_metier_listing` vide ou demo |
| `GET /api/v1/analytics/hydrologie/sites?submenu=debit` | 2 | 500 | deviendrait OK avec `analytics.mv_dashboard_hydrologie_menu` vide ou demo |
| `GET /api/v1/geojson/barrages` | 2 | 404 | deviendrait OK avec `api.v_barrage_dimension` ou fallback resolvable |
| `GET /api/v1/geojson/stations_abh` | 2 | non teste | depend de `api.v_station_dimension` |
| `GET /api/v1/quality/latest` | 2 | non teste | depend de `qualite.mesure_qualite_riviere` |
| `GET /api/v1/qualite/metaux` | 2 | non teste | depend de `api.v_qualite_metaux` |
| `GET /api/v1/observatory/catalog/themes` | 2 | non teste | depend de `metadata.obs_referentiel_parametre` ou MV equivalent |
| `GET /api/v1/analytics/climat-meteo/options` | 2 | non teste | depend de `analytics.mv_dashboard_climat_meteo_menu` |
| `GET /api/v1/analytics/pollution/options` | 2 | non teste | depend de `analytics.mv_dashboard_pollution_menu` |
| `GET /api/v1/pollution/latest-results` | 3 | non teste | vue `api.v_pollution_latest_results` absente |
| `GET /api/v1/observatory/hierarchy/submenus` | 3 | non teste | vue `api.v_hierarchie_metier_listing` absente |
| `GET /api/v1/observatory/hierarchy/parameters` | 3 | non teste | vue `api.v_hierarchie_metier_listing` absente |
| `GET /api/v1/quality/parameters` | 3 | non teste | table `qualite.mesure_qualite_riviere` absente |
| `GET /api/v1/quality/timeseries` | 3 | non teste | table `qualite.mesure_qualite_riviere` absente |
| `GET /api/v1/quality/inventory/rows` | 3 | non teste | vues `api.v_points_eau`, `api.v_step_industrielles`, `api.v_stm` absentes |
| `GET /api/v1/observatory/barrage/stations` | 3 | non teste | vue `api.v_barrage_dimension` absente |
| `GET /api/v1/observatory/temperature/stations` | 3 | non teste | vues `api.v_meteo_temperature_journalier` et `api.v_station_dimension` absentes |
| `GET /api/v1/analytics/hydrologie/options` | 3 | non teste | vue `analytics.mv_dashboard_hydrologie_menu` absente |
| `GET /api/v1/analytics/pollution/sites` | 3 | non teste | vue `analytics.mv_dashboard_pollution_menu` absente |
| `GET /api/v1/analytics/hydrologie/sites` sans `submenu` | 4 | non teste | 422 attendu car parametre requis |
| `GET /api/v1/analytics/hydrologie/series` sans `site` | 4 | non teste | 422 attendu |
| `GET /api/v1/observatory/parameter/latest` sans combinaison metier validee | 4 | non teste | route applicable seulement si la hierarchie et le parametre existent |

## Lecture architecturale

### 1. Endpoints deja stables

- routes systeme
- routes statiques de documentation
- quelques routes de catalogue local

### 2. Endpoints stabilisables par base minimale technique

Ce sont les meilleures cibles pour le Niveau A d'initialisation :

- `pollution/*`
- `observatory/hierarchy/*`
- `analytics/*/options|sites`
- `geojson/*`

Ces routes peuvent retourner proprement des listes vides ou des `FeatureCollection` vides si les vues de compatibilite existent.

### 3. Endpoints qui exigent de vraies tables metier minimales

- `barrages`
- `quality/stations`
- `quality/parameters`
- `quality/timeseries`

Ici, des vues vides seules ne suffisent pas. Le code appelle directement des tables metier.

## Recommandation

Pour Docker, il faut considerer la matrice en deux temps :

1. Stabiliser les contrats SQL avec des schemas + vues de compatibilite vides
2. Ajouter un seed demo tres reduit pour les routes de demonstration importantes
