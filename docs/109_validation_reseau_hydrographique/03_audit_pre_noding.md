# Audit pré-noding du réseau validé 2026-06-02

## Contexte

Objet audité en lecture seule :

- `geo_work.reseau_hydro_edges_valides_20260602`
- `geo_work.reseau_hydro_edges_valides_20260602_vertices_pgr`
- `geo_work.reseau_hydro_nodes_valides_20260602`

Le but de cet audit est de qualifier l’état exact du réseau métier validé avant création d’une version nœudée dérivée.

## Structure des segments validés

Colonnes principales de `geo_work.reseau_hydro_edges_valides_20260602` :

- `gid`
- `original shapefile lineage` : `source_row`
- `geom`
- `length_m`
- `start_geom`
- `end_geom`
- `source`
- `target`
- `flow_status`
- `qa_status`
- `qa_comment`
- `component_id`

Constats géométriques :

| Contrôle | Résultat |
|---|---:|
| Segments | 702 |
| Géométries invalides | 0 |
| Géométries non `LINESTRING` | 0 |
| Multigéométries | 0 |
| Longueur min | 5.45 m |
| Longueur max | 27,286.15 m |
| Longueur totale | 3,994,885.94 m |
| `source/target` nuls | 0 |

## Lignage et QA

| Contrôle | Résultat |
|---|---:|
| `source_row` distincts | 702 |
| Doublons `source_row` | 0 |
| `FLOW_CONFIRMED` | 671 |
| `FLOW_UNCERTAIN` | 31 |
| `VALIDATED_METIER__MNT_INVERSE_OVERRIDDEN` | 143 |

Lecture :

- chaque segment validé porte un lignage unique vers le shapefile métier ;
- la version validée est propre géométriquement ;
- le réseau reste toutefois fragmenté et insuffisamment nœudé pour un runtime consolidé.

## Sommets PGR existants

Table auditée : `geo_work.reseau_hydro_edges_valides_20260602_vertices_pgr`

| Contrôle | Résultat |
|---|---:|
| Sommets PGR | 750 |
| `cnt` min | 1 |
| `cnt` max | 3 |
| Sommets `chk = 1` | 42 |

Interprétation :

- `42` sommets signalent des anomalies topologiques de type gap potentiel ;
- la topologie existe, mais n’intègre pas encore une segmentation complète aux intersections métier.

## Nœuds dérivés existants

Table auditée : `geo_work.reseau_hydro_nodes_valides_20260602`

| Type de nœud | Nombre |
|---|---:|
| `isole` | 8 |
| `terminal` | 111 |
| `passage` | 601 |
| `confluence` | 25 |
| `bifurcation` | 5 |

Autres métriques :

| Indicateur | Valeur |
|---|---:|
| Composantes connectées | 48 |
| Taille composante principale en segments | 242 |
| Taille composante principale en nœuds | 243 |
| Sources amont | 73 |
| Exutoires | 53 |

## Intersections et gaps

Deux lectures complémentaires ont été confirmées :

| Contrôle | Valeur |
|---|---:|
| Intersections détectées par `pgr_analyzeGraph` | 37 |
| Paires géométriques `ST_Crosses` | 9 |
| Gaps potentiels signalés par PGR | 42 |

Interprétation :

- le réseau validé contient encore des croisements internes non segmentés ;
- la connectivité apparente reste pénalisée par des gaps de très courte distance ;
- un noding contrôlé est justifié avant toute décision de bascule.

## Conclusion

Le réseau métier validé est propre, documenté et QA-compatible, mais pas encore topologiquement consolidé.

Le noding doit viser trois objectifs :

1. segmenter les croisements internes sans écraser le lignage ;
2. réduire les gaps signalés ;
3. améliorer la connectivité sans modifier les tables runtime officielles.
