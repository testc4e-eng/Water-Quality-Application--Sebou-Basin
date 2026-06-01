# Organisation par campagne

## Contexte

Les campagnes métier ne doivent pas être noyées dans la restitution courante.

## Solution

| Campagne | Données | Affichage recommandé |
|---|---|---|
| Qualité historique | stations, séries | analyse métier |
| Inventaire pollution | constats, sources | carte points |
| Analyses finales pollution | prélèvements, mesures labo | carte + tableau |
| Bathymétrie | barrages/profils | consultation |
| Capteurs | quasi temps réel | surveillance |
| SWAT/WASP | scénarios | modélisation |

## Règles métier

- Une campagne est une porte d'entrée dédiée.
- Une campagne ne doit pas déclencher d'appel API si son endpoint n'est pas encore prêt.
- La vue test active uniquement `Qualité historique` sur les endpoints P0 qualité.
- Les autres campagnes restent visibles pour validation métier mais avec état `à venir`.

## Impact dashboard test

- Sélecteur campagne dédié.
- Message de disponibilité explicite.
- Aucun spinner infini sur les campagnes non branchées.
