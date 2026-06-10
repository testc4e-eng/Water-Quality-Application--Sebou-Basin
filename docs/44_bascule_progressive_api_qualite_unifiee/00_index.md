# Bascule Progressive vers l'API Qualité Unifiée

Ce dossier documente la Phase 4.5 de migration progressive du backend Qualité vers la nouvelle vue logique `api.v_qualite_dashboard_unifiee`.

L'objectif est de consolider l'accès aux données Qualité (temps réel, historique, barrages) derrière une interface API unifiée, sans altérer les sources de données ni casser les dashboards critiques existants (comme le Dashboard Accueil DG).

## Sommaire

1. [`01_endpoints_unified_quality.md`](01_endpoints_unified_quality.md) - Documentation des nouvelles routes `/unified/` ajoutées.
2. [`02_tests_api.md`](02_tests_api.md) - Résultats des tests de validation sur les nouveaux endpoints.
3. [`03_comparaison_ancienne_nouvelle_api.md`](03_comparaison_ancienne_nouvelle_api.md) - Comparatif entre l'approche fragmentée et l'approche unifiée.
4. [`04_limites_et_decision_bascule.md`](04_limites_et_decision_bascule.md) - Points d'attention et critères de bascule des Dashboards.

## Statut Actuel

```text
QUALITY_UNIFIED_VIEW = OK
QUALITY_UNIFIED_API = OK (Expérimental)
DASH_QUALITE_BASCULE = À FAIRE (Après validation)
DASH_DG = NE PAS TOUCHER
```
