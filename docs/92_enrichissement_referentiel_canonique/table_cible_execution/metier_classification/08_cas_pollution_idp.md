# Cas pollution / IDP

## Logique metier

1. L'inventaire pollution arrive par fichiers Excel.
2. Les fichiers portent X/Y, references anciennes, points de constatation et points de prelevement.
3. Une partie peut etre rattachee automatiquement a des stations, nappes, barrages ou anciens points.
4. Une partie reste non resolue.
5. Les points non resolus doivent alimenter une couche temporaire dediee.
6. Les analyses finales doivent rester separees des constats prealables.
7. La publication doit exposer `geo_status` et `qa_status`.

| Type donnee IDP | Source | Geometrie | Mesures | Vue | API | Front |
|---|---|---|---|---|---|---|
| Source pollution | Excel inventaire | parfois | non | `api.v_pollution_sources` | `/api/pollution/sources` | carte + table |
| Constat prealable | Excel terrain | parfois | observation | `api.v_pollution_constat_prealable` | `/api/pollution/constats` | carte + table |
| Point prelevement | `qualite.source_pollution_prelevement` | oui si X/Y valides | non | `api.v_idp_points` | `/api/idp/points` | carte |
| Analyse finale | `qualite.source_pollution_mesure_param` | via point | oui | `api.v_pollution_analyses_finales` | `/api/pollution/analyses-finales` | graph + table |
| Point non resolu | couche proposee `geo.points_non_resolus_idp` | oui si X/Y | non | `api.v_idp_points_non_resolus` | `/api/idp/points-non-resolus` | carte revue |

## Decision de conception

- Ne pas fusionner constat prealable et analyse finale.
- Ne pas bloquer l'ingestion sur les points non resolus.
- Publier avec statut GEO progressif.
- Isoler les points non resolus dans une couche dédiée pour validation client.
