# 31 Matrix V2 - Audit connectivite reseau vers Garde

## 1. Statut

```text
NETWORK_CONNECTIVITY_AUDITED
READ_ONLY_AUDIT
```

## 2. Reseau runtime confirme

Le moteur de propagation et `TravelTime V1` consomment :

```text
geo_work.reseau_hydro_edges_final_candidate_20260602
geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr
```

| Indicateur | Valeur |
|---|---:|
| Edges | 746 |
| Noeuds vertices | 752 |
| SRID | 26191 |
| Geometrie | LINESTRING |
| Composantes faibles runtime | 7 |
| Cible finale | amont barrage de garde (3738/8) |
| Noeud cible | 98 |

Index detectes :

- `idx_reseau_hydro_edges_final_candidate_20260602_geom`
- `idx_reseau_hydro_edges_final_candidate_20260602_source_row`
- `reseau_hydro_edges_final_candidate_20260602_pkey`
- `reseau_hydro_edges_final_candidate_20260602_source_idx`
- `reseau_hydro_edges_final_candidate_20260602_target_idx`

## 3. Resultat edge par edge

| Classe | Edges |
|---|---:|
| REACHES_GARDE | 195 |
| WRONG_DIRECTION_CANDIDATE | 347 |
| Composante sans chemin meme non dirige | 204 |

Le fichier detaille est `31A_network_connectivity_to_garde.csv`.

Un edge est classe `WRONG_DIRECTION_CANDIDATE` seulement si son noeud aval
peut joindre Garde dans le graphe non dirige mais pas dans le graphe dirige.
Cette classe est une hypothese d'audit, pas une instruction d'inversion.

## 4. Anomalies geometriques

| Anomalie | Nombre |
|---|---:|
| Geometries invalides | 0 |
| Croisements sans noeud candidat | 0 |
| Extremites proches de l'interieur d'un troncon | 109 |
| Doublons geometriques exacts | 0 |
| Paires d'extremites inter-composantes <= 50 m | 0 |

Les candidats sont disponibles dans `31A_component_gap_candidates.csv` et
`31A_topology_anomalies.geojson`. Une proximite geometrique ne justifie jamais
a elle seule une correction de topologie : elle doit etre confirmee par le sens
d'ecoulement et l'expertise hydrologique.

## 5. Tests de points

8/8 points de reference atteignent Garde dans le moteur actuel.
Les cinq sources WASP et les references P29/Garde sont auditees dans
`31A_user_point_routing_tests.csv`.

Les captures utilisateur sans coordonnees explicites ne peuvent pas etre
rejouees de facon fiable. Elles doivent etre ajoutees au fichier de tests avec
leurs longitude/latitude ou leurs `edge_id` de snap, avant de conclure sur leur
affluent respectif.

## 6. Composantes separees

Le detail spatial des composantes est consigne dans
`31A_network_components.csv`. Aucune composante n'est automatiquement qualifiee
`EXPECTED_ISOLATED_NORTHWEST` : le referentiel numerique ne fournit pas encore
la geometrie ou la liste d'edges de cette exception metier. Cette designation
doit etre confirmee par les hydrologues avant toute correction.

## 7. Decision barrage Matrix V2

`DECISION_MATRIX_V2_BARRAGE_003` remplace l'ancienne regle bloquante : les
barrages intermediaires sont collectes et affiches comme des retenues pouvant
modifier dilution, melange, stockage et temps. Ils ne bloquent plus
l'evaluation Matrix V2. La future applicabilite devra renvoyer
`APPLICABLE_WITH_RESERVES` et abaisser la confiance des sorties aval d'une
retenue, sans calculer une dilution arbitraire.

## 8. Divergence de cible Garde a corriger dans le workflow

Le present audit cible explicitement `3738/8` / Amont Barrage de Garde
(`legacy_station_id = 94`), conformement a Matrix V2 et Travel Time V1.
Le workflow Declaration actuel appelle encore `propagate_source_to_garde`, qui
utilise la constante historique `TARGET_STATION_LEGACY_ID = 52`. Les deux
cibles ne sont pas interchangeables : les distances obtenues pour les sources
WASP different. Cette divergence doit etre corrigee dans l'adaptateur de
Declaration Pollution apres validation de l'audit, sans modifier le reseau.

## 9. Correction proposee, non appliquee

1. Faire valider les `WRONG_DIRECTION_CANDIDATE`, les croisements et les gaps
   avec le referentiel hydrographique metier.
2. Identifier formellement la composante nord-ouest annoncee comme isolement
   legitime. Elle n'est pas etiquetee automatiquement par cet audit.
3. Creer une nouvelle table candidate versionnee seulement pour les corrections
   prouvees, reconstruire `source/target` et les vertices, puis comparer le
   bilan vers Garde avant/apres.
4. Rejouer les points Matrix V2, P29 et Garde avant toute selection spatiale de
   matrice dans le workflow officiel.
