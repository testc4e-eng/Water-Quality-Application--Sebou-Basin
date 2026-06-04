# Stratégie Graph Snapshot V0

## 1. Objectif
Générer un graphe de travail (Working Graph) à partir des 697 tronçons existants, permettant de développer les features graph-aware sans attendre la validation scientifique hydraulique.

## 2. Spécification de `graph_snapshot_v0`

### Propriétés à calculer pour le Snapshot :
- `topology_confidence` : Indice de confiance sur l'arête (ex: `0.95` pour validé, `0.60` pour probable, `0.20` pour douteux).
- `connected_component_id` : Identifiant de la composante connexe (permet de gérer les sous-réseaux déconnectés).
- `node_degree` : Nombre de connexions entrantes/sortantes d'un nœud.
- `distance_to_station` : Distance topologique ou kilométrique à la station de mesure la plus proche.
- `distance_to_barrage` : Distance topologique au barrage amont/aval le plus proche.

## 3. Règle d'usage
Ce graphe est strictement orienté *Analytics*. Toute inférence tirée de ce snapshot devra être pondérée par la `topology_confidence`. Les points isolés intègrent la quarantaine, mais l'entraînement tabulaire peut inclure les attributs graphiques calculés.
