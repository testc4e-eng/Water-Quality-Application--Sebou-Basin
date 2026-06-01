# Validation hydraulique

## Statut
`HYDRAULIC_VALIDATION_IN_PROGRESS__MNT_VALID__FLOW_QA_PENDING`

## Décision chantier
`GO_HYDRAULIC_VALIDATION_EXECUTION`

## État documentaire
Le chantier `VALIDATION_HYDRAULIQUE_SCIENTIFIQUE` est ouvert dans `docs/42_hydraulic_validation_scientifique/`.

Le moteur runtime reste topologique/visuel tant que la QA MNT n'est pas arbitrée. Le flag applicatif `hydraulic_direction_validated=false` doit rester inchangé.

## MNT
| Élément | Valeur |
|---|---|
| Dossier | `C:\dev\WQDSS\data\MNT SEBOU 30N 30M\` |
| Raster principal | `seboureproj` |
| Fichier `.ovr` | lisible, mais non source officielle |
| Format | Arc/Info Binary Grid |
| Résolution | 27.490337 m |
| CRS | UTM zone 30N basé WGS84, unité mètre |
| Statut | `MNT_VALID` |

## Objets réseau disponibles
| Objet | Type | Lignes |
|---|---|---:|
| `geo.reseau_hydrographique` | source | 697 |
| `geo_work.reseau_hydro_edges_final` | runtime | 728 |
| `geo_work.reseau_hydro_edges_final_vertices_pgr` | vertices | 740 |
| `geo_work.reseau_hydro_nodes` | nodes legacy | 732 |
| `geo_work.v_topo_qa` | vue | disponible |

## QA réseau read-only
| Contrôle | Résultat |
|---|---:|
| Géométries nulles/vides | 0 |
| Géométries invalides | 0 |
| Source/target nuls | 0 |
| Self-loops | 0 |
| Composantes non orientées | 13 |
| Segments couverts par emprise MNT | 728/728 |

## Premier échantillonnage MNT read-only
| Statut candidat | Nombre |
|---|---:|
| `FLOW_CONFIRMED` | 508 |
| `FLOW_REVERSED_SUSPECTED` | 139 |
| `FLAT_SEGMENT` | 81 |
| `MNT_NO_DATA` | 0 |
| `OUTSIDE_MNT` | 0 |

## Blocages scientifiques restants
- 139 segments potentiellement inversés à revoir.
- 81 segments plats ou très incertains à qualifier.
- Aucune inversion automatique autorisée.
- Table QA `qa.hydraulic_direction_validation` à créer puis alimenter en DEV contrôlé.

## Prochaine action
Créer la QA hydraulique en DEV, publier les couches de revue, arbitrer les segments suspects, puis seulement préparer une vue runtime hydrauliquement validée.
