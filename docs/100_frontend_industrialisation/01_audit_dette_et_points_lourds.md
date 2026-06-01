# Audit dette et points lourds

## Constats observés

| Sujet | Constat |
|---|---|
| route principale | `frontend/src/App.tsx` concentre le routeur |
| lazy loading | seulement `DecisionDashboardTest` est lazy-loadé explicitement |
| page très lourde | `Dashboard2.tsx` ~116 KB |
| page lourde secondaire | `DataViewer.tsx` ~57 KB |
| composants lourds | `HydroMultiModesDashboard.tsx`, `UnifiedMultiDashboard.tsx`, `SidebarFilters.tsx`, `QualityFilters.tsx` |
| cartes | MapLibre présent dans plusieurs pages / composants |
| clients HTTP | coexistence de `src/api/client.ts` et `src/lib/api.ts` déjà documentée |
| React Query | utilisé sur les nouveaux écrans spécialisés, pas partout |
| bundle build | chunk principal > 500 kB ; bundle JS principal ~3.2 MB minifié dans build observé |

## Dette TypeScript / structure

- coexistence `.tsx` et anciens composants `.jsx` ;
- pages legacy massives ;
- duplication partielle des routes (`App.tsx`, `router.tsx`) ;
- dette de rationalisation API / hooks / domain modules.

## Zones à ne pas casser

- `Dashboard2`
- routes legacy existantes
- pilote Métaux
- Observatoire V2
- dashboard décisionnel test
