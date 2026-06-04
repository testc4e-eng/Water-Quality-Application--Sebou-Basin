# Clôture validation hydrologique

## Contexte

Le chantier de validation hydrologique du réseau hydrographique SAD Sebou a été mené intégralement sur des tables datées et additives, sans modification des tables runtime officielles.

Version finale candidate produite :

- `geo_work.reseau_hydro_edges_final_candidate_20260602`
- `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr`
- `geo_work.reseau_hydro_nodes_final_candidate_20260602`

Décision métier finale appliquée :

- `RECONNECTER` le dernier gap résiduel
- `node_a = 225`
- `node_b = 495`
- distance `0.1046 m`
- continuité métier confirmée dans QGIS

## Historique des corrections

1. import du réseau métier validé : `geo_work.reseau_hydro_edges_valides_20260602`
2. recalcul QA MNT et nœuds dérivés
3. noding global : `geo_work.reseau_hydro_edges_noded_20260602`
4. correction additive des `4` gaps inter-composantes : `geo_work.reseau_hydro_edges_gapfixed_20260602`
5. arbitrage QGIS du dernier gap résiduel
6. reconnexion finale additive et production de `geo_work.reseau_hydro_edges_final_candidate_20260602`

## Arbitrages métier réalisés

Arbitrages explicitement validés :

- `4` micro-gaps inter-composantes reconnectés dans la version `gapfixed`
- `1` micro-gap résiduel, analysé dans QGIS, validé `RECONNECTER`

Le micro-segment final ajouté est :

| Attribut | Valeur |
|---|---|
| `gid` | `746` |
| `lineage_quality` | `GAPFIXED_REVIEWED` |
| `qa_status` | `GAP_RECONNECTE_APRES_ARBITRAGE` |
| `flow_status` | `VALIDATED_METIER` |
| longueur | `0.1046 m` |

## Validation du sens d'écoulement

Le sens d’écoulement reste validé selon le contrat métier déjà établi :

- les inversions MNT explicitement contredites par le métier sont conservées comme validées ;
- la version finale candidate ne modifie pas les règles QA, elle stabilise uniquement la continuité topologique ;
- la cible fonctionnelle de routage reste la station `legacy_station_id = 52`, nom `brg de garde / sebou`.

## Validation topologique

Résultat final :

| Contrôle | Valeur |
|---|---:|
| Segments | 746 |
| Longueur totale (m) | 3,994,886.25 |
| Composantes | 7 |
| Composante principale en segments | 542 |
| Composante principale en nœuds | 543 |
| Intersections `pgr_analyzeGraph` | 0 |
| `ST_Crosses` | 0 |
| Gaps candidats `< 50 m` | 0 |
| Sommets `chk=1` | 6 |
| Segments isolés PGR | 1 |

Lecture :

- il ne reste plus aucun gap candidat géométriquement reconnectable à moins de `50 m` ;
- les `6` flags `chk=1` résiduels de `pgr_analyzeGraph` ne correspondent plus à des gaps réels bloquants ;
- aucune intersection topologique bloquante n’est ouverte.

## Validation du routage

Comparaison `gapfixed` vs `final_candidate` :

| Indicateur | Gapfixed | Final candidate |
|---|---:|---:|
| Nœud cible le plus proche | 376 | 464 |
| Composante cible | 8 | 5 |
| Distance cible -> nœud (m) | 748.98 | 748.98 |
| Nœuds pouvant rejoindre la garde | 193 | 193 |
| Sources amont rejoignant la garde | 15 | 15 |
| Distance dirigée max vers la garde (km) | 572.091 | 572.091 |

Lecture :

- la reconnexion finale ne dégrade pas le comportement de routage ;
- la cible garde reste spatialement stable ;
- le périmètre utile de routage aval vers la garde reste inchangé.

## Métriques finales

| Indicateur | Valeur |
|---|---:|
| Segments | 746 |
| Longueur totale (m) | 3,994,886.25 |
| Composantes | 7 |
| Nœuds isolés | 2 |
| Terminaux | 73 |
| Confluences | 61 |
| Bifurcations | 13 |
| Exutoires | 19 |
| Sources amont | 68 |
| Dead ends | 75 |
| Gaps candidats `< 50 m` | 0 |
| Intersections `ST_Crosses` | 0 |

## Limites connues

- `pgr_analyzeGraph` signale encore `6` flags `chk=1`, mais sans gap candidat réel `< 50 m` ;
- `1` segment isolé PGR subsiste dans une petite composante secondaire ;
- la cible barrage officielle applicative reste le fallback station `52`, ce qui est acceptable au runtime actuel mais doit rester documenté pour la phase propagation pollution.

## Décision finale

`STATUT = VALIDE`

Le réseau hydrographique final candidate est validé pour :

- le moteur de routage topologique runtime ;
- les futurs calculs de propagation aval ;
- la préparation des modules pollution, SWAT et WASP.

Conclusion :

Le réseau hydrographique est validé pour utilisation dans le moteur de routage et les futurs modules de propagation pollution.
