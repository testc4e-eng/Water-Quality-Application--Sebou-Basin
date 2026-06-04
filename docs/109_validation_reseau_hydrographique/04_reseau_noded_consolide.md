# Réseau nœudé consolidé 2026-06-02

## 1. Méthode de noding

Une version dérivée additive a été créée sans modification des tables officielles :

- `geo_work.reseau_hydro_edges_noded_20260602`
- `geo_work.reseau_hydro_edges_noded_20260602_vertices_pgr`
- `geo_work.reseau_hydro_nodes_noded_20260602`
- `geo_work.reseau_hydro_gaps_noded_20260602`

Méthode appliquée :

1. validation géométrique défensive avec `ST_MakeValid` ;
2. homogénéisation en `LINESTRING` ;
3. union topologique et noding global via `ST_UnaryUnion` + `ST_Node` ;
4. explosion en segments élémentaires ;
5. rattachement du meilleur lignage métier par recouvrement géométrique ;
6. recalcul de `length_m`, `start_geom`, `end_geom` ;
7. création de topologie PGR sur la table nœudée.

Qualité du lignage conservé :

| Qualité | Nombre |
|---|---:|
| `STRONG` | 720 |
| `GOOD` | 12 |
| `WEAK` | 9 |

Lecture :

- la conservation du lignage reste très bonne ;
- seuls `9` segments nœudés demandent une revue plus prudente.

## 2. Comparaison avant / après

| Indicateur | Validé initial | Version nœudée | Écart |
|---|---:|---:|---:|
| Segments | 702 | 741 | +39 |
| Longueur totale (m) | 3,994,885.94 | 3,994,885.94 | 0 |
| Composantes | 48 | 11 | -37 |
| Taille composante principale en segments | 242 | 474 | +232 |
| Taille composante principale en nœuds | 243 | 475 | +232 |

## 3. Impact sur les intersections

| Contrôle | Validé initial | Version nœudée |
|---|---:|---:|
| Intersections `pgr_analyzeGraph` | 37 | 0 |
| Paires géométriques `ST_Crosses` | 9 | 0 |

Effet observé :

- les croisements internes ont été correctement segmentés ;
- la version nœudée est cohérente avec un graphe topologique propre.

## 4. Impact sur les gaps

| Contrôle | Validé initial | Version nœudée |
|---|---:|---:|
| Sommets `chk = 1` | 42 | 8 |
| Gaps candidats `< 50 m` matérialisés | n/a | 5 |

Table de diagnostic créée :

- `geo_work.reseau_hydro_gaps_noded_20260602`

Distribution des recommandations :

| Recommandation | Nombre |
|---|---:|
| `reconnecter` | 4 |
| `revue_manuelle` | 1 |

Les `5` gaps candidats sont tous très courts :

| Gap ID | Nœud A | Nœud B | Composante A | Composante B | Distance (m) | Recommandation |
|---|---:|---:|---:|---:|---:|---|
| 1 | 734 | 747 | 1 | 747 | 0.03 | reconnecter |
| 2 | 240 | 241 | 30 | 241 | 0.03 | reconnecter |
| 3 | 230 | 242 | 1 | 241 | 0.06 | reconnecter |
| 4 | 562 | 576 | 32 | 576 | 0.08 | reconnecter |
| 5 | 646 | 647 | 32 | 32 | 0.10 | revue_manuelle |

Lecture :

- le noding a résolu la majorité des gaps signalés ;
- il reste un petit nombre de discontinuités quasi nulles, candidates à une reconnexion contrôlée ;
- aucune reconnexion n’a été appliquée automatiquement.

## 5. Impact sur la connectivité

### Nœuds

| Type de nœud | Validé initial | Version nœudée |
|---|---:|---:|
| `isole` | 8 | 4 |
| `terminal` | 111 | 81 |
| `passage` | 601 | 600 |
| `confluence` | 25 | 58 |
| `bifurcation` | 5 | 9 |

### Indicateurs réseau

| Indicateur | Validé initial | Version nœudée |
|---|---:|---:|
| Sources amont | 73 | 72 |
| Exutoires | 53 | 20 |
| Dead ends degré 1 | 119 | 85 |
| Segments isolés PGR | 4 | 2 |

Lecture :

- la connectivité s’améliore fortement ;
- le réseau nœudé révèle plus de vraies confluences et bifurcations ;
- la chute des exutoires et dead ends montre que le découpage aux intersections était bien un problème majeur.

## 6. Impact sur les chemins vers la garde

Cible fonctionnelle utilisée, identique au backend actuel :

- `legacy_station_id = 52`
- nom : `brg de garde / sebou`

### Résultat avant / après

| Indicateur | Validé initial | Version nœudée |
|---|---:|---:|
| Nœud cible le plus proche | 311 | 204 |
| Distance cible -> nœud (m) | 748.98 | 748.98 |
| Composante cible | 1 | 1 |
| Nœuds pouvant rejoindre la garde | 227 | 193 |
| Sources amont pouvant rejoindre la garde | 17 | 15 |
| Distance dirigée max vers la garde (km) | 572.091 | 572.091 |

Lecture :

- la cible reste dans la composante principale ;
- la distance station -> nœud ne change pas ;
- la baisse des nœuds atteignant la garde reflète une orientation plus explicite du graphe nœudé, pas une dégradation géométrique ;
- les longueurs dirigées maximales restent cohérentes avec le réseau précédent.

## 7. Décision recommandée

### Statut

`encore revue manuelle`

### Justification

Points positifs :

- intersections résiduelles : `0`
- composantes : `48 -> 11`
- gaps PGR : `42 -> 8`
- réseau plus cohérent pour l’analyse topologique

Points bloquants avant bascule runtime :

1. `4` gaps restent de vrais candidats à reconnexion ;
2. `1` gap exige une revue manuelle dans une même composante ;
3. la cible métier barrage officielle reste incohérente avec le référentiel, le backend utilisant toujours le fallback station `52` ;
4. le graphe orienté mérite une validation métier supplémentaire avant remplacement de `geo_work.reseau_hydro_edges_final`.

### Recommandation opérationnelle

Ne pas basculer immédiatement les tables officielles runtime.

Séquence recommandée :

1. revue des `5` gaps candidats ;
2. si validé métier, produire une version `noded_gapfixed` additive ;
3. recalculer PGR et les chemins vers la garde ;
4. seulement ensuite évaluer une bascule contrôlée.
