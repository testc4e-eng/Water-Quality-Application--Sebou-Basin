# Objectif de la validation hydraulique

## But
Vérifier si le sens d'écoulement du réseau hydrographique runtime suit la pente du MNT validé.

Le contrôle compare, pour chaque segment :
- l'altitude au début du segment (`z_start`) ;
- l'altitude à la fin du segment (`z_end`) ;
- la différence `dz = z_start - z_end` ;
- le sens runtime `source -> target`.

## Données utilisées
| Élément | Source |
|---|---|
| MNT officiel | `C:\dev\WQDSS\data\MNT SEBOU 30N 30M\seboureproj` |
| Réseau runtime | `geo_work.reseau_hydro_edges_final` |
| Réseau source | `geo.reseau_hydrographique` |
| QA calculée | exports du package QGIS |

## Interprétation simple
- Si `z_start > z_end`, le segment descend dans le sens runtime : flux probablement confirmé.
- Si `z_start < z_end`, le segment monte dans le sens runtime : inversion suspectée.
- Si `z_start` et `z_end` sont presque égaux, le segment est plat ou incertain.

## Ce que la revue doit produire
La collaboratrice doit renseigner la grille d'arbitrage pour les segments rouges et orange, sans modifier les géométries ni les identifiants.
