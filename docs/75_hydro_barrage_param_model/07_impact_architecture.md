# Impact architecture

## Context

Les consommateurs existants lisent encore le modele multi-colonnes.

## Analysis

Points impactes verifies :

- Backend
  - `backend/app/routers/observatory.py`
  - `backend/app/routers/entities.py`
  - `backend/sql/2026_04_mv_dashboard_hydrologie_menu.sql`
- Frontend
  - `frontend/src/layers/config.ts`
  - `frontend/src/layers/layerManager.ts`
  - `frontend/src/api/observatory.ts`
  - `frontend/src/pages/Dashboard2.tsx`
- Documentation de schema
  - `docs/01_project_reference/data/DATABASE_SCHEMA.md`
  - `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`

## Solution

Impacts attendus :

- Dashboards hydrologie :
  - `niveau_barrage` reste stable
  - `volume_barrage` doit etre recode en `VOLUME`
  - `lacher_barrage` ne peut plus etre servi depuis `lacher_m3s`
  - `lacher_barrage` doit afficher `Mm3/j`
  - `apports_hm3` doit afficher `Mm3/j`
  - `transfert` doit afficher `Mm3/j`
- API observatory :
  - remplacer les metriques hardcodees `cote_m`, `volume_mm3`, `lacher_m3s`
  - introduire un filtre `parametre_code`
  - interdire toute conversion implicite `volume journalier -> debit`
- Analytics :
  - reconstruire `analytics.mv_dashboard_hydrologie_menu` sur la table normalisee
- Compatibilite :
  - prevoir une vue de projection legacy si la migration applicative est sequentielle

## Optional improvements

- creer `api.v_hydro_barrage_param_journalier`
- creer `api.mv_hydro_barrage_param_day`
- deprecier `api.v_hydro_niveau_barrage_journalier` avec plan de retrait documente
