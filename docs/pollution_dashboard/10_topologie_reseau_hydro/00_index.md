# Audit Topologique et Préparation du Routage Hydrologique

Ce dossier contient l'ensemble des analyses, scripts et plans d'action nécessaires pour transformer la table brute `geo.reseau_hydrographique` en un véritable graphe topologique navigable, permettant un routage scientifique (ou un routage visuel de haute précision) vers le barrage de garde de Sebou.

## Contenu du dossier

1. `01_audit_connectivite_reseau.md` : Bilan de la connectivité et des problèmes spatiaux.
2. `02_audit_sens_ecoulement.md` : Bilan sur la direction des lignes (amont/aval).
3. `03_audit_confluences_et_noeuds.md` : Bilan des nœuds et intersections.
4. `04_audit_segments_isoles.md` : Bilan des réseaux disjoints.
5. `05_audit_rattachement_stations_barrages.md` : Analyse de proximité (snapping).
6. `06_plan_correction_topologique.md` : Stratégie de correction proposée.
7. `07_scripts_sql_audit_readonly.sql` : Requêtes d'investigation sans impact.
8. `08_scripts_sql_preparation_topologie_A_VALIDER.sql` : Script DDL de migration (Schéma `geo_work`).
9. `09_tests_routage_garde_sebou.md` : Analyse spécifique de la cible "Barrage de Garde".

**Rappel Important** : Ce travail s'inscrit dans la Phase A. **Aucun script DDL destructif n'a été exécuté**. La production de ce graphe permettra le passage en Phase B (Routage Réel).
