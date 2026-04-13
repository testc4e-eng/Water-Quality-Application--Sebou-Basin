# DATABASE_SCHEMA_SUMMARY

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | synthèse optimisée pour agents IA : schémas clés, points d'entrée SQL et jointures principales |
| Source de vérité | Non |
| Documents liés | [DATABASE_SCHEMA](../01_project_reference/data/DATABASE_SCHEMA.md), [API_DATA_MAPPING](../01_project_reference/data/API_DATA_MAPPING.md), [DATA_MODELS](../01_project_reference/data/DATA_MODELS.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Schémas à connaître en priorité

- `api`, `analytics` : couche d'exposition et performance.
- `hydro`, `meteo`, `qualite` : séries métier.
- `swat_sebou`, `wasp_sebou`, `swat_output`, `wasp_output` : modèles et résultats.
- `metadata` : dictionnaires, mappings, observatoire, popups.
- `security`, `audit` : comptes, rôles et traçabilité.

## 2. Points d'entrée SQL

- `api.mv_station_dimension`, `api.mv_barrage_dimension` pour les dimensions métier.
- `api.viz_carto_layers` pour la cartographie.
- `analytics.mv_dashboard_climat_meteo_menu`, `analytics.mv_dashboard_hydrologie_menu`, `analytics.mv_dashboard_pollution_menu` pour les dashboards.
- `metadata.referentiel_parametre`, `metadata.api_view_catalog`, `metadata.api_view_column_catalog` pour la gouvernance.
- `swat_sebou.swat_scenarios`, `swat_sebou.swat_subbasin_results`, `wasp_sebou.wasp_scenarios`, `wasp_sebou.wasp_results` pour les scénarios.

## 3. Jointures utiles

- `hydro.mesure_debit.station_id -> infra.stations_mesure.id`
- `meteo.mesure_precipitation.station_id -> infra.stations_mesure.id`
- `qualite.mesure_qualite_riviere.parametre_ref_id -> metadata.referentiel_parametre.id`
- `swat_sebou.swat_subbasin_results.scenario_id -> swat_sebou.swat_scenarios.id`
- `wasp_sebou.wasp_results.variable_id -> wasp_sebou.wasp_variables.id`

## 4. Comptages réels repères

| Objet | Comptage |
|---|---|
| `hydro.mesure_debit` | 521433 |
| `infra.barrages` | 34 |
| `infra.stations_mesure` | 390 |
| `metadata.referentiel_parametre` | 91 |
| `meteo.mesure_precipitation` | 546007 |
| `qualite.mesure_qualite_nappe` | 63088 |
| `qualite.mesure_qualite_riviere` | 60097 |
| `qualite.mesure_qualite_sebou` | 51402 |
| `security.activity_logs` | 71717 |
| `wasp_sebou.wasp_results` | 931770 |

## 5. Usage agent

- Commencer par `DATABASE_SCHEMA.md` pour le détail complet.
- Utiliser `API_DATA_MAPPING.md` pour relier une route, un écran ou un dashboard à ses tables et vues.
- Utiliser `DATA_MODELS.md` pour raisonner en entités métier plutôt qu'en seuls noms techniques.
