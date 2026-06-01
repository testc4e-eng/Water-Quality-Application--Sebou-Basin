# Plan d'exécution staging

## Ordre exact
1. Créer `staging.temperature_daily_raw`.
2. Créer/enregistrer `metadata.import_batch` pour le batch température.
3. Charger `timeseries_temperature_global.csv` vers staging via `COPY`.
4. Calculer QA flags : null, inversion T_Min/T_Max, outlier, station unmapped.
5. Appliquer le mapping station final depuis `temperature_station_resolution_final.csv` ou CTE SQL validé.
6. Contrôler lignes : total, validées, alias, review, rejected.
7. Bloquer toute ligne non `VALIDATED`, `MANUAL_VALIDATED`, `MANUAL_VALIDATED_WITH_SOURCE_ALIAS`.
8. Préparer insertion métier.

## Volumétrie attendue
| Indicateur | Lignes |
|---|---|
| Lignes staging attendues | 445194 |
| VALIDATED | 286757 |
| MANUAL_VALIDATED | 135913 |
| MANUAL_VALIDATED_WITH_SOURCE_ALIAS | 22524 |
| REVIEW | 0 |
| REJECTED | 0 |


## QA flags
Statuts autorisés : `VALIDATED`, `MANUAL_VALIDATED`, `MANUAL_VALIDATED_WITH_SOURCE_ALIAS`.
Statuts bloquants : `REVIEW`, `REJECTED`.
