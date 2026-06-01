# Candidats inversion et segments incertains

## Méthode
Un premier échantillonnage read-only a été réalisé sur les 728 segments runtime avec le MNT `seboureproj`.

## Résultat global
| Statut candidat | Nombre |
|---|---:|
| `FLOW_CONFIRMED` | 508 |
| `FLOW_REVERSED_SUSPECTED` | 139 |
| `FLAT_SEGMENT` | 81 |
| `MNT_NO_DATA` | 0 |
| `OUTSIDE_MNT` | 0 |

## Top candidats inversion par différence d'altitude
| edge_id | source | target | longueur_m | z_start | z_end | dz | pente |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 601 | 681 | 682 | 5598.2 | 523 | 830 | -307 | -0.054839 |
| 504 | 569 | 580 | 10000.0 | 392 | 646 | -254 | -0.025400 |
| 496 | 576 | 574 | 10000.0 | 875 | 1089 | -214 | -0.021400 |
| 606 | 684 | 687 | 5657.2 | 985 | 1197 | -212 | -0.037474 |
| 417 | 476 | 479 | 7963.5 | 793 | 976 | -183 | -0.022980 |
| 494 | 573 | 570 | 10000.0 | 1252 | 1431 | -179 | -0.017900 |
| 495 | 574 | 573 | 10000.0 | 1089 | 1252 | -163 | -0.016300 |
| 497 | 577 | 576 | 10000.0 | 727 | 875 | -148 | -0.014800 |
| 491 | 529 | 569 | 10000.0 | 257 | 392 | -135 | -0.013500 |
| 490 | 528 | 554 | 4999.9 | 235 | 355 | -120 | -0.024001 |

## Lecture métier
Les 139 segments `FLOW_REVERSED_SUSPECTED` sont des candidats QA, pas des corrections à appliquer. Ils doivent être visualisés avec confluences et réseau amont/aval avant toute décision.

Les 81 segments `FLAT_SEGMENT` doivent rester en revue séparée : un MNT 30 m peut masquer une pente réelle faible.
