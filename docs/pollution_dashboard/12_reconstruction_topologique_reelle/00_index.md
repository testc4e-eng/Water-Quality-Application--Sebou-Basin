# Phase D.1B — Reconstruction Topologique Réelle (Nodification)

## Objectif
Passer d'une topologie basée sur le clustering de points à une topologie réelle "nodée". Cela implique de découper géométriquement les tronçons aux intersections pour garantir la traversabilité du graphe.

## Fichiers de la Phase
1. [01_analyse_intersections_non_nodees.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/01_analyse_intersections_non_nodees.md) : Inventaire des croisements bloquants.
2. [02_plan_nodification_reseau.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/02_plan_nodification_reseau.md) : Stratégie de découpage (ST_Node).
3. [03_pipeline_reconstruction_topologique.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/03_pipeline_reconstruction_topologique.md) : Étapes UnaryUnion -> Node -> Dump.
4. [04_audit_avant_apres_nodification.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/04_audit_avant_apres_nodification.md) : KPIs de connectivité.
5. [05_plan_rebuild_networkx.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/05_plan_rebuild_networkx.md) : Adaptation du moteur Python.
6. [06_risques_topologiques.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/06_risques_topologiques.md) : Gestion des doublons et des cycles.
7. [07_sql_nodification_prepare_A_VALIDER.sql](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/07_sql_nodification_prepare_A_VALIDER.sql) : Script de production (Read-only prep).
8. [08_tests_post_nodification.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/08_tests_post_nodification.md) : Validation des chemins critiques.
9. [09_checklist_validation_hydrologique.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/12_reconstruction_topologique_reelle/09_checklist_validation_hydrologique.md) : Validation métier.

## KPIs Cibles
- **Composants :** < 10 (Réduction de 35 à <10).
- **Couverture Composant Principal :** > 70% (Augmentation de 36% à >70%).
- **Intersections Bloquées :** 0.
