# Frontend SAD Sebou (React + Vite)

## Prérequis
- Node.js 20+
- npm

## Installation et démarrage
```bash
cd frontend
npm install
npm run dev -- --port 3001
```

Build production :
```bash
npm run build
```

## Configuration `.env`
Variables utilisées par le client API :
- `VITE_API_BASE_URL` (ex: `http://127.0.0.1:8000/api/v1`)
- `VITE_API_BASE`
- `VITE_API_PROXY`

## Routes principales (définies dans `src/App.tsx`)
- `/` : landing page
- `/dashboard-cartographique` : dashboard cartographique
- `/dashboard-analytique` : dashboard analytique
- `/dashboard-scenarios` : dashboard scénarios
- `/data` : gestion des données (admin)
- `/admin/data-scan` : scan de disponibilité
- `/admin/ingestion` : centre d'ingestion SWAT/WASP
- `/admin/popup-rules` : règles popups
- `/admin/users`, `/admin/audit`, `/admin/password-resets`

## Améliorations récentes (8-9 avril 2026)
- Stabilisation filtres analytiques (plus de boucle `onChange`, auto-sélection robuste).
- Intégration des APIs analytics climat/hydrologie/pollution.
- Consolidation du dashboard cartographique avec filtres viewport `bbox`.
- Finalisation des vues d'administration `data-scan` et `ingestion`.
- Ajustements UX navigation/header/sidebar et simplification landing page.

## Documentation frontend associée
- `docs/01_project_reference/frontend/frontend_reference.md`
- `docs/01_project_reference/DOCUMENT_MAP.md`
- `docs/01_project_reference/overview/data_governance_and_standards.md`
