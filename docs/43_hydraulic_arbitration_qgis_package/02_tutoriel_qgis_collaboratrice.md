# Tutoriel QGIS — Validation hydraulique

## 1. Objectif
On vérifie si le sens d'écoulement du réseau suit bien la pente du MNT. Le travail consiste à regarder les segments suspects dans QGIS et à renseigner une décision dans la grille CSV.

## 2. Ce qu'il ne faut pas faire
- Ne pas modifier le réseau source.
- Ne pas supprimer de segment.
- Ne pas inverser manuellement les lignes dans QGIS.
- Ne pas changer les `edge_id`.
- Ne pas modifier les géométries.
- Ne pas utiliser `SebouReproj.ovr` comme MNT officiel.

## 3. Ouvrir le projet QGIS
1. Ouvrir QGIS.
2. Ouvrir le fichier : `qgis/project/hydraulic_arbitration_sebou.qgz`.
3. Si une couche ne se charge pas, charger manuellement le GeoPackage : `qgis/exports/hydraulic_arbitration_package.gpkg`.
4. Charger le MNT si nécessaire : `C:\dev\WQDSS\data\MNT SEBOU 30N 30M\seboureproj`.
5. Appliquer les styles `.qml` depuis `qgis/styles/` si QGIS ne les applique pas automatiquement.

## 4. Comprendre les couleurs
| Couleur | Signification |
|---|---|
| Vert | Flux confirmé |
| Rouge | Inversion suspectée |
| Orange | Segment plat |
| Jaune | Pente faible incertaine |
| Violet | Revue manuelle |
| Gris | Non évalué / NoData |
| Noir pointillé | Hors MNT |

## 5. Traiter une inversion suspectée
Pour chaque segment rouge :
1. Zoomer sur le segment.
2. Lire `edge_id`.
3. Vérifier les altitudes `z_start` et `z_end`.
4. Regarder les segments voisins amont/aval.
5. Vérifier les confluences et bifurcations proches.
6. Décider dans la grille.

Décisions possibles :
- `VALIDATED_AS_IS`
- `NEEDS_REVERSAL`
- `UNCERTAIN`
- `IGNORE_MNT_ARTIFACT`
- `NEED_FIELD_VALIDATION`

## 6. Traiter un segment plat
Pour chaque segment orange :
1. Vérifier s'il est en plaine.
2. Vérifier s'il est proche d'un barrage, lac, confluence ou zone aménagée.
3. Regarder la longueur du segment.
4. Décider si le segment peut rester tel quel ou nécessite validation terrain/métier.

## 7. Remplir la grille
Ouvrir `qgis/exports/hydraulic_arbitration_grid.csv` et compléter uniquement :
- `decision`
- `commentaire_collaboratrice`
- `besoin_validation_metier`
- `date_validation`
- `validateur`

## 8. Livrables attendus
À renvoyer :
- le CSV rempli `hydraulic_arbitration_grid.csv` ;
- les commentaires métier ;
- la liste des cas incertains ;
- éventuellement le projet QGIS sauvegardé.
