# Controle post-load Phase 4

## Context

Controles executes apres chargement reel de `hydro.mesure_barrage_param`.

## Analysis

### Synthese QA

| Controle | Resultat |
|---|---:|
| volume final | 272652 |
| doublons `(barrage_id, temps, parametre_code, scenario)` | 0 |
| `barrage_id` null | 0 |
| `temps` null | 0 |
| `valeur` null | 0 |
| `parametre_ref_id` null | 0 |
| unite incoherente | 0 |
| `m3/s` sur `LACHER`, `APPORTS_HM3`, `TRANSFERT` | 0 |
| collisions business hash | 0 |
| valeurs negatives | 0 |

### Distribution finale

| Parametre | Volume | Unite | QA |
|---|---:|---|---|
| `NIVEAU_EAU` | 84831 | `m` | OK |
| `VOLUME` | 10136 | `Mm3` | OK |
| `LACHER` | 84830 | `Mm3/j` | OK |
| `APPORTS_HM3` | 84820 | `Mm3/j` | OK |
| `TRANSFERT` | 8035 | `Mm3/j` | OK |

### Tables non touchees

| Table | Volume apres load |
|---|---:|
| `hydro.mesure_barrage` | 84831 |
| `hydro.mesure_debit` | 652446 |
| `meteo.mesure_evaporation` | 48900 |
| `meteo.mesure_precipitation` | 546007 |
| `meteo.mesure_temperature` | 0 |
| `qualite.mesure_qualite_barrage` | 7820 |
| `qualite.mesure_qualite_nappe` | 63047 |
| `qualite.mesure_qualite_riviere` | 59534 |
| `qualite.mesure_qualite_sebou` | 49954 |

## Solution

Tous les controles post-load obligatoires sont conformes.

Decision controle post-load :

- `HYDRO_BARRAGE_PARAM_OK`

## Optional improvements

Avant Phase 5, ajouter des vues d'exposition `api` ou `analytics` construites depuis `hydro.mesure_barrage_param` pour isoler les dashboards de la structure physique.
