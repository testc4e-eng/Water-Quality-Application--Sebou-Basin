# Cartographie documentaire

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | rapport de réorganisation documentaire |
| Source de vérité | Non - rapport d'audit et de consolidation |
| Date | 2026-05-22 |

## Catégories

| Catégorie | Rôle | Règle |
|---|---|---|
| active | documents maîtres et résumés agents | maintenance prioritaire |
| experimental | chantiers DEV/P0/spécification | ne pas officialiser sans décision |
| historical | audits/lots/dry-runs/preuves | conserver et archiver progressivement |
| legacy_archive | archives déjà classées | ne pas utiliser comme vérité courante |
| unclassified | documents à qualifier | revue progressive |

## Cartographie cible proposée

| Zone actuelle | Cible | Rationale |
|---|---|---|
| docs/32_* à docs/90_* | docs/12_historique_et_archives/ | preuves historiques et lots |
| docs/92_referentiel_reglementaire_qualite_SAD/ | docs/07_donnees_et_referentiels/referentiel_reglementaire/ | référentiel data actif DEV |
| docs/93_validation_technique_vues_sql/ | docs/10_dashboards_et_api/vues_sql/ | exposition API/dashboard |
| docs/94_api_frontend_transition/ | docs/10_dashboards_et_api/api_frontend_transition/ | contrats API/frontend |
| docs/IDP_POLLUTION_ANALYSIS/ | docs/06_anomalies_et_arbitrages/idp_pollution/ | chantier actif avec arbitrage |
| docs/101_preparation_ingestion_v1/ | docs/08_pipelines_et_ingestion/preparation_v1/ | spécification ingestion |
| docs/102_preparation_model_build_feature_store/ | docs/09_modeles_swat_wasp/model_build_feature_store/ | spécification modèles/features |
