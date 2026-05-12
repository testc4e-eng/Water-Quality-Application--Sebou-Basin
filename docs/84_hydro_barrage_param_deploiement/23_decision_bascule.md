# Phase 5 - Decision bascule

## Decision

`API_DASHBOARD_PARAM_OK`

## Justification

La bascule API/dashboard barrage consomme maintenant `hydro.mesure_barrage_param` et non les colonnes legacy de `hydro.mesure_barrage`.

Les vues d'exposition suivantes sont disponibles :

| Vue | Role | Volume |
|---|---|---:|
| `api.v_hydro_barrage_param_journalier` | exposition parametrique API | 272652 |
| `api.v_hydro_barrage_param_compat_wide` | compatibilite large temporaire | 84831 |

La MV `analytics.mv_dashboard_hydrologie_menu` expose les cinq variables barrage avec les unites validees.

## Backlog residuel

| Classe | Anomalie | Statut |
|---|---|---|
| INFO | Avertissement Vite sur taille de chunk | non bloquant |
| INFO | Alias `cote_m` et `volume_mm3` encore acceptes en entree API pour compatibilite | non utilise comme source metier |
| LEGACY_IGNORE | `hydro.mesure_barrage` conserve en lecture seule | conforme decision |

## Stop

La Phase 6 n'a pas ete lancee.
