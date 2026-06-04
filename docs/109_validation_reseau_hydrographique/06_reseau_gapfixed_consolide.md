# Réseau gapfixed consolidé 2026-06-02

## 1. Gaps reconnectés

Une version additive a été créée :

- `geo_work.reseau_hydro_edges_gapfixed_20260602`
- `geo_work.reseau_hydro_edges_gapfixed_20260602_vertices_pgr`
- `geo_work.reseau_hydro_nodes_gapfixed_20260602`
- `geo_work.reseau_hydro_gaps_gapfixed_20260602`

Les gaps reconnectés sont les `4` gaps explicitement autorisés :

| gap_id | micro-segment créé | longueur (m) | composantes concernées |
|---|---:|---:|---|
| 1 | `gid=742` | 0.0259 | `1 <-> 747` |
| 2 | `gid=743` | 0.0325 | `30 <-> 241` |
| 3 | `gid=744` | 0.0597 | `1 <-> 241` |
| 4 | `gid=745` | 0.0846 | `32 <-> 576` |

Attributs appliqués aux micro-segments :

- `source_row = NULL`
- `lineage_quality = GAPFIXED`
- `qa_status = GAP_RECONNECTE`
- `flow_status = VALIDATED_METIER`
- `qa_comment = Micro-segment de reconnexion cree pour gap_id=<id>`

## 2. Gap laissé en revue manuelle

Le gap non corrigé reste :

| gap_id | node_a | node_b | component_a | component_b | distance_m | recommandation |
|---|---:|---:|---:|---:|---:|---|
| 1 dans `geo_work.reseau_hydro_gaps_gapfixed_20260602` | 225 | 495 | 3 | 3 | 0.10 | revue_manuelle |

Attention :

- ce gap résiduel n’est plus le même identifiant logique que le `gap_id=5` de la table nœudée ;
- il correspond à l’unique gap candidat restant après reconnexion des `4` cas autorisés ;
- il doit rester en expertise métier ou cartographique.

## 3. Comparaison noded vs gapfixed

| Indicateur | Noded | Gapfixed | Écart |
|---|---:|---:|---:|
| Segments | 741 | 745 | +4 |
| Longueur totale (m) | 3,994,885.94 | 3,994,886.14 | +0.20 |
| Composantes | 11 | 7 | -4 |
| Taille composante principale en segments | 474 | 542 | +68 |
| Intersections PGR | 0 | 0 | 0 |
| `ST_Crosses` | 0 | 0 | 0 |
| Sommets `chk=1` | 8 | 8 | 0 |
| Gaps candidats `< 50 m` | 5 | 1 | -4 |

## 4. Impact sur la connectivité

### Nœuds

| Type de nœud | Noded | Gapfixed |
|---|---:|---:|
| `isole` | 4 | 2 |
| `terminal` | 81 | 75 |
| `passage` | 600 | 604 |
| `confluence` | 58 | 59 |
| `bifurcation` | 9 | 12 |

### Indicateurs réseau

| Indicateur | Noded | Gapfixed |
|---|---:|---:|
| Sources amont | 72 | 69 |
| Exutoires | 20 | 19 |
| Dead ends | 85 | 77 |
| Nœuds isolés | 4 | 2 |

Lecture :

- les `4` reconnexions autorisées réduisent bien la fragmentation ;
- la baisse des composantes `11 -> 7` est cohérente avec les gaps inter-composantes traités ;
- les dead ends et nœuds isolés continuent à diminuer ;
- la topologie reste propre, sans réintroduire d’intersections.

## 5. Impact sur les chemins vers la garde

Cible fonctionnelle inchangée :

- `legacy_station_id = 52`
- `brg de garde / sebou`

### Résultat noded vs gapfixed

| Indicateur | Noded | Gapfixed |
|---|---:|---:|
| Nœud cible le plus proche | 204 | 376 |
| Distance cible -> nœud (m) | 748.98 | 748.98 |
| Composante cible | 1 | 8 |
| Nœuds pouvant rejoindre la garde | 193 | 193 |
| Sources amont pouvant rejoindre la garde | 15 | 15 |
| Distance dirigée max vers la garde (km) | 572.091 | 572.091 |

Lecture :

- la renumérotation topologique change l’identifiant du nœud cible et de la composante, mais pas sa position spatiale ;
- les chemins dirigés utiles vers la garde restent stables ;
- les `4` reconnexions améliorent surtout la cohérence structurelle globale, sans changer le périmètre routable vers la garde dans le graphe orienté actuel.

## 6. Recommandation finale

### Statut

`revue métier complémentaire`

### Justification

Points positifs :

- `4` gaps inter-composantes ont été reconnectés proprement ;
- il ne reste qu’`1` gap candidat ;
- la topologie reste à `0` intersection ;
- la fragmentation diminue encore : `11 -> 7` composantes.

Point bloquant restant :

- l’unique gap résiduel `revue_manuelle` doit être arbitré avant toute bascule runtime officielle.

### Décision de bascule

Ne pas basculer encore les tables runtime officielles.

La version `gapfixed` est la meilleure candidate technique à date, mais la bascule ne devrait être envisagée qu’après :

1. validation métier du gap résiduel ;
2. éventuelle version additive finale `gapfixed_reviewed` ;
3. revalidation courte des chemins vers la garde et des composantes.
