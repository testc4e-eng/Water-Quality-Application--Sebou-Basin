# BUG 2 — Plein écran chevauche le zoom

## Symptôme
Le bouton "Plein écran" React Custom s'affichait au-dessus des contrôles natifs de zoom et navigation de MapLibre, en haut à droite.

## Fichier modifié
`frontend/src/pages/DashboardCartoMetier.tsx`

## Correctif Appliqué
- Le bouton a été déplacé vers le haut de l'écran, à gauche, juste à côté de la sidebar : de `right-4` à `left-[350px]`.

## Résultat
**Bug corrigé (OUI)** : Le bouton est désormais dégagé des contrôles de zoom/geoloc (top-right).
