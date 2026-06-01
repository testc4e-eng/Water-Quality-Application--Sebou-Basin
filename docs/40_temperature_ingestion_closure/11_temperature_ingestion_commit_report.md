# Rapport commit ingestion température

Date : 2026-05-25  
Batch ID : `2d67f599-7714-4712-ba1f-5f3584c4c961`  
Statut final : `GO_TEMPERATURE_INGESTION_COMMITTED`

## Règle appliquée

`DEDUP_CANONICAL_ONLY`

Une seule ligne métier canonique est insérée par `(temps, station_id)`. Pour le cas `Bab Ouender` / `Bab_Ouender`, la priorité source sur la période commune est :

1. `Bab Ouender`
2. `Bab_Ouender`

Les doublons exacts alias ne sont pas insérés deux fois dans `meteo.mesure_temperature`.

## Scripts exécutés

| Script | Statut |
|---|---|
| `_executed_runs/06b_controlled_temperature_insert_deduplicated_EXECUTED.sql` | Exécuté avec COMMIT |

## Volumétrie

| Indicateur | Valeur |
|---|---:|
| Lignes staging | 445194 |
| Doublons exacts alias retirés | 7305 |
| Lignes insérées cible | 437889 |
| Lignes lineage `INSERTED` | 437889 |

## QA post-insert

| Contrôle | Résultat |
|---|---:|
| Count cible par batch | 437889 |
| Doublons `(temps, station_id)` | 0 |
| `station_id` null | 0 |
| `val_min` / `val_max` null | 0 |
| `val_min > val_max` | 0 |
| `import_batch_id` null | 0 |
| `source_station_name` null | 0 |
| `qa_status` non autorisé | 0 |

## Contrôle Bab Ouender / Bab_Ouender

| Source conservée | Station ID | QA | Période | Lignes |
|---|---|---|---|---:|
| `Bab Ouender` | `517c713a-dda4-4dcb-a033-4143062487fd` | `MANUAL_VALIDATED_WITH_SOURCE_ALIAS` | 1983-01-01 à 2020-12-31 | 13880 |
| `Bab_Ouender` | `517c713a-dda4-4dcb-a033-4143062487fd` | `MANUAL_VALIDATED_WITH_SOURCE_ALIAS` | 2021-01-01 à 2024-08-31 | 1339 |

La période commune 2001-01-01 à 2020-12-31 a été dédupliquée côté cible, car les valeurs TMAX/TMIN étaient strictement identiques.

## Batch

| Champ | Valeur |
|---|---|
| `batch_status` | `COMMITTED` |
| `expected_rows` | 445194 |
| `loaded_rows` | 445194 |
| `committed_rows` | 437889 |
| `rejected_rows` | 7305 |

## Warnings

- `import_batch_id` dans `meteo.mesure_temperature` n'a pas de FK directe vers `metadata.import_batch`, à cause de la limitation hypertable/columnstore détectée lors du DDL. La traçabilité référentielle est assurée par `metadata.import_batch_lineage`.
- `rejected_rows=7305` signifie ici `doublons exacts alias non insérés en cible`, pas rejet qualité de valeurs.

## Conclusion

`GO_TEMPERATURE_INGESTION_COMMITTED`

L'ingestion métier contrôlée est terminée avec unicité métier, QA post-insert valide, batch commité et rollback logique disponible via `metadata.import_batch` / `metadata.import_batch_lineage`.
