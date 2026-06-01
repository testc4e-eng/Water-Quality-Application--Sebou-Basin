# README — Ouverture du package QGIS portable

## Fichier a ouvrir

Ouvrir dans QGIS :

`project/hydraulic_arbitration_sebou_portable.qgz`

## Si les couches ne s'affichent pas

1. Verifier que tout le dossier `hydraulic_arbitration_package_portable` a bien ete copie ensemble.
2. Charger manuellement le GeoPackage :
   `exports/hydraulic_arbitration_package.gpkg`
3. Charger le raster si necessaire :
   `raster/seboureproj.tif`
4. Si un style manque, charger le fichier `.qml` correspondant depuis :
   `styles/`

## Ce qu'il ne faut pas modifier

- ne pas modifier les geometries ;
- ne pas modifier les `edge_id` ;
- ne pas modifier le reseau source ;
- ne pas enregistrer de correction de sens hydraulique dans QGIS ;
- ne pas utiliser de fichier `.ovr` comme MNT officiel.

## Colonnes a remplir dans la grille CSV

Ouvrir :

`exports/hydraulic_arbitration_grid.csv`

Remplir uniquement les colonnes suivantes :

- `decision`
- `commentaire_collaboratrice`
- `besoin_validation_metier`
- `date_validation`
- `validateur`

## Rappel metier

Le package sert uniquement a la revue visuelle et a l'arbitrage humain.

- aucune geometrie ne doit etre modifiee ;
- aucun `edge_id` ne doit etre change ;
- aucune inversion de segment ne doit etre faite directement dans QGIS.
