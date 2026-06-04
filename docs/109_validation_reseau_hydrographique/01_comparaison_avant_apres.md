# Validation réseau hydrographique 2026-06-02

## Contexte

Objectif : intégrer le shapefile métier validé `C:\dev\WQDSS\data\Qualité & pollution shp\reseau_modifier.shp` sans modifier les tables officielles runtime.

Tables officielles explicitement non modifiées :

- `geo_work.reseau_hydro_edges_raw`
- `geo_work.reseau_hydro_nodes`
- `geo_work.reseau_hydro_edges_final`
- `geo_work.reseau_hydro_edges_final_vertices_pgr`

Tables de travail créées :

- `geo_work.reseau_hydro_edges_raw_backup_20260602`
- `geo_work.reseau_hydro_nodes_backup_20260602`
- `geo_work.reseau_hydro_edges_valides_20260602`

## Méthodologie de comparaison

Le shapefile validé contient `702` segments en `EPSG:26191`, avec un champ de lignage `source_row`.

La comparaison ancien vs validé a été faite selon deux niveaux :

1. comparaison volumétrique globale : nombre de segments et longueur totale ;
2. comparaison par lignage : jointure `geo_work.reseau_hydro_edges_raw.source_gid = geo_work.reseau_hydro_edges_valides_20260602.source_row::int`.

Le statut `segment modifié` a été retenu quand la distance de Hausdorff est `> 1 m` sur les segments ayant un lignage commun.

## Résultat synthétique

| Indicateur | Ancien réseau | Réseau validé | Écart |
|---|---:|---:|---:|
| Nombre de segments | 697 | 702 | +5 |
| Longueur totale (m) | 3,994,483.33 | 3,994,885.94 | +402.61 |
| Longueur moyenne (m) | 5,730.97 | 5,690.72 | -40.25 |

## Segments ajoutés / supprimés / modifiés

| Catégorie | Valeur | Observation |
|---|---:|---|
| Segments ajoutés | 5 | `source_row` nouveaux : `698, 699, 700, 701, 702` |
| Segments supprimés | 0 | aucun `source_gid` historique manquant dans le réseau validé |
| Segments modifiés | 680 | segments avec lignage commun et Hausdorff `> 1 m` |
| Segments quasi inchangés | 17 | Hausdorff `<= 1 m` |

## Observations détaillées

- Les `697` segments historiques sont retrouvés par lignage dans le réseau validé.
- Le réseau validé n’est pas un simple renommage : la géométrie a été profondément reprise.
- La distance de Hausdorff moyenne sur les segments appariés est de `56,110.47 m`.
- La distance de Hausdorff maximale observée sur un segment apparié est de `186,978.27 m`.
- Les `5` nouveaux segments sont purement additifs et ne remplacent aucun identifiant source existant.

## Conclusion

Le shapefile `reseau_modifier.shp` constitue bien un réseau métier remanié, pas une copie cosmetique du réseau brut.

Conséquence :

- l’intégration doit rester datée et isolée ;
- le remplacement définitif des tables officielles ne doit pas se faire par simple `INSERT/UPDATE` ligne à ligne ;
- une reconstruction topologique dédiée est nécessaire sur la version validée avant tout basculement runtime.
