# Roadmap refactor progressive

## Lot 1

- isoler les routes spécialisées en lazy loading ;
- stabiliser un client API unique ;
- étendre React Query aux domaines météo / hydro / pollution.

## Lot 2

- extraire progressivement `Dashboard2` en panneaux spécialisés ;
- réduire la logique cartographique monolithique ;
- basculer les écrans pollution hors mocks.

## Lot 3

- virtualisation des tableaux lourds ;
- rationalisation des composants graphiques ;
- séparation claire legacy / spécialisé.

## Lot 4

- revue fine re-renders et états globaux ;
- optimisation bundle et vendor splitting ;
- durcissement tests frontend métier.

## Composants cibles

- `shared/DataTable`
- `shared/MapPanel`
- `shared/FilterBar`
- hooks `useDomainQuery`
- pages spécialisées `Meteo`, `Hydro`, `Pollution`, `IDP`, `Decision`
