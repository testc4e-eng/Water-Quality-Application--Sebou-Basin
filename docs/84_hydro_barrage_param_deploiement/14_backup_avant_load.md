# Backup avant load Phase 4

## Context

La Phase 4 autorisait un backup prealable uniquement si `hydro.mesure_barrage_param` contenait deja des donnees.

## Analysis

Controle avant chargement :

| Controle | Resultat |
|---|---:|
| volume `hydro.mesure_barrage_param` avant load | 0 |
| backup necessaire | non |
| backup cree | non |

Tables explicitement interdites controlees avant/apres :

| Table | Volume |
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

Aucun backup de donnees cible n'a ete cree car la table cible etait vide avant chargement.

Decision backup :

- `BACKUP_NOT_REQUIRED`

## Optional improvements

Si un reload futur est demande alors que la cible contient des donnees, creer un backup dans `audit` avant toute action :

```sql
CREATE TABLE audit.bkp_hydro_mesure_barrage_param_<timestamp>
AS TABLE hydro.mesure_barrage_param;
```
