# Etat réseau runtime

## Objets DB contrôlés en lecture seule
| Objet | Type | Lignes | Statut |
|---|---|---:|---|
| `geo.reseau_hydrographique` | table source | 697 | disponible |
| `geo_work.reseau_hydro_edges_final` | table runtime | 728 | disponible |
| `geo_work.reseau_hydro_edges_final_vertices_pgr` | sommets pgRouting | 740 | disponible |
| `geo_work.reseau_hydro_nodes` | noeuds legacy | 732 | disponible |
| `geo_work.v_topo_qa` | vue QA | vue | disponible |

## QA géométrique runtime
| Contrôle | Résultat |
|---|---:|
| Segments runtime | 728 |
| Géométries nulles/vides | 0 |
| Géométries invalides | 0 |
| SRID runtime | 26191 |
| Source/target nuls | 0 |
| Self-loops source=target | 0 |
| Longueur min | 6.49 m |
| Longueur max | 27286.15 m |
| Longueur moyenne | 5486.93 m |

## Connectivité
| Indicateur | Valeur |
|---|---:|
| Noeuds degré 1 | 83 |
| Noeuds degré 2 | 600 |
| Noeuds degré >= 3 | 57 |
| Composantes non orientées | 13 |
| Noeuds considérés | 740 |

## Couverture MNT
Tous les 728 segments runtime intersectent l'emprise MNT après transformation vers `EPSG:32630`.

## Statut runtime actuel
Le graphe est exploitable pour démonstration topologique et affichage runtime, mais `hydraulic_direction_validated=false` reste correct. La direction scientifique dépend de la QA MNT et de l'arbitrage des statuts suspects.
