# Phase D.1 — Reconnexion Topologique Exhaustive

## Objectif
Reconstruire une connectivité maximale sur le réseau hydrographique du Sebou tout en respectant les contraintes hydrauliques et en préservant le composant isolé légitime.

## Fichiers de la Phase
1. [01_audit_connected_components.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/11_reconnexion_topologique/01_audit_connected_components.md) : Analyse des 35 composants actuels.
2. [02_audit_gaps_reseau.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/11_reconnexion_topologique/02_audit_gaps_reseau.md) : Identification des déconnexions physiques (undershoots/gaps).
3. [03_audit_intersections_non_connectees.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/11_reconnexion_topologique/03_audit_intersections_non_connectees.md) : Détection des croisements géométriques sans nœud topologique.
4. [04_plan_snapping_progressif.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/11_reconnexion_topologique/04_plan_snapping_progressif.md) : Stratégie de reconnexion (5m, 10m, 25m).
5. [05_reseau_isole_reference.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/11_reconnexion_topologique/05_reseau_isole_reference.md) : Documentation du composant `ISOLATED_ACCEPTED`.
6. [06_plan_reconstruction_graphe.md](file:///c:/dev/WQDSS/repo_git/docs/pollution_dashboard/11_reconnexion_topologique/06_plan_reconstruction_graphe.md) : Mise à jour du moteur NetworkX.

## Statut Actuel
- **Composants :** 35 détectés.
- **Composant Principal :** 36.5% de couverture.
- **Objectif Cible :** > 85% de couverture.
