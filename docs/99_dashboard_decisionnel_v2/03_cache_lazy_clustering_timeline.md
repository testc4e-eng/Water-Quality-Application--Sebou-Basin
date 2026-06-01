# Cache, lazy loading, clustering, timeline

## Lazy loading

- charger la carte de base immédiatement ;
- charger les données seulement après action ;
- lazy-load des onglets secondaires, graphiques lourds et campagnes ;
- lazy-load route par route pour les futurs écrans spécialisés.

## Cache

- React Query par clé `view + family + support + period + mode` ;
- `staleTime` court pour récent, plus long pour historique ;
- invalidation explicite au changement de vision métier.

## Clustering / heatmap

| Cas | Stratégie |
|---|---|
| points critiques peu nombreux | points individuels |
| forte densité supports / pollution | clusters |
| densité diffuse pollution / météo | heatmap optionnelle |
| anomalies prioritaires | toujours visibles individuellement |

## Timeline

- mode `Récent` par défaut ;
- raccourcis `30j`, `90j`, `12 mois`, `5 ans`, `archive` ;
- pas d'historique massif sans clic explicite.

## Compatibilité

- ne pas casser Observatoire V2 ;
- ne pas casser backend P0 ;
- conserver la règle `include_geom` uniquement en mode carte.
