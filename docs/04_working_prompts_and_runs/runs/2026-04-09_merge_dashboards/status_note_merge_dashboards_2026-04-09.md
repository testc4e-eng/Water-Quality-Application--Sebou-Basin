# Mise à jour documentation plateforme
Date de mise à jour: 2026-04-10  
Référence initiale: fusion dashboards du 2026-04-09

## 1) Contexte
Cette note sert désormais de référence de suivi des dernières améliorations intégrées sur la plateforme après merge `dev_v1` + `dev_v2` et correctifs de stabilisation.

## 2) Historique des changements récents

| Date | Commit | Type | Résultat |
|---|---|---|---|
| 2026-04-09 | `a5543cb` | fix(dashboards) | Restauration du comportement attendu carto/analytics + options UI admin |
| 2026-04-09 | `ad94fea` | fix | Intégration des updates manquants ingestion + data-scan |
| 2026-04-09 | `3958aba` | feat | Stabilisation chargement dashboards + simplification landing page |
| 2026-04-08 | `6b69902` | fix(analytics) | Suppression boucle `onChange` répétée |
| 2026-04-08 | `f46e980` | fix(analytics) | Variable requise + auto-sélection des filtres |
| 2026-04-08 | `7f7216f` | merge | Intégration modules ingestion (1-7) + column selector |
| 2026-04-08 | `812d7b9` | feat | Nouvelles routes analytics + scripts MV + mises à jour dashboards |

## 3) Améliorations intégrées par domaine

### Backend
- `backend/app/main.py`
  - middleware journalisation d'activité
  - masquage paramètres sensibles
  - compression GZip
- `backend/app/routers/layers.py`
  - filtrage `bbox` viewport
  - garde-fous sur géométries invalides
  - limitation volumétrie sans viewport
  - priorité des sources matérialisées
- `backend/app/routers/analytics.py`
  - routes climat/hydrologie/pollution (`options`, `sites`, `series`)
  - gestion variable obligatoire sur sous-menus concernés
- `backend/app/routers/ingestion.py`
  - upload + validation structure
  - rapport mapping
  - détection doublons
  - simulation dry-run
  - export CSV erreurs critiques QA
  - audit historique

### Frontend
- Dashboard analytique:
  - `frontend/src/components/Climate/UnifiedFilters.tsx`
  - `frontend/src/components/Climate/UnifiedSimpleDashboard.tsx`
  - `frontend/src/components/Climate/UnifiedMultiDashboard.tsx`
  - `frontend/src/api/analytics.ts`
- Dashboard cartographique:
  - `frontend/src/pages/Dashboard2.tsx`
  - `frontend/src/components/Map/InteractiveMap.jsx`
  - `frontend/src/components/Dashboard/MapContainer.jsx`
  - `frontend/src/layers/config.ts`
- Administration:
  - `frontend/src/pages/admin/DataScanPage.tsx`
  - `frontend/src/pages/admin/IngestionPage.tsx`
  - `frontend/src/components/admin/data-scan/*`
- Navigation/UI:
  - `frontend/src/components/Layout/Header.tsx`
  - `frontend/src/pages/LandingPage.tsx`

## 4) Performance et exploitation
- Scripts SQL/MV ajoutés:
  - `backend/sql/2026_04_mv_analytics_climat.sql`
  - `backend/sql/2026_04_mv_dashboard_climat_meteo_menu.sql`
  - `backend/sql/2026_04_mv_dashboard_hydrologie_menu.sql`
  - `backend/sql/2026_04_mv_dashboard_pollution_menu.sql`
  - `backend/sql/2026_04_mv_perf_pack.sql`
- Automatisation refresh:
  - `backend/scripts/refresh_mviews.py`
  - `backend/scripts/register_mv_refresh_task.ps1`
- Endpoints opérationnels:
  - `GET /api/v1/observatory/mviews/status`
  - `POST /api/v1/observatory/mviews/refresh`

## 5) Recette fonctionnelle recommandée
- Dashboard analytique: vérifier mode simple/multiple + filtres + chargement séries.
- Dashboard cartographique: vérifier filtres couches + popup + navigation viewport.
- Data Scan: vérifier synthèse et export JSON.
- Ingestion: vérifier validation structure/mapping/doublons + simulation + audit.
- Navigation: vérifier accès routes selon rôle utilisateur.

## 6) Points de vigilance
- Historique multi-branches avec résolutions manuelles: maintenir les validations fonctionnelles avant merge final.
- Vérifier la politique de versionnement des fichiers binaires métier (`.mdb`, `.xlsx`) dans le dépôt.

## 7) Documentation complémentaire ajoutée (2026-04-10)
- Nouveau corpus documentaire structuré:
  - `docs/00_overview`
  - `docs/01_architecture`
  - `docs/02_backend`
  - `docs/03_frontend`
  - `docs/04_data`
  - `docs/06_deployment`
  - `docs/08_roadmap`
- Note de recommandations transverses:
  - `docs/recommendation rapport.md`
