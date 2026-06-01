# Pipelines et ingestion

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | index |
| Périmètre | pipelines officiels, ingestion, QA, rollback et lineage |
| Source de vérité | Non, index |
| Dernière mise à jour | 2026-05-22 |

## Rôle

Ce dossier accueillera les workflows d'ingestion officiels après validation. Les spécifications préparatoires restent dans `docs/101_preparation_ingestion_v1/` et `docs/102_preparation_model_build_feature_store/` jusqu'à décision d'industrialisation.

## Principes

- ingestion reproductible ;
- dry-run avant écriture ;
- QA blocking explicite ;
- rollback documenté ;
- lineage source -> staging -> métier -> API.

