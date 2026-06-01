# Règles QA direction hydraulique

## Statuts officiels
| Statut | Règle | Usage |
|---|---|---|
| `FLOW_CONFIRMED` | `z_start > z_end` au-delà de la tolérance | Direction runtime compatible avec le MNT |
| `FLOW_REVERSED_SUSPECTED` | `z_start < z_end` au-delà de la tolérance | Candidat inversion, revue obligatoire |
| `FLAT_SEGMENT` | `abs(z_start - z_end) <= z_tolerance_m` | Segment plat ou incertain |
| `LOW_SLOPE_UNCERTAIN` | pente faible sous seuil configurable | A traiter avec prudence |
| `MNT_NO_DATA` | start ou end tombe en NoData | QA impossible sur le MNT |
| `OUTSIDE_MNT` | start ou end hors emprise | MNT non couvrant |
| `TOPOLOGY_ONLY` | pas de MNT disponible | Routage topologique seulement |
| `NEED_MANUAL_REVIEW` | conflit non résolu | Arbitrage humain requis |

## Tolérances proposées
| Paramètre | Valeur P0 | Commentaire |
|---|---:|---|
| `z_tolerance_m` | 1.0 m | Evite de surinterpréter le bruit vertical du MNT |
| `low_slope_threshold` | 0.0001 | A ajuster selon validation métier/scientifique |

## Règles critiques
- Un statut suspect n'est pas une preuve d'erreur : il déclenche une revue.
- Les confluences, zones plates, canaux et ouvrages peuvent produire des signaux altimétriques difficiles.
- Le MNT 30 m ne doit pas être utilisé pour corriger automatiquement une géométrie hydrographique plus fine.
