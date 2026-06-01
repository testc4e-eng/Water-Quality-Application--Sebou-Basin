# Audit des Composants Connectés

Analyse initiale du graphe (non filtré) effectuée le 14 Mai 2026.

## Statistiques Globales
- **Nombre total de composants :** 35
- **Nombre total de nœuds :** 732

## Liste des Composants

| component_id | nb_nodes | nb_edges | taille_% | statut |
| :--- | ---: | ---: | ---: | :--- |
| 0 | 267 | 266 | 36.5% | **MAIN_COMPONENT** |
| 1 | 91 | 90 | 12.4% | SECONDARY |
| 2 | 65 | 64 | 8.9% | SECONDARY |
| 3 | 59 | 58 | 8.1% | SECONDARY |
| 4 | 24 | 23 | 3.3% | SECONDARY |
| 5 | 22 | 21 | 3.0% | SECONDARY |
| 6 | 22 | 21 | 3.0% | SECONDARY |
| 7 | 19 | 18 | 2.6% | SECONDARY |
| 8 | 19 | 18 | 2.6% | SECONDARY |
| 9 | 12 | 11 | 1.6% | SECONDARY |
| 10-34 | ~100 | ~90 | ~15% | MICRO |

## Analyse
Le composant principal est trop petit (36.5%). Les composants 1, 2 et 3 représentent à eux seuls ~30% du réseau et sont probablement des affluents majeurs déconnectés par des gaps de quelques mètres.

> [!IMPORTANT]
> L'objectif est de fusionner les composants 1 à 9 avec le composant 0, sauf si l'un d'eux correspond au composant `ISOLATED_ACCEPTED`.
