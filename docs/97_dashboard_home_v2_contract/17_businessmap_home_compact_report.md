# BusinessMap home compact report

## Problème constaté

- `BusinessMap` restait trop proche du mode complet de `/dashboard-carto-metier` ;
- le Home héritait encore d’overlays et de chrome cartographique non indispensables ;
- la légende et les messages internes limitaient le compactage maximal du cockpit.

## Différence `mode=home` vs `mode=full`

### `mode="home"`

- conteneur borné au Home avec `min-height` réduit ;
- overlay cartographique réduit à un badge compact ;
- légende volumineuse masquée ;
- messages `loading`, `error`, `empty` plus compacts ;
- aucun élément interne ne doit agrandir visuellement le widget plus que nécessaire.

### `mode="default"` / `mode="full"`

- comportement complet inchangé ;
- overlay titre + sous-titre conservé ;
- légende cartographique conservée ;
- rendu riche maintenu pour `/dashboard-carto-metier`.

## Fichiers modifiés

- `frontend/src/components/DashboardMetier/BusinessMap.tsx`
- `frontend/src/components/home-v2/OperationalMap.tsx`

## Validation build

- `npm run build` : `OK`

## Routes testées

- `http://localhost:5173/` : `200`
- `http://localhost:5173/accueil-sad` : implicitement couverte par le Home
- `http://localhost:5173/dashboard-carto-metier` : `200`

## Limites restantes

- `BusinessMap` en mode `home` reste alimenté par le moteur cartographique existant, donc la densité des entités dépend toujours du comportement interne de la carte ;
- la carte Home n’a pas encore de dataset spécifiquement allégé côté données ;
- le premier chargement perçu peut encore dépendre de la vitesse backend globale du Home.

## Décision finale

- `GO_BUSINESSMAP_HOME_COMPACT_READY`
