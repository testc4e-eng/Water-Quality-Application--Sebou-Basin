# Audit des Intersections Non Connectées

## Croisements sans Nœuds
Il s'agit de cas où deux segments se croisent géométriquement mais ne partagent aucun nœud topologique. C'est un problème majeur car le flux hydrologique ne peut pas "sauter" d'un oued à un autre lors d'une confluence ou d'un croisement.

### Top 10 des Croisements Critiques

| edge_a | edge_b | intersection_point |
| :--- | :--- | :--- |
| 571 | 619 | POINT(571639 431348) |
| 521 | 607 | POINT(518968 470796) |
| 281 | 519 | POINT(576144 447875) |
| 444 | 469 | POINT(509911 379629) |
| 119 | 667 | POINT(405006 423973) |
| 441 | 642 | POINT(497492 407528) |
| 257 | 638 | POINT(545172 402361) |
| 371 | 400 | POINT(622684 403952) |
| 310 | 368 | POINT(532025 382428) |
| 436 | 638 | POINT(545168 402366) |

## Impact sur le Routage
Le croisement **571 / 619** par exemple semble être une confluence majeure. Sans nœud à cet endroit, tout le bassin en amont de 571 est déconnecté du barrage de garde situé en aval de 619.

## Solution Technique
Utiliser `ST_Split` ou reconstruire la topologie en forçant le découpage aux intersections (`ST_Node`) avant d'injecter dans `geo_work.reseau_hydro_edges_clean`.
