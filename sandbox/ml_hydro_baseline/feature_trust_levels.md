# Feature Trust Levels

## Objectif

Classifier les features du pilote hydro selon leur fiabilité initiale.

## Niveaux

| Niveau | Définition | Usage ML |
|---|---|---|
| VERY_HIGH | observation directe, unité claire, timestamp exploitable | autorisé sandbox |
| HIGH | observation directe ou rolling simple | autorisé sandbox |
| MEDIUM | heuristique ou agrégation sensible | autorisé avec flag |
| LOW | relation inférée non validée | diagnostic seulement |
| VERY_LOW | propagation estimée ou graph non validé | interdit pour conclusion |

## Mapping initial

| Feature | Trust | Justification |
|---|---|---|
| `q_lag_1` | VERY_HIGH | débit observé passé |
| `q_lag_7` | VERY_HIGH | débit observé passé |
| `rainfall_1d` | HIGH | pluie observée agrégée |
| `rainfall_7d` | HIGH | rolling pluie observée |
| `rainfall_30d` | HIGH | rolling pluie observée |
| `evap_7d` | HIGH | rolling évaporation observée |
| `evap_30d` | HIGH | rolling évaporation observée |
| `month` | VERY_HIGH | dérivé calendrier déterministe |
| `wet_season_flag` | MEDIUM | heuristique saisonnière |
| `upstream_flow_lag` | LOW | dépend topologie inférée |
| `propagation_time_estimate` | VERY_LOW | non validé scientifiquement |

## Règle de rétrogradation

Une feature peut être rétrogradée si:

- importance instable entre splits ;
- suspicion leakage ;
- fraîcheur insuffisante ;
- unité incertaine ;
- dépendance topologique non validée ;
- comportement impossible physiquement.

