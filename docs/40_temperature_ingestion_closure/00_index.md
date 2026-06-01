# Clôture ingestion température

Statut proposé : `GO_CONTROLLED_METEO_INSERT`.

## Synthèse
- Source prioritaire : `timeseries_temperature_global.csv`.
- Lignes source : 445194.
- Stations source : 37.
- Période : 1983-01-01 à 2026-06-10.
- Nulls : 0 ; doublons Date/Station : 0 ; T_Min > T_Max : 0 ; outliers critiques : 0.
- Stations résolues : 37/37.
- Cible `meteo.mesure_temperature` : 0 ligne avant ingestion.
- Lineage cible absent : import_batch_id, source_station_name, qa_status, source_file, source_row_number.

## Fichiers
| Fichier | Contenu | Statut |
|---|---|---|
| 00_index.md | Index et statut final | Produit |
| 01_final_audit_temperature.md | Audit final source et DB | Produit |
| 02_station_resolution_final.md | Mapping final des 37 stations | Produit |
| 03_lineage_architecture.md | Architecture lineage/rollback | Produit |
| 04_staging_execution_plan.md | Plan execution staging | Produit |
| 05_controlled_insert_plan.md | Plan insertion métier contrôlée | Produit |
| 06_rollback_strategy.md | Rollback logique | Produit |
| 07_ml_readiness_temperature.md | Validation ML-ready | Produit |
| 08_sql_scripts_review.md | Scripts SQL générés et non exécutés | Produit |
| 09_go_nogo_temperature_ingestion.md | Décision GO/NOGO | Produit |


## Artefacts
- `temperature_station_resolution_final.csv` : mapping final station source -> station_id.
- `_db_audit_readonly.json` : audit DB read-only.
- `_manual_station_codes_readonly.json` : vérification DB read-only des codes validés manuellement.
