# Légende et styles QGIS

## Styles fournis
| Fichier | Usage |
|---|---|
| `hydraulic_direction_validation.qml` | Style global par statut |
| `hydraulic_reversed_suspected.qml` | Segments rouges à arbitrer |
| `hydraulic_flat_segments.qml` | Segments plats orange |
| `hydraulic_flow_confirmed.qml` | Segments confirmés verts |
| `hydraulic_nodes.qml` | Noeuds, confluences, bifurcations |
| `mnt_hillshade.qml` | Rendu gris du MNT |

## Règles de symbologie
| Statut | Couleur | Interprétation |
|---|---|---|
| FLOW_CONFIRMED | Vert | Sens cohérent avec pente MNT |
| FLOW_REVERSED_SUSPECTED | Rouge | Sens probablement inverse, à revoir |
| FLAT_SEGMENT | Orange | Segment plat ou incertain |
| LOW_SLOPE_UNCERTAIN | Jaune | Pente faible |
| NEED_MANUAL_REVIEW | Violet | Revue manuelle |
| MNT_NO_DATA | Gris | Pas de donnée MNT |
| OUTSIDE_MNT | Noir pointillé | Hors emprise MNT |

## Noeuds
| Type | Couleur |
|---|---|
| Confluence / bifurcation | Violet |
| Passage | Bleu |
| Degré 1 / isolé | Gris |

## Application manuelle d'un style
Clic droit sur la couche → Propriétés → Symbologie → Charger le style → choisir le fichier `.qml` correspondant.
