# GO/NOGO validation hydraulique

## Décision
`GO_HYDRAULIC_VALIDATION_EXECUTION`

## Justification
Le MNT principal a été retrouvé, lu par GDAL et couvre le réseau runtime. Les métadonnées raster sont suffisantes pour lancer la QA altimétrique contrôlée.

## Statut scientifique actuel
| Élément | Statut | Commentaire |
|---|---|---|
| MNT principal | OK | `seboureproj`, Arc/Info Binary Grid |
| `.ovr` isolé | NOK comme source officielle | Overview seulement |
| CRS | OK avec précaution | UTM zone 30N, à verrouiller comme EPSG/WKT |
| Réseau runtime | OK topologique | 728 edges, 0 invalides |
| Couverture MNT | OK | 728/728 segments intersectent l'emprise |
| Direction hydraulique | NON VALIDEE | 139 suspects + 81 plats à arbitrer |

## Conditions avant PREPROD hydraulique
- Créer et alimenter la QA hydraulique en DEV.
- Produire une couche de revue cartographique des statuts.
- Ne pas inverser automatiquement les segments suspects.
- Conserver le flag runtime `hydraulic_direction_validated=false` tant que les arbitrages ne sont pas validés.

## Statut global recommandé
`HYDRAULIC_VALIDATION_IN_PROGRESS__MNT_VALID__FLOW_QA_PENDING`
