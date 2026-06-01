# Tests Post-Nodification

## 1. Test de traversabilité des confluences
Vérifier que les arêtes 571 et 619 partagent désormais un nœud commun.
```sql
SELECT source, target FROM geo_work.reseau_hydro_edges_noded WHERE edge_id IN (571, 619);
```

## 2. Test de continuité (Routage)
Calculer un chemin entre Fès et le Barrage de Garde. Le chemin doit être plus complet et traverser les intersections autrefois bloquantes.

## 3. Test de fragmentation
Comparer `nx.number_connected_components(G)` avant et après. La cible est < 10.

## 4. Validation QA
Le mode QA doit afficher les intersections nodées en **Vert** (Source/Target partagés).
