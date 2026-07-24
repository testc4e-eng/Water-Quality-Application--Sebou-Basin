# 03 — Frontend — Dashboard Pollution Campagnes

## Route

`/dashboard-pollution-campagnes` ajoutée dans `frontend/src/App.tsx`.

## Page principale

`frontend/src/pages/DashboardPollutionCampagnes.tsx`

Layout : bandeau provisoire + sidebar filtres + carte + panneau latéral (alertes + liste) + drawer fiche.

## Composants

| Fichier | Rôle |
|---|---|
| `CampagneSidebar.tsx` | Filtres campagne, date, site, paramètre |
| `CampagnePrelevementMap.tsx` | Carte MapLibre des 141 points |
| `CampagneList.tsx` | Liste des prélèvements |
| `PrelevementDetail.tsx` | Drawer fiche détail + tableau des 51 mesures |
| `PollutionAlertPanel.tsx` | Liste des alertes métaux lourds |
| `PrelevementEntityLink.tsx` | Entités d'inventaire liées |

## API / Hooks

- `frontend/src/api/pollutionCampagnes.ts`
- `frontend/src/hooks/usePollutionCampagnes.ts`

## Navigation

Ajout dans `Sidebar.tsx` et `Header.tsx` sous le label "Pollution — Campagnes" (status DEV).
