# Rapport de préparation du package QGIS

## Statut final
`GO_QGIS_HYDRAULIC_ARBITRATION_PACKAGE_READY`

## Sources utilisées
| Source | Statut |
|---|---|
| MNT `seboureproj` | Valide pour QA |
| `SebouReproj.ovr` | Overview uniquement, non officiel |
| `geo_work.reseau_hydro_edges_final` | Réseau runtime read-only |
| `geo.reseau_hydrographique` | Réseau source read-only |
| `_readonly_hydraulic_sample_edges.csv` | Sampling MNT read-only |

## Couches exportées
| Couche | Volume |
|---|---:|
| hydraulic_direction_validation_all | 728 |
| hydraulic_reversed_suspected | 139 |
| hydraulic_flat_segments | 81 |
| hydraulic_flow_confirmed | 508 |
| hydraulic_nodes | 740 |
| hydraulic_topology_nodes_degree | 740 |
| reseau_hydrographique_source_readonly | 697 |
| reseau_hydro_runtime_readonly | 728 |

## Fichiers créés
| Fichier | Usage |
|---|---|
| `qgis/exports/hydraulic_arbitration_package.gpkg` | GeoPackage principal |
| `qgis/project/hydraulic_arbitration_sebou.qgz` | Projet QGIS prêt à ouvrir |
| `qgis/exports/reversed_suspected_edges.csv` | 139 segments rouges |
| `qgis/exports/flat_segments.csv` | 81 segments plats |
| `qgis/exports/hydraulic_arbitration_grid.csv` | Grille décisionnelle à remplir |
| `qgis/styles/*.qml` | Styles QGIS |
| `qgis/layers/*.geojson` | Exports GeoJSON |
| `qgis/exports/00_create_hydraulic_direction_validation_A_VALIDER.sql` | DDL QA propositionnel non exécuté |

## Limites
- Le projet `.qgz` est généré automatiquement ; si QGIS ne restaure pas les chemins, utiliser le GeoPackage manuellement.
- La QA MNT ne valide pas hydrauliquement le réseau à elle seule.
- Les décisions humaines restent obligatoires pour les 220 cas à arbitrer.
- Aucune correction réseau n'est incluse dans ce package.

## Prochaine étape
Transmettre le dossier à la collaboratrice, récupérer la grille remplie, puis préparer une ingestion QA des décisions sans modifier directement le réseau.

## Mise a jour 2026-06-01 - package portable corrige

Le package initial etait ouvrable mais non suffisamment portable pour un usage poste a poste sans intervention technique.

Corrections appliquees :

- reprojection des exports vecteur dedies QGIS en `EPSG:32630` ;
- generation d'un raster portable `raster/seboureproj.tif` ;
- regeneration d'un projet QGIS en chemins relatifs ;
- exclusion verifiee de `SebouReproj.ovr`.

Nouveau point d'entree recommande :

`qgis/hydraulic_arbitration_package_portable/project/hydraulic_arbitration_sebou_portable.qgz`

Rapport de controle associe :

`qgis/hydraulic_arbitration_package_portable/00_controle_package.md`
