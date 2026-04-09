# PR Title

`merge: intégrer les avancements dashboards (dev_v1 + dev_v2 + base dev_merge_test)`

---

# PR Description

## Contexte

Cette PR fusionne les 3 flux de travail:
- Base intégration: `dev_merge_test`
- Avancement intégratrice analytique: `origin/dev_v1`
- Avancement intégratrice cartographique: `origin/dev_v2`

Branche source: `merge/dashboards_2026-04-09`  
Branche cible recommandée: `dev_merge_test`

## Résumé des changements intégrés

### Backend
- Renforcement middleware/logging et compression HTTP:
  - `backend/app/main.py`
- Optimisation du chargement layers:
  - `backend/app/routers/layers.py`

### Frontend - Dashboard Analytique
- Intégration des composants Climate:
  - `frontend/src/components/Climate/UnifiedFilters.tsx`
  - `frontend/src/components/Climate/UnifiedSimpleDashboard.tsx`
  - `frontend/src/components/Climate/UnifiedMultiDashboard.tsx`
  - `frontend/src/api/climate.ts`

### Frontend - Dashboard Cartographique
- Intégration des composants map/dashboard:
  - `frontend/src/pages/Dashboard2.tsx`
  - `frontend/src/components/Dashboard/MapContainer.jsx`
  - `frontend/src/components/Map/InteractiveMap.jsx`
  - `frontend/src/layers/config.ts`
  - `frontend/src/components/Filters/ScenarioSelector.jsx`

### Frontend - Admin Data Scan / Ingestion
- Intégration des vues data-scan:
  - `frontend/src/components/admin/data-scan/*`
  - `frontend/src/pages/admin/DataScanPage.tsx`
- Intégration écran ingestion:
  - `frontend/src/pages/admin/IngestionPage.tsx`

### UI générale
- Ajustements navigation/layout:
  - `frontend/src/components/Layout/Sidebar.tsx`
- Mise à jour page d'accueil:
  - `frontend/src/pages/LandingPage.tsx`

## Commits clés de la branche

- `c6a55f4` merge dev_v1 (résolution contrôlée)
- `c7708e1` merge dev_v2 (résolution contrôlée)
- `ad94fea` correctif: intégration des updates manquants (ingestion + data-scan)

## Validation technique exécutée

- Frontend build:
  - `npm --prefix frontend run build` ✅
- Backend syntax check:
  - `micromamba run -n sad_backend python -m py_compile backend/app/main.py backend/app/routers/layers.py` ✅

## Checklist de recette fonctionnelle

### Dashboard Analytique
- [ ] `/dashboard-analytique` mode simple: valeurs + dates chargent correctement
- [ ] `/dashboard-analytique` mode multiple: multi-séries + exports OK
- [ ] Filtres thématique/sous-menu/variable/site fonctionnels

### Dashboard Cartographique
- [ ] `/dashboard-2` affichage couches sans blocage
- [ ] Filtres couches + interactions popup/zoom opérationnels
- [ ] Temps de chargement acceptable en navigation map

### Admin
- [ ] `Data Scan` charge les tableaux/cartes de synthèse
- [ ] `Ingestion` charge les modules attendus

### Navigation
- [ ] Menu latéral et routes principales sans régression

## Points de vigilance

1. Cette fusion provient de branches à historiques indépendants (`unrelated histories`) et a nécessité une résolution manuelle orientée métier.
2. Deux fichiers binaires sont présents dans le diff:
   - `backend/data/uploads/Data_Results_WASP.xlsx`
   - `backend/data/uploads/SWATOutput.mdb`

Si ces fichiers ne doivent pas être versionnés, les exclure avant merge final.

## Plan après merge PR

1. Merge vers `dev_merge_test`
2. Recette fonctionnelle complète
3. PR finale vers `dev`/`main` selon gouvernance projet

