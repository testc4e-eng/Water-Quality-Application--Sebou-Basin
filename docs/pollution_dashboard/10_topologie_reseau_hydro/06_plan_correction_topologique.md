# Plan de Correction Topologique

## Objectif
Préparer un graphe orienté fiable pour le routage de la pollution sans altérer la donnée source brute.

## Étapes de la Phase B (Après validation)

1. **Création du schéma de travail**
   - `CREATE SCHEMA IF NOT EXISTS geo_work;`

2. **Éclatement et Nettoyage (`geo_work.reseau_hydro_edges_raw`)**
   - `ST_Dump` pour passer de `MultiLineString` (697) à `LineString`.
   - Ajout d'une colonne `edge_id` (Primary Key).
   - Calcul des longueurs `length_m`.

3. **Validation et Inversion de Sens**
   - Implémentation de la colonne `needs_reverse`. 
   - Application de `ST_Reverse` sur demande si des tronçons remontent la pente ou pointent vers l'Est.

4. **Création des Nœuds (`geo_work.reseau_hydro_nodes`)**
   - Utilisation de `pgr_createTopology` avec tolérance progressive (5m, puis 10m si des gaps persistent).
   - Remplissage des colonnes `source` et `target`.

5. **Définition de l'Option de Routage (Phase C)**
   - Option Recommandée : **Option 2 (SQL Récursif PostGIS)** ou **Option 3 (NetworkX Python)** puisque `pgRouting` n'est pas installé sur le serveur.
   - Si l'Option 3 est retenue : Le backend Python chargera les `edges` et utilisera `networkx.shortest_path`.

## Risques
- Des boucles infinies si le réseau contient des cycles erronés (canaux circulaires).
- Des branches mortes avant le barrage de garde (le routage s'arrêtera nets).
