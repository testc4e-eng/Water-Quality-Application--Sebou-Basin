# Backlog Phase 1 : Construction de la Topologie Hydrographique

L'objectif de la Phase 1 est de remplacer la simulation visuelle de la propagation par un algorithme capable de déterminer avec précision le chemin hydraulique réel et de lister les tronçons exacts impactés.

## 1. Audit et Préparation des Données (Data Engineering)
- [ ] **Audit Géométrique** : Analyser la table `geo.reseau_hydrographique` pour vérifier la validité et la propreté des lignes (vérifier que les intersections sont des nœuds, qu'il n'y a pas d'artefacts ou de dépassements - dangles/overshoots).
- [ ] **Analyse du Sens d'Écoulement** : Vérifier si la numérisation des lignes reflète le sens d'écoulement (du nœud source vers le nœud cible). Si ce n'est pas le cas, identifier les champs de direction ou générer le flux via le Modèle Numérique de Terrain (MNT).

## 2. Création de la Topologie de Base de Données
- [ ] **Installation pgRouting** : Activer l'extension `CREATE EXTENSION pgrouting;` sur la base de données PostgreSQL.
- [ ] **Création de la Topologie** :
  - Ajouter des colonnes `source` et `target` au réseau hydrographique.
  - Exécuter la fonction `pgr_createTopology('geo.reseau_hydrographique', 0.0001, 'geom', 'id', 'source', 'target')`.

## 3. Développement Backend (FastAPI)
- [ ] **Nouveau Service de Routage** : Créer un endpoint `GET /api/v1/routing/downstream` qui prend en paramètre les coordonnées `(lng, lat)` de l'impact.
- [ ] **Requête SQL de Parcours de Graphe** : Implémenter une requête SQL utilisant `pgr_drivingDistance` ou `pgr_dijkstra` orienté (avec coût infini pour remonter le courant) afin de récupérer la liste des IDs des tronçons en aval.

## 4. Intégration Frontend (React)
- [ ] **Mise à Jour de `PollutionMap`** : Lors du clic, appeler le nouvel endpoint API pour obtenir le GeoJSON exact de la trajectoire aval.
- [ ] **Rendu du Tracé Exact** : Assigner ce GeoJSON renvoyé au `pollutedRiverFeature` pour que la ligne rouge suive les méandres exacts du réseau.
- [ ] **Intersection des Stations** : Remplacer l'algorithme "Est-Ouest" par une requête spatiale (ou de graphe) identifiant les stations situées le long du chemin tracé.
