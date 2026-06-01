# Plan d'exécution contrôlé

## Phase A — Préparation
1. Standardiser le chemin MNT source : `C:\dev\WQDSS\data\MNT SEBOU 30N 30M\seboureproj`.
2. Verrouiller le CRS MNT opérationnel (`EPSG:32630` ou WKT validé).
3. Créer la table QA `qa.hydraulic_direction_validation` en DEV après validation.

## Phase B — QA read-only
1. Lire `geo_work.reseau_hydro_edges_final`.
2. Transformer start/end vers CRS MNT.
3. Echantillonner `z_start`, `z_end`.
4. Calculer pente et statut QA.
5. Charger uniquement la table QA, jamais le réseau source.

## Phase C — Revue cartographique
1. Produire couche QGIS/MapLibre des statuts.
2. Prioriser `FLOW_REVERSED_SUSPECTED` forts et `FLAT_SEGMENT` critiques.
3. Arbitrer les corrections futures dans une table de décision, pas dans le réseau.

## Phase D — Activation scientifique
1. Marquer uniquement les segments validés.
2. Publier une vue runtime scientifique séparée.
3. Garder `geo.reseau_hydrographique` et `geo_work.reseau_hydro_edges_final` intacts.

## Critère de passage
Le moteur peut passer de topologique à hydraulique scientifique seulement après revue et validation des 139 candidats inversion et des 81 segments plats.
