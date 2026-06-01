# Plan insertion métier contrôlée

## Préconditions bloquantes
- Tables `metadata.import_batch` et `metadata.import_batch_lineage` disponibles.
- Colonnes lineage ajoutées à `meteo.mesure_temperature`.
- Staging chargé et contrôlé : 445194 lignes.
- 37/37 stations résolues.
- Aucune ligne `REVIEW` ou `REJECTED`.

## Insertion cible
Insérer uniquement les lignes staging validées vers :
`meteo.mesure_temperature(temps, station_id, val_min, val_max, val_moy, import_batch_id, source_station_name, qa_status, source_file, source_row_number)`.

## Contrôles post-insert
- Count cible par `import_batch_id` = 445194.
- Doublons `(temps, station_id)` = 0.
- Nulls `val_min/val_max/station_id` = 0.
- `val_min <= val_max` pour 100% des lignes.
- Alias `Bab_Ouender` conservé dans `source_station_name`.
- `Bab Ouender` et `Bab_Ouender` rattachés au même `station_id` avec statuts traçables.
