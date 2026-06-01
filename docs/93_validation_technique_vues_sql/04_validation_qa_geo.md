# Validation QA / GEO

## Comportements attendus

| Cas | Comportement vue |
|---|---|
| `COULEUR` | exposer uniquement dans `api.v_qualite_organoleptique`, `CONSULTATION_ONLY`, hors analytics |
| `FM` | exclure de toutes les vues publiques |
| `F_M_MES` | exclure de toutes les vues publiques |
| QA extremes | conserver la ligne avec `qa_status` explicite, ne pas supprimer |
| GEO non resolu | garder la ligne avec `geo_status = GEO_UNRESOLVED` |
| Evaporation null | garder `NULL` avec `qa_status = QA_NULL_VALUE` ou source gap accepte |
| Temperature absente | `api.v_meteo_temperature` vide acceptable |
| Pollution non numerique | conserver `valeur_raw`, `valeur_num` null, `qa_status = QA_NON_NUMERIC` |
| Points IDP sans geom | exposer dans `api.v_idp_points_non_resolus` |

## QA par familles

| Famille | Regles |
|---|---|
| meteo | ne pas supprimer nulls evaporation, flagger valeurs negatives/outliers |
| barrage parametrique | respecter unite parametre ; aucun `m3/s` pour volumes journaliers |
| qualite analytique | ne pas exclure outliers ; exposer flags |
| microbiologie | ne pas comparer avec mg/L ; filtrer par unite UFC |
| organoleptique | consultation only |
| hydromorphologie | consultation only, pas d'analytics qualite |
| pollution IDP | conserver brut et numerique |

## GEO

| Source | GEO actuel | Recommandation |
|---|---|---|
| qualite historique | support_id present, geom absent | `GEO_LINKED_BY_ID`; enrichissement GEO hors vue V1 |
| meteo | station_id present | `GEO_LINKED_BY_ID` |
| barrage parametrique | barrage_id present | `GEO_LINKED_BY_ID` |
| pollution prelevement | geom present si coordonnees valides | `GEO_GEOMETRY_PRESENT` ou `GEO_UNRESOLVED` |
| points non resolus | future couche dediee | `GEO_UNRESOLVED` / `GEO_CLIENT_VALIDATION` |

## Decision

Les vues doivent preserver les donnees et les flags. Aucune vue ne doit corriger, interpoler ou supprimer une anomalie ; elle doit seulement l'exposer avec un statut clair.
