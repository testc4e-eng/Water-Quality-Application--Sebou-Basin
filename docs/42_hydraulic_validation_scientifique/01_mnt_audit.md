# Audit MNT

## Source contrôlée
| Élément | Valeur |
|---|---|
| Dossier | `C:\dev\WQDSS\data\MNT SEBOU 30N 30M\` |
| Fichier fourni | `SebouReproj.ovr` |
| Raster principal détecté | `seboureproj` |
| Format raster principal | Arc/Info Binary Grid (`AIG`) |
| Fichier données principal | `seboureproj\w001001.adf` |
| Statut MNT | `MNT_VALID` |

## Conclusion sur le `.ovr`
`SebouReproj.ovr` est lisible comme GeoTIFF d'overview, mais son géoréférencement propre est insuffisant pour servir de MNT de référence : coordonnées pixel 0..5145 / 0..4432, sans CRS opérationnel dans le fichier `.ovr` isolé.

La validation doit donc utiliser le raster parent `seboureproj`, pas le `.ovr` seul.

## Métadonnées du raster principal
| Propriété | Valeur |
|---|---|
| Taille | 10290 x 8864 pixels |
| CRS lu | UTM zone 30N basé WGS84, unité mètre |
| EPSG opérationnel proposé | `EPSG:32630` à confirmer dans la chaîne GDAL/PostGIS |
| Origine | X=146279.0784, Y=3896012.1012 |
| Résolution | 27.490337342058 m |
| Emprise X | 146279.0784 à 429154.650 |
| Emprise Y | 3652337.751 à 3896012.1012 |
| NoData | -32768 |
| Type | Int16 |
| Altitude min/max | -22 m / 3051 m |
| Moyenne / écart-type | 678.622 m / 581.792 m |
| Pourcentage valide | 59.43 % |

## Interprétation
Le MNT est scientifiquement exploitable pour une première QA de direction hydraulique : il est métrique, couvre l'ensemble du réseau runtime après transformation et contient des altitudes plausibles pour le bassin Sebou.

## Points à contrôler avant industrialisation
- Formaliser le CRS cible du MNT en `EPSG:32630` ou documenter le WKT exact si l'EPSG n'est pas reconnu automatiquement.
- Conserver le raster parent dans sa structure Arc/Info Grid complète.
- Ne jamais utiliser l'overview `.ovr` comme source altimétrique officielle.
- Documenter le taux de NoData : il n'empêche pas l'audit réseau actuel, mais peut impacter des zones hors bassin ou de bordure.
