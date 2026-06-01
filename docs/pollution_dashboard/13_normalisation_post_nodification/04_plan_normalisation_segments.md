# Plan de Normalisation des Segments

## 1. Suppression des segments parasites
Tous les segments de longueur `< 1m` seront supprimés de la table finale, sauf s'ils constituent le seul lien entre deux composants majeurs.

## 2. Consolidation des attributs
- **flow_status** : Recalculé sur la base de la pente Z.
- **qa_status** : Tagging systématique des segments `CLEANED` ou `REMAINING_MICRO`.

## 3. Création de la table Finale
La table `geo_work.reseau_hydro_edges_final` sera la source unique de vérité pour :
- Le moteur NetworkX.
- Le Frontend (MapLibre).
- Les rapports d'audit pollution.
