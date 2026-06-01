# Plan de Mise à Jour NetworkX (Phase D.1B)

Le moteur `graph_builder.py` doit être mis à jour pour consommer la nouvelle structure de données.

## Changements requis
1. **Source de données** : Pointer vers `geo_work.reseau_hydro_edges_noded`.
2. **Attributs enrichis** : Charger `component_id`, `edge_quality` et `qa_status`.
3. **Optimisation** : Le nombre d'arêtes risque de doubler. Vérifier le temps de chargement Dijkstra.
4. **Validation des cycles** : NetworkX doit détecter si la nodification a introduit des micro-cycles anormaux.

## Code Preview
```python
cur.execute("SELECT source, target, length_m, ... FROM geo_work.reseau_hydro_edges_noded")
```
