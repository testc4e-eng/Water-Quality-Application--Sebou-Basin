# Volumétrie et Couverture

*Les métriques ci-dessous sont estimées d'après les audits initiaux et les requêtes READ-ONLY documentées.*

| Table | Lignes | Stations/IRE | Paramètres | Date min | Date max | Valeurs NULL/Err | Unités |
| ----- | -----: | -----------: | ---------: | -------- | -------- | -----------: | ------ |
| `mesure_qualite_sebou` | ~8k | ~20 | ~15 | ~2020 | ~2025 | 0 | Unifiées |
| `mesure_qualite_riviere` | ~150k | ~300 | ~50 | ~1980 | ~2025 | Faible | Multiples |
| `mesure_qualite_barrage` | ~50k | ~40 | ~30 | ~1990 | ~2025 | Moyen | Multiples |
| `suivi_qualite_barrage_garde_hebdo`| ~2.5k | 1 | ~10 | ~2015 | ~2025 | Faible | Restreintes |

## Constats de couverture
- **Chevauchement temporel et spatial** : `mesure_qualite_sebou` (les sentinelles) est en grande partie un sous-ensemble ultra-qualifié de `mesure_qualite_riviere` (pour les 6 IRE validés sur les années récentes).
- **Stations sans mapping** : `mesure_qualite_riviere` contient une longue traîne de vieux IRE sans correspondance exacte dans `api.v_station_dimension`.
- **Paramètres sans mapping** : Mêmes constats pour des paramètres organiques obsolètes ou mal orthographiés (ex: M.E.S vs MES).
