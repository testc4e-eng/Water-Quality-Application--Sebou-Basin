# Controle du package QGIS portable

## Statut final

`GO_PACKAGE_QGIS_PORTABLE_READY`

## Contexte

Audit et reconditionnement du package QGIS hydraulique pour usage portable poste a poste, sans dependance a un chemin local `C:\dev\WQDSS\...` et sans reference au fichier `SebouReproj.ovr`.

## Audit du package d'origine

### Fichiers verifies

- projet source : `qgis/project/hydraulic_arbitration_sebou.qgz`
- projet source XML : `qgis/project/hydraulic_arbitration_sebou.qgs`
- geopackage source : `qgis/exports/hydraulic_arbitration_package.gpkg`
- styles : `qgis/styles/*.qml`
- grille CSV : `qgis/exports/hydraulic_arbitration_grid.csv`
- MNT officiel : `C:\dev\WQDSS\data\MNT SEBOU 30N 30M\seboureproj`
- overview a exclure : `C:\dev\WQDSS\data\MNT SEBOU 30N 30M\SebouReproj.ovr`

### Constats principaux

1. Le GeoPackage source existe bien.
2. Le projet source reference les couches vecteur en chemins relatifs.
3. Le projet source reference le raster en chemin absolu, donc non portable.
4. Le projet source ne reference pas `SebouReproj.ovr`.
5. Le GeoPackage source declare ses couches en `EPSG:4326`.
6. Les coordonnees stockees dans le GeoPackage source sont en metres et correspondent en realite a `EPSG:26191`.
7. Les exports GeoJSON du package source confirment explicitement `EPSG:26191`.
8. Ce decalage de SCR explique l'ouverture vide ou avec couches non visibles dans QGIS.

## Couches trouvees dans le GeoPackage

| Couche | Entites | Geometrie | SCR corrige | Emprise xmin | Emprise ymin | Emprise xmax | Emprise ymax |
|---|---:|---|---|---:|---:|---:|---:|
| `hydraulic_direction_validation_all` | 728 | LineString | EPSG:32630 | 164201.3518 | 3672075.0815 | 412494.5217 | 3879792.4014 |
| `hydraulic_reversed_suspected` | 139 | LineString | EPSG:32630 | 164201.3518 | 3690723.8593 | 407716.7329 | 3871521.8057 |
| `hydraulic_flat_segments` | 81 | LineString | EPSG:32630 | 169521.8314 | 3699580.7574 | 360073.6953 | 3863014.1589 |
| `hydraulic_flow_confirmed` | 508 | LineString | EPSG:32630 | 172278.1601 | 3672075.0815 | 412494.5217 | 3879792.4014 |
| `hydraulic_nodes` | 740 | Point | EPSG:32630 | 164201.3518 | 3672075.0815 | 412346.8988 | 3879792.4014 |
| `hydraulic_topology_nodes_degree` | 740 | Point | EPSG:32630 | 164201.3518 | 3672075.0815 | 412346.8988 | 3879792.4014 |
| `reseau_hydrographique_source_readonly` | 697 | MultiLineString | EPSG:32630 | 164201.3518 | 3672075.0815 | 412494.5217 | 3879792.4014 |
| `reseau_hydro_runtime_readonly` | 728 | LineString | EPSG:32630 | 164201.3518 | 3672075.0815 | 412494.5217 | 3879792.4014 |

## Statut MNT

### MNT officiel retenu

- source : `seboureproj`
- format source : Arc/Info Binary Grid
- export portable cree : `raster/seboureproj.tif`
- SCR reel : `EPSG:32630`
- emprise : xmin `146279.0784`, ymin `3652337.7510`, xmax `429154.6500`, ymax `3896012.1012`
- taille : `10290 x 8864`
- nodata : `-32768`

### Overview exclue

- `SebouReproj.ovr` detecte et accessible
- statut : non utilise comme raster officiel
- verification projet portable : aucune reference `.ovr`

## Problemes corriges

1. Reetiquetage implicite du SCR source des vecteurs : `EPSG:26191` au lieu de `EPSG:4326`.
2. Reprojection de toutes les couches vecteur en `EPSG:32630` pour alignement avec le MNT.
3. Creation d'un GeoPackage corrige dedie QGIS portable.
4. Conversion du MNT source en GeoTIFF portable : `raster/seboureproj.tif`.
5. Suppression de toute dependance a un chemin absolu pour les couches du projet.
6. Suppression de toute reference a `.ovr` dans le projet portable.
7. Creation d'un projet QGIS propre avec ordre de couches et styles charges.
8. Definition d'une vue par defaut centree sur l'emprise des segments a arbitrer.

## Problemes restants

- le CSV est une table non spatiale ; il sert a la saisie des decisions, pas a l'affichage cartographique ;
- les styles du reseau source/runtime sont enregistres dans le projet mais ne disposent pas de fichiers `.qml` separes dans le package ;
- le package ne modifie volontairement ni le reseau hydraulique, ni les geometries, ni les `edge_id`.

## Procedure de test realisee

1. Audit du projet source `.qgs/.qgz`.
2. Verification du GeoPackage source avec `ogrinfo` et `sqlite3`.
3. Verification du MNT source avec `gdalinfo`.
4. Verification de la presence du fichier `SebouReproj.ovr`.
5. Reprojection de toutes les couches vecteur avec `ogr2ogr` vers `EPSG:32630`.
6. Conversion du MNT source en `GeoTIFF` avec `gdal_translate`.
7. Generation du projet portable avec `PyQGIS`.
8. Relecture automatique du projet portable avec `PyQGIS` :
   - `project_read = True`
   - `layer_count = 10`
   - toutes les couches chargees valides
   - raster valide en `EPSG:32630`
   - vecteurs valides en `EPSG:32630`
9. Controle du `.qgz` genere :
   - chemins des couches relatifs
   - aucune reference `C:\dev\WQDSS`
   - aucune reference `.ovr`

## Package portable genere

`qgis/hydraulic_arbitration_package_portable/`

## Fichiers principaux du package portable

- `exports/hydraulic_arbitration_package.gpkg`
- `exports/hydraulic_arbitration_grid.csv`
- `raster/seboureproj.tif`
- `styles/hydraulic_direction_validation.qml`
- `styles/hydraulic_flat_segments.qml`
- `styles/hydraulic_flow_confirmed.qml`
- `styles/hydraulic_nodes.qml`
- `styles/hydraulic_reversed_suspected.qml`
- `styles/mnt_hillshade.qml`
- `project/hydraulic_arbitration_sebou_portable.qgz`
- `README_OUVERTURE_QGIS.md`
- `00_controle_package.md`
