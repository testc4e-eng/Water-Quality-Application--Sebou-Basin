# 3. Symbologie et Contrôles Carte

## Symbologie par Support
Le composant `MapV1.tsx` applique maintenant la symbologie demandée via le style de la couche `circle-color` (Match expression de MapLibre) :

- `STATION_QUALITE` : Bleu (`#3b82f6`)
- `STATION_HYDRO` : Bleu foncé (`#1d4ed8`)
- `STATION_METEO` : Orange (`#f97316`)
- `BARRAGE` : Violet (`#8b5cf6`)
- `SOURCE_POLLUTION` : Rouge (`#ef4444`)

## Légende
Une légende flottante (`absolute bottom-6`) reprenant le code couleur exact a été ajoutée pour guider visuellement l'analyste.

## Contrôles Natifs MapLibre
Des contrôles ont été ajoutés sur le panneau droit de la carte :
- `NavigationControl` : Zoom avant/arrière interactif.
- `FullscreenControl` : Permet de basculer la zone de cartographie en plein écran du navigateur.

## Clustering
Le clustering natif de MapLibre a été activé pour la `Source` GeoJSON (pour gérer intelligemment les volumes importants comme les points de pollution).
- `<Layer id="clusters">` avec des styles adaptatifs selon la taille du cluster (10+, 50+).
- `<Layer id="cluster-count">` pour afficher la quantité.
- Zoom intelligent au clic sur un cluster (`getClusterExpansionZoom`).
