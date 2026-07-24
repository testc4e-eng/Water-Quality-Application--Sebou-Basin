# 118 — Nettoyage du code mort (pré-livraison)

**Date** : 2026-07-24. Chaque suppression a été vérifiée par grep direct des
importeurs avant exécution (preuve d'absence de référence), puis validée par
un build de production complet (`npm run build`, exit 0, aucun avertissement).
Tout est restaurable depuis l'historique git.

## Supprimé (20 fichiers + 2 dépendances npm)

### Frontend — chaîne du routeur mort
`main.tsx` importe `App.tsx` (routeur inline réel). `router.tsx` n'était
importé par personne — routeur parallèle abandonné. Supprimés avec lui, ses
imports exclusifs :

- `src/router.tsx`
- `src/pages/DashboardAnalytique.tsx` (atteignable uniquement via router.tsx)
- `src/pages/DashboardClimate.tsx` (idem) + artefact `DashboardClimate.txt`
- `src/pages/Index.tsx` (aucun importeur)

### Frontend — chaîne plotly morte
- `src/components/Dashboard/ChartsGrid.jsx`, `LinkedChart.jsx` (aucun importeur)
- `src/components/Charts/GaugeChart.jsx`, `HeatmapChart.jsx`,
  `ScatterPlotChart.jsx`, `TimeSeriesChart.jsx` (importés uniquement par les
  deux fichiers ci-dessus)
- `src/components/Charts/MultiCharts.jsx` (aucun importeur)
- `src/components/Dashboard/MapContainer.jsx`, `StationTable.jsx` (aucun importeur)
- **Dépendances désinstallées** : `plotly.js`, `react-plotly.js` (plus aucun
  consommateur ; déjà absents du bundle car tree-shakés)

### Frontend — divers
- `src/api/hydroqual.js` (aucun importeur)
- `src/pages/DashboardDeclarationPollution.tsx` — ⚠ fichier récent (WIP
  juillet) mais **non importé** : `App.tsx` route `/dashboard-declaration`
  vers `Navigate(/dashboard-pollution?view=declaration)` ; la page autonome a
  été supplantée par le `DeclarationWorkspace` intégré au Dashboard Pollution.
  Restaurable depuis le commit `20678c9` si besoin.

### Backend
- `app/api/v1/items.py` (jamais monté)
- `app/api/v1/api_router.py` (en-tête « LEGACY / NON-RUNTIME », jamais importé)
- `app/api/v1/hydro.py` (le runtime utilise `app/routers/hydro.py`)
- `mock_main.py` (serveur de mock ; référencé uniquement dans docs/)

## Conservé (faux candidats vérifiés)

| Fichier | Preuve de vie |
|---------|---------------|
| `pages/admin/UserManagementPage.tsx` | importé par `UsersAuditHubPage.tsx` (App) — l'inventaire initial le croyait mort |
| `components/Dashboard/AlertPanel.jsx`, `KPISection.jsx` | importés par `Dashboard1.tsx` |
| `components/Charts/ExtraCharts.jsx`, `TimeSeriesLinked.jsx` | importés par `Dashboard1.tsx` (sans plotly) |
| `pages/Dashboard1.tsx` / `Dashboard2.tsx` | routes vivantes `dashboard` / `carte` dans App.tsx |

## Non traité (décision reportée)

- `backend/scripts/*` : one-shots de migration déjà exécutés — valeur
  d'archive, aucune nuisance runtime. À archiver éventuellement en V2.
- Dossiers racine non suivis (`backups/` ~12 Go, `sandbox/` ~603 Mo,
  `archive/`, `artifacts/`) : hors git pour l'essentiel ; les 20 fichiers
  `sandbox/` et 2 CSV `backend/backups/` suivis restent à arbitrer.
