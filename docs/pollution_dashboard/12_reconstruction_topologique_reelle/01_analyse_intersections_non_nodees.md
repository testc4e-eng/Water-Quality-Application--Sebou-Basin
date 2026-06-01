# Analyse des Intersections Non Nodées

## Inventaire des Croisements Critiques (Audit du 14/05/2026)

| edge_a | edge_b | intersection_type | has_node | impact |
| :--- | :--- | :--- | :--- | :--- |
| 571 | 619 | CROSSING | True | PARTIAL |
| 521 | 607 | CROSSING | True | PARTIAL |
| 281 | 519 | CROSSING | True | PARTIAL |
| 444 | 469 | CROSSING | False | **BLOCKED_ROUTING** |
| 119 | 667 | CROSSING | True | PARTIAL |
| 441 | 642 | CROSSING | True | PARTIAL |
| 257 | 638 | CROSSING | False | **BLOCKED_ROUTING** |
| 371 | 400 | CROSSING | True | PARTIAL |
| 310 | 368 | CROSSING | True | PARTIAL |
| 436 | 638 | CROSSING | False | **BLOCKED_ROUTING** |

## Interprétation
- **has_node = True** : Un nœud existe à l'emplacement de l'intersection, mais les lignes ne sont pas découpées. Elles passent "par-dessus" sans que le nœud soit leur extrémité (source/target).
- **has_node = False** : Aucune connectivité n'est possible, le moteur NetworkX voit deux lignes disjointes qui se croisent.

> [!IMPORTANT]
> Sans nodification (`ST_Node`), le graphe ne peut pas capturer ces confluences. C'est la cause racine de la fragmentation du réseau en 35 composants.
