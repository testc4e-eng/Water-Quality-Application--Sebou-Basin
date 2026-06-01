# Inventaire composants frontend dashboard carto métier

## Fichiers créés

| Fichier | Rôle |
|---|---|
| `frontend/src/api/mapBusiness.ts` | client API typé `/api/v1/map/*` |
| `frontend/src/hooks/useMapBusiness.ts` | hooks React Query avec `staleTime=60s` |
| `frontend/src/pages/DashboardCartoMetier.tsx` | page isolée `/dashboard-carto-metier` |
| `frontend/src/components/DashboardMetier/BusinessSidebar.tsx` | navigation métier, filtres, bouton afficher |
| `frontend/src/components/DashboardMetier/BusinessMap.tsx` | carte MapLibre GeoJSON |
| `frontend/src/components/DashboardMetier/BusinessPopup.tsx` | popup entité et latest values |
| `frontend/src/components/DashboardMetier/BusinessLegend.tsx` | légende réglementaire et metadata |
| `frontend/src/components/DashboardMetier/EntityDetailsPanel.tsx` | panneau latéral détail entité |
| `frontend/src/components/DashboardMetier/ParameterSelector.tsx` | sélection paramètre P0 |
| `frontend/src/components/DashboardMetier/LayerTogglePanel.tsx` | visibilité couche entités et placeholders P1 |

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `frontend/src/App.tsx` | ajout route `/dashboard-carto-metier` |
| `frontend/src/router.tsx` | ajout route de cohérence |

## Réutilisation

- `axios` existant via `frontend/src/api/client.ts`.
- React Query existant.
- MapLibre via `react-map-gl/maplibre`.
- Composants UI existants `Badge`, `Button`, `Input`, `Checkbox`, `ScrollArea`.

## Principes d’isolation

- Aucun composant legacy modifié.
- Aucun appel direct SQL.
- Aucun endpoint hors `/api/v1/map/*` dans le client métier.
- Aucun chargement d’entités avant sélection utilisateur.
- Compatibilité backend legacy conservée mais non mise au premier plan côté menu.

## Préparation P1

- `LayerTogglePanel` prépare les couches contexte.
- `EntityDetailsPanel` réserve la section séries temporelles.
- `useLatestValues` est disponible mais non utilisé pour charger massivement au démarrage.
