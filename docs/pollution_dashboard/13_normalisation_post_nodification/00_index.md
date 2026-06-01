# Phase D.1C — Normalisation & Consolidation Post-Nodification

## Objectif
Stabiliser le réseau hydrographique après l'opération de nodification. Il s'agit de supprimer les artefacts (micro-segments, cycles) et de préparer la table finale `geo_work.reseau_hydro_edges_final` pour une exploitation sécurisée.

## Fichiers de la Phase
1. [01_audit_micro_segments.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/01_audit_micro_segments.md) : Inventaire des segments < 5m.
2. [02_audit_cycles_artificiels.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/02_audit_cycles_artificiels.md) : Détection des boucles non hydrauliques.
3. [03_audit_doublons_geometriques.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/03_audit_doublons_geometriques.md) : Détection des superpositions.
4. [04_plan_normalisation_segments.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/04_plan_normalisation_segments.md) : Stratégie de nettoyage.
5. [05_plan_snapping_final.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/05_plan_snapping_final.md) : Reconnexion contrôlée.
6. [06_plan_consolidation_networkx.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/06_plan_consolidation_networkx.md) : Métriques de qualité finales.
7. [07_sql_cleanup_prepare_A_VALIDER.sql](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/07_sql_cleanup_prepare_A_VALIDER.sql) : Script de consolidation.
8. [08_tests_post_cleanup.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/08_tests_post_cleanup.md) : Validation de la traversabilité.
9. [09_kpi_connectivite_finale.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/13_normalisation_post_nodification/09_kpi_connectivite_finale.md) : Comparaison finale des KPIs.

## KPIs Cibles
- **Composants :** ≤ 3.
- **Cycles Artificiels :** 0.
- **Micro-segments parasites :** < 1%.
- **Routage Fès/Meknès -> Garde :** OK.
