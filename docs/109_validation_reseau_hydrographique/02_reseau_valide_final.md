# Réseau validé final 2026-06-02

## Contexte

Le shapefile métier validé a été intégré dans une chaîne de travail additive, sans modification des tables officielles runtime.

Objets créés ou enrichis :

- `geo_work.reseau_hydro_edges_raw_backup_20260602`
- `geo_work.reseau_hydro_nodes_backup_20260602`
- `geo_work.reseau_hydro_edges_valides_20260602`
- `geo_work.reseau_hydro_edges_valides_20260602_vertices_pgr`
- `geo_work.reseau_hydro_nodes_valides_20260602`
- `geo_work.mnt_sebou_20260602`
- `geo_work.mnt_sebou_20260602_tiles_512`

## Contrôles QA recalculés

Règle métier appliquée :

- les segments dont la pente MNT est inverse ne sont plus classés comme suspects ;
- ils sont conservés en `VALIDATED_METIER__MNT_INVERSE_OVERRIDDEN`.

### Distribution des indicateurs

| Indicateur | Nombre de segments | Longueur estimée |
|---|---:|---:|
| `FLOW_CONFIRMED` | 671 | n/a |
| `FLOW_UNCERTAIN` | 31 | n/a |
| `OUTSIDE_MNT` | 0 | 0 |
| `NO_MNT` | 0 | 0 |
| `VALIDATED_METIER` | 528 | n/a |
| `VALIDATED_METIER__MNT_INVERSE_OVERRIDDEN` | 143 | 821,681.97 m |
| `LOW_SLOPE` | 31 | n/a |

### Lecture métier

- le MNT couvre bien l’ensemble du réseau validé ;
- `143` segments gardent un sens métier alors que la pente raster suggère l’inverse ;
- `31` segments restent à pente trop faible pour confirmer un sens hydraulique robuste par MNT seul.

## Topologie et nœuds

### Résultat topologique

`pgr_createTopology` a été exécuté sur `geo_work.reseau_hydro_edges_valides_20260602`, puis `pgr_analyzeGraph`.

Constats `pgr_analyzeGraph` :

- segments isolés : `4`
- dead ends : `119`
- gaps potentiels près des dead ends : `42`
- intersections détectées : `37`
- ring geometries : `0`

### Typologie des nœuds

| Type de nœud | Nombre |
|---|---:|
| `isole` | 8 |
| `terminal` | 111 |
| `passage` | 601 |
| `confluence` | 25 |
| `bifurcation` | 5 |

### Composantes connectées

| Indicateur | Valeur |
|---|---:|
| Nombre total de composantes | 48 |
| Nœuds dans la composante principale `1` | 243 |
| Segments dans la composante principale `1` | 242 |
| Longueur de la composante principale `1` | 1,273,973.34 m |

Les principales composantes restent fragmentées. Les plus grosses après la composante `1` sont :

| Component ID | Segments | Longueur (m) |
|---|---:|---:|
| 154 | 58 | 295,308.93 |
| 33 | 36 | 254,589.51 |
| 3 | 32 | 175,299.28 |
| 31 | 32 | 199,466.21 |

## Exutoires et cible garde

### Comptages réseau

| Indicateur | Valeur |
|---|---:|
| Sources amont (`ein=0`, `eout>=1`) | 73 |
| Exutoires (`eout=0`, `ein>=1`) | 53 |
| Confluences (`ein>=2`) | 25 |
| Bifurcations (`eout>=2`) | 5 |

### Cible utilisée pour les chemins vers la garde

Incohérence constatée entre code et données :

- le backend documente une cible barrage `legacy_barrage_id = 51` ;
- cette ligne est absente de `api.v_barrage_dimension` dans `abh_sad` ;
- le fallback backend sur station `legacy_station_id = 52` fonctionne ;
- la station trouvée est `brg de garde / sebou`.

Le nœud le plus proche sur le réseau validé est :

| Référence | Valeur |
|---|---|
| Type cible | `station` |
| Identifiant fallback | `52` |
| Nom cible | `brg de garde / sebou` |
| Nœud réseau le plus proche | `311` |
| Composante | `1` |
| Type de nœud | `passage` |
| Distance station -> nœud | `748.98 m` |

## Chemins vers barrage de garde

Calcul effectué sur le graphe orienté `source -> target` de `geo_work.reseau_hydro_edges_valides_20260602`.

| Indicateur | Valeur |
|---|---:|
| Nœuds pouvant rejoindre la garde | 227 |
| Sources amont pouvant rejoindre la garde | 17 |
| Exutoires pouvant rejoindre la garde | 0 |
| Source amont la plus éloignée atteignant la garde | nœud `434` |
| Distance dirigée max vers la garde | `572.091 km` |

## Recommandation pour remplacement définitif

### Ce qui est prêt

- le réseau validé est importé ;
- les backups historiques sont en place ;
- un contrôle QA métier/MNT existe ;
- une topologie exploitable existe sur la version datée ;
- le réseau validé est testable sans toucher aux tables officielles.

### Ce qui bloque encore un remplacement runtime direct

1. `37` intersections restent détectées dans `pgr_analyzeGraph`.
2. `42` gaps potentiels subsistent.
3. La cible barrage officielle `legacy_barrage_id = 51` n’existe pas dans la vue métier, ce qui force un fallback station.
4. Le réseau validé reste fragmenté en `48` composantes.

### Recommandation de bascule

Ne pas remplacer immédiatement :

- `geo_work.reseau_hydro_edges_final`
- `geo_work.reseau_hydro_edges_final_vertices_pgr`

Étapes recommandées avant bascule :

1. produire une version nœudée dérivée du réseau validé pour traiter les `37` intersections ;
2. recalculer la topologie finale et les métriques de connectivité sur cette version nœudée ;
3. décider métier si la cible officielle doit devenir le barrage réel ou rester la station `52` ;
4. seulement après validation, préparer un script transactionnel de swap des tables officielles avec rollback possible.

## Conclusion

Le réseau métier validé est maintenant intégré en table datée et contrôlé sans casser l’existant.

Il est suffisamment propre pour une phase de revue métier et de tests ciblés, mais pas encore suffisamment stabilisé pour remplacer directement le runtime officiel sans une étape supplémentaire de noding et de consolidation de la cible garde.
