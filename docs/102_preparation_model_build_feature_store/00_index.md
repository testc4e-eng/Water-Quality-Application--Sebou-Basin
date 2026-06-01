# Préparation Model Build & Feature Store

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | specification / design |
| Périmètre | data governance, model build, feature store, QA, pre-ML readiness, industrialisation |
| Source de vérité | Non - préparation avant validations métier |
| Documents liés | `docs/00_SOURCE_OF_TRUTH_MASTER.md`, `docs/88_swat_wasp_legacy_transition/`, `docs/96_catalogue_metier_donnees_affichage/`, `docs/97_audit_temporalite_reelle/`, `docs/101_preparation_ingestion_v1/` |
| Dernière mise à jour | 2026-05-22 |

## Statut du chantier

Ce dossier prépare les phases suivantes sans appliquer de changement en base.

| Phase | Fichier | Statut |
|---|---|---|
| Phase A - Data Governance Foundation | `01_data_governance_foundation.md` | READY |
| Phase A - Canonical Reference | `02_canonical_reference_spec.md` | READY |
| Phase A - Temporal Policy | `03_temporal_policy.md` | READY |
| Phase A - Data Origin Policy | `04_data_origin_policy.md` | READY |
| Phase A - Feature Registry | `05_feature_registry_spec.md` | READY |
| Phase A - Dataset Contract | `01_data_governance_foundation.md`, `05_feature_registry_spec.md` | READY |
| Phase A - Unit Policy | `01_data_governance_foundation.md`, `04_data_origin_policy.md` | READY |
| Phase A - Freshness Policy | `03_temporal_policy.md`, `05_feature_registry_spec.md` | READY |
| Phase A - Validation Authority | `01_data_governance_foundation.md` | READY |
| Phase B - Model Build Specification | `06_model_build_specification.md` | READY |
| Phase C - Feature Store Specification | `07_feature_store_specification.md` | READY |
| Phase D - QA Validation Framework | `08_qa_validation_framework.md` | READY |
| Phase D.1 - Graph Governance | `13_graph_governance.md` | PREPARED |
| Phase D.1 - Graph Model Build | `14_graph_model_build.md` | PREPARED |
| Phase D.1 - Graph Feature Store | `15_graph_feature_store.md` | PREPARED |
| Phase E - Pre-ML Readiness | `09_pre_ml_readiness.md` | PREPARED |
| Phase E1 - ML Sandbox Execution Governance | `10_ml_sandbox_execution_governance.md` | SANDBOX_BASELINE_EXECUTED |
| Phase F - Industrialisation Preparation | `10_industrialisation_preparation.md` | PENDING_VALIDATION |
| Validations en attente | `11_backlog_pending_validations.md` | PENDING_VALIDATION |
| Risques et dépendances | `12_risks_and_dependencies.md` | PENDING_VALIDATION |

## Garde-fous

- Aucun DDL n'est appliqué.
- Aucune table n'est créée.
- Aucune donnée n'est modifiée.
- Aucun mapping spatial ou métier n'est figé.
- Les outputs SWAT/WASP existants restent `LEGACY_MODELING_TO_REPLACE`.
- Les dépendances Reda, Anas et validation spatiale sont explicitement marquées.
- Les dataset contracts, unit policies, freshness scores et validation authorities sont conceptuels tant qu'ils ne sont pas validés.

## Légende

| Marqueur | Signification |
|---|---|
| VERIFIED | fait vérifié par audit documentaire ou DB |
| ASSUMPTION | hypothèse de conception raisonnable, non validée |
| TO_VALIDATE | décision métier, SIG, QA ou modèle à obtenir |
