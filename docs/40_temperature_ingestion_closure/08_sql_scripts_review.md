# Revue des scripts SQL température

Aucun script ci-dessous n'a été exécuté pendant cette phase.

| Script | Rôle |
|---|---|
| 00_create_temperature_daily_raw_staging.sql | Staging brut existant propositionnel |
| 01_copy_temperature_global_to_staging.sql | COPY CSV vers staging |
| 02_insert_temperature_validated_to_meteo.sql | Ancien insert sans lineage complet, à remplacer par 06 |
| 03_rollback_temperature_import_batch.sql | Ancien rollback staging, insuffisant sans lineage cible |
| 04_create_temperature_lineage_model_A_VALIDER.sql | DDL lineage et enrichissement cible à valider |
| 05_apply_temperature_station_resolution_A_VALIDER.sql | Application mapping station final au staging |
| 06_controlled_temperature_insert_A_VALIDER.sql | Insertion contrôlée avec lineage |
| 07_temperature_post_insert_qa_A_VALIDER.sql | Contrôles post-insert |
| 08_temperature_logical_rollback_A_VALIDER.sql | Rollback logique par batch |


## Recommandation
Utiliser la série 04 -> 08 pour l'exécution contrôlée. Les scripts 02/03 initiaux restent utiles comme historique, mais ne suffisent pas pour la cible audit-ready.
