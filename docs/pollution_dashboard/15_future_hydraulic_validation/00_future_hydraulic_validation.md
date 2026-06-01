# Future validation hydraulique

## Statut mis à jour
`HYDRAULIC_VALIDATION_IN_PROGRESS__MNT_VALID__FLOW_QA_PENDING`

Ce document reste le cadrage historique. Le chantier actif est maintenant documenté dans :

`docs/42_hydraulic_validation_scientifique/`

## Constat actuel
Le moteur hydrologique runtime est disponible pour routage topologique et affichage visuel. Il n'est pas encore validé scientifiquement.

Le MNT principal a été retrouvé et validé comme source exploitable pour QA :

`C:\dev\WQDSS\data\MNT SEBOU 30N 30M\seboureproj`

Le fichier `SebouReproj.ovr` reste une overview lisible mais ne doit pas être utilisé seul comme source altimétrique officielle.

## Résultat QA read-only P0
| Statut candidat | Nombre |
|---|---:|
| `FLOW_CONFIRMED` | 508 |
| `FLOW_REVERSED_SUSPECTED` | 139 |
| `FLAT_SEGMENT` | 81 |
| `MNT_NO_DATA` | 0 |
| `OUTSIDE_MNT` | 0 |

## Prochaine étape
Créer une table QA dédiée `qa.hydraulic_direction_validation`, charger les statuts candidats en DEV contrôlé, puis lancer une revue cartographique des segments suspects.

## Interdictions maintenues
- Ne pas modifier `geo.reseau_hydrographique`.
- Ne pas inverser automatiquement `source`/`target`.
- Ne pas marquer le runtime comme hydrauliquement validé avant arbitrage.
- Ne pas utiliser les directions suspectes comme vérité ML/GNN.

## Impact pollution
La propagation pollution, les temps d'arrivée, le routage aval scientifique et le GNN directionnel restent bloqués tant que les candidats `FLOW_REVERSED_SUSPECTED` et `FLAT_SEGMENT` ne sont pas arbitrés.
