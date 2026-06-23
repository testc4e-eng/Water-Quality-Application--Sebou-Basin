# Règles de classification `data_temporality`

## Valeurs possibles

```text
TIME_SERIES
POINT_MEASURE
MIXED        (prévu pour un futur support composite)
NO_DATA
```

## Contextes de mesure (`measurement_context`)

| Support | `measurement_context` |
|---|---|
| STATION_QUALITE | `suivi_regulier` |
| STATION_SENTINELLE | `temps_reel_sentinelle` |
| STATION_HYDRO | `suivi_regulier` |
| STATION_METEO | `suivi_regulier` |
| BARRAGE | `historique_barrage` |
| POINT_PRELEVEMENT_POLLUTION | `campagne_pollution_idp` |
| SOURCE_POLLUTION | `inventaire_source_pollution` |

## Table de décision

| `data_family` | Critère statistique | `data_temporality` |
|---|---|---|
| `POLLUTION_IDP` | ignoré | `POINT_MEASURE` |
| `QUALITE_ABH` | measure_count >= 10 AND date_count >= 5 | `TIME_SERIES` |
| `QUALITE_ABH` | sinon | `POINT_MEASURE` |
| `HYDROLOGIE` | measure_count >= 10 AND date_count >= 5 | `TIME_SERIES` |
| `HYDROLOGIE` | sinon | `POINT_MEASURE` |
| `CLIMATOLOGIE` | measure_count >= 10 AND date_count >= 5 | `TIME_SERIES` |
| `CLIMATOLOGIE` | sinon | `POINT_MEASURE` |
| `BARRAGE` | measure_count >= 10 AND date_count >= 5 | `TIME_SERIES` |
| `BARRAGE` | sinon | `POINT_MEASURE` |

## Champs exposés

### `api.mv_business_map_availability`

- `measure_count`
- `date_count`
- `date_min`
- `date_max`
- `data_temporality`
- `data_family`
- `measurement_context`
- `source_table`

### `api.mv_business_map_features_v1`

Ces champs sont dans `attributes` :

- `data_temporality`
- `data_family`
- `measurement_context`
- `source_table`
- `source_kind`
