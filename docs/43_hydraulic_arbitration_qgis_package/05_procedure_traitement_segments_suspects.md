# Procédure — Segments inversions suspectées

## Périmètre
139 segments en statut `FLOW_REVERSED_SUSPECTED`.

## Objectif
Déterminer si le segment est réellement orienté à contre-pente, ou si le MNT produit un signal trompeur.

## Méthode
Pour chaque segment rouge :
1. Identifier `edge_id`.
2. Lire `z_start`, `z_end`, `dz`, `slope`.
3. Inspecter les segments voisins.
4. Vérifier la logique de confluence : un affluent doit rejoindre un axe aval.
5. Vérifier si le segment traverse une zone plate, barrage, retenue ou ouvrage.
6. Choisir une décision dans la grille.

## Décisions recommandées
| Situation | Décision |
|---|---|
| Sens clairement contraire à la pente et cohérent avec voisins | NEEDS_REVERSAL |
| Segment cohérent avec le réseau malgré le MNT | VALIDATED_AS_IS |
| MNT grossier ou bord de vallée ambigu | IGNORE_MNT_ARTIFACT |
| Impossible à trancher | UNCERTAIN |
| Nécessite information métier/terrain | NEED_FIELD_VALIDATION |

## Rappel
Ne jamais inverser la géométrie dans QGIS. On renseigne seulement la décision.
