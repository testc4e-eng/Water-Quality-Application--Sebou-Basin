# Stratégie cache, suspense, pagination et virtualisation

## Cache

- généraliser React Query sur tous les écrans spécialisés ;
- garder `queryKey` structurés par domaine / support / période / paramètre ;
- cache court pour récent, plus long pour historique ;
- précharger seulement les listes légères, jamais les jeux de valeurs.

## Suspense / lazy loading

- lazy-load des grosses pages legacy non critiques ;
- lazy-load des modules cartographiques spécialisés ;
- suspense local par panneau, pas suspense global bloquant toute page.

## Pagination

- pagination serveur systématique sur tableaux longs ;
- conserver `limit` explicite ;
- `100` par défaut, `250` pour analyse, `500` réservé aux exports et audits.

## Virtualisation tableau

- virtualiser les tableaux > `500` lignes ;
- prioriser `DataViewer`, écrans admin et futures analyses pollution ;
- ne pas virtualiser prématurément les petits tableaux de validation métier.

## Cartes volumineuses

- découper couches thématiques ;
- clusters ;
- chargement de géométrie seulement si couche visible ;
- éviter plusieurs moteurs ou styles concurrents chargés inutilement.
