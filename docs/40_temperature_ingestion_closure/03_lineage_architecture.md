# Architecture lineage et rollback

## Constat
`meteo.mesure_temperature` dispose actuellement de la clé primaire `(temps, station_id)` et d'une FK vers `infra.stations_mesure(id)`, mais pas de colonnes de traçabilité source.

## Décision architecture proposée
Créer :
- `metadata.import_batch` pour identifier l'exécution d'import.
- `metadata.import_batch_lineage` pour tracer source -> cible ligne par ligne.
- Enrichir `meteo.mesure_temperature` avec `import_batch_id`, `source_station_name`, `qa_status`, `source_file`, `source_row_number`.

## Règles
- Aucun rollback physique par défaut.
- Rollback logique par `import_batch_id` et statut batch.
- Conservation obligatoire des noms source originaux, notamment `Bab_Ouender`.
- `MANUAL_VALIDATED_WITH_SOURCE_ALIAS` doit rester audit-ready.

## Impact modèle cible
L'ajout des colonnes de lineage est requis avant `GO_CONTROLLED_METEO_INSERT`; sinon le rollback par batch n'est pas fiable.
