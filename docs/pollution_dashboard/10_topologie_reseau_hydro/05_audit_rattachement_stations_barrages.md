# Audit : Rattachement Stations et Barrages

L'objectif est d'assurer que les stations et barrages (points) s'accrochent correctement au réseau hydrographique (lignes) pour agir comme des capteurs ou des nœuds d'impact lors du routage.

## Méthodologie (Snapping Spatial)
Chaque station est projetée géométriquement sur le tronçon le plus proche via `ST_Distance(station.geom, reseau.geom)`.

## Seuils de Qualité
- **< 50 m** : Excellent (Snapping direct recommandé).
- **50 - 100 m** : Acceptable (Léger décalage de digitalisation).
- **100 - 250 m** : À vérifier (Risque de s'accrocher au mauvais affluent).
- **> 250 m** : Mauvais (Point probablement mal positionné ou oued manquant).

## Résultats Attendus (Phase B)
Une table `geo_work.rattachement_hydro` sera générée pour tracer la qualité :

| Type | ID / Nom | Distance au Réseau | edge_id cible | Statut |
|---|---|---:|---|---|
| Station | P29 à Allal Tazi | *Calcul SQL à venir* | *...* | *...* |
| Barrage | Garde Sebou | *Calcul SQL à venir* | *...* | *...* |

*Note : Les distances réelles seront extraites via le script readonly (cf. 07).*
