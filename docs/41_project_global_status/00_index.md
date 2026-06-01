# Index - Statut global projet SAD/WQDSS

Date : 2026-05-25  
Mode : audit + documentation + consolidation.  
Base de référence : DB réelle `abh_sad`, artefacts `_EXECUTED`, rapports récents.

## Statut global
`PREPROD_READY_CONDITIONNEL_SUR_QUALITE_ET_TEMPERATURE__HYDRAULIQUE_NOGO`

## Fichiers
| Fichier | Contenu | Statut |
|---|---|---|
| 00_index.md | Index du dossier et statut global | Produit |
| 01_global_project_status.md | Vue consolidée multi-chantiers | Produit |
| 02_quality_regulatory_status.md | Référentiel réglementaire qualité | Produit |
| 03_temperature_ingestion_status.md | Température | Produit |
| 04_hydraulic_validation_status.md | Validation hydraulique | Produit |
| 05_dashboard_status.md | Dashboards qualité/carto | Produit |
| 06_ml_readiness_status.md | ML readiness | Produit |
| 07_remaining_blockers.md | Blocages restants | Produit |
| 08_execution_priorities.md | Priorités P0-P3 | Produit |
| 09_governance_decisions_consolidated.md | Décisions consolidées | Produit |


## Sources vérifiées
- DB read-only : `metadata.qualite_*_reglementaire`, `meteo.mesure_temperature`, `metadata.import_batch`, `metadata.import_batch_lineage`, `staging.temperature_daily_raw`, `geo_work.*`.
- Scripts exécutés : `database/meteo_temperature/_executed_runs/*_EXECUTED.sql`.
- Endpoints qualité : FastAPI TestClient.
- Docs récentes : `docs/38_*`, `docs/40_temperature_ingestion_closure`, `docs/dashboard_metier_p0`, `docs/pollution_dashboard/15_future_hydraulic_validation`.
