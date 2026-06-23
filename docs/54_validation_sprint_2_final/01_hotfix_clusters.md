# BUG 1 & 4 — Hotfix Clusters

## Symptôme
La carte affichait des cercles gris avec des chiffres (clusters) au zoom initial, mais aucun point individuel n'apparaissait même au zoom maximal. De plus, les points individuels étaient mal gérés ou absents dans certains modes.

## Fichier modifié
`frontend/src/components/DashboardMetier/V1/MapV1.tsx`

## Correctif Appliqué
- Fix des `clusterMaxZoom` à 14 et `clusterRadius` à 50 sur la `Source`.
- Modification de la propriété `cluster={true}` de façon inconditionnelle pour s'assurer que les features soient dotés de la propriété `point_count` par MapLibre.
- Ajustement des layers "clusters" et "cluster-count" pour filtrer purement par `["has", "point_count"]`.
- Ajout propre du layer `business-points` pour les points non-clusterisés (avec `["!", ["has", "point_count"]]`), caché si on est en mode thématique car le mode thématique possède ses propres layers de rendering pour les points non clusterisés.

## Résultat
**Bug corrigé (OUI)** : Les clusters se résolvent maintenant correctement à un niveau de zoom adéquat et laissent apparaître les points d'observation (Support, Domaine, Thématique).
