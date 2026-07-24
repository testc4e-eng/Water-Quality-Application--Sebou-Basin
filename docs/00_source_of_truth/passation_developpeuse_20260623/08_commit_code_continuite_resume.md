# Résumé du commit local de continuité

## Commit

```text
COMMIT_ID = 2221edf
COMMIT_MESSAGE = feat: secure business map analytical workspace continuity code
BRANCHE = Dev_refonte
PUSH_EFFECTUE = NON
```

## Fichiers inclus

### Backend

- `backend/app/models/analysis_models.py`
- `backend/app/models/business_map_models.py`
- `backend/app/routers/analysis.py`
- `backend/app/routers/business_map.py`
- `backend/app/services/analysis_service.py`
- `backend/app/services/business_map_service.py`

### Frontend

- `frontend/src/api/analysis.ts`
- `frontend/src/api/businessMapV1.ts`
- `frontend/src/hooks/useAnalysisBatch.ts`
- `frontend/src/hooks/useBusinessMapV1.ts`
- `frontend/src/store/workspaceStore.ts`
- `frontend/src/pages/DashboardCartoMetier.tsx`
- `frontend/src/components/DashboardMetier/V1/BusinessRightPanelV1.tsx`
- `frontend/src/components/DashboardMetier/V1/BusinessSidebarV1.tsx`
- `frontend/src/components/DashboardMetier/V1/MapV1.tsx`
- `frontend/src/components/DashboardMetier/V1/ThematicValuesTable.tsx`
- `frontend/src/components/analysis-workspace/AnalysisWidget.tsx`
- `frontend/src/components/analysis-workspace/AnalysisWorkspace.tsx`
- `frontend/src/components/analysis-workspace/CorrelationPanel.tsx`
- `frontend/src/components/analysis-workspace/WidgetChart.tsx`
- `frontend/src/components/analysis-workspace/WidgetCorrelation.tsx`
- `frontend/src/components/analysis-workspace/WidgetKPI.tsx`
- `frontend/src/components/analysis-workspace/WidgetTable.tsx`

### Documentation de ce passage

- `docs/99_reorganisation_projet/07_audit_code_continuite_git.md`
- `docs/99_reorganisation_projet/08_fichiers_exclus_git.md`

## Fichiers exclus

### Exclusion sécurité / lourdeur

- `backups/`
- `backups/abh_sad_backup.sql`
- `*.dump`
- `*.rar`
- `*.zip`
- `*.7z`
- `backend/.env`
- logs sensibles

### Exclusion de périmètre

- `backend/app/api/v1/pollution_campagnes.py`
- `backend/app/models/pollution_campagnes_models.py`
- `backend/app/services/pollution_campagnes_service.py`
- `backend/app/models/propagation_models.py`
- `backend/app/services/propagation/propagation_recommendations.py`
- `frontend/src/api/pollutionCampagnes.ts`
- `frontend/src/components/Pollution/*`
- `frontend/src/pages/DashboardPollution*.tsx`
- `frontend/src/hooks/usePollutionCampagnes.ts`
- `frontend/src/hooks/useCorrelation.ts`

### Exclusion ambiguë

- `backend/app/api/api_v1.py`
  - raison : le diff actuel mélange le montage `business_map` / `analysis` avec `pollution_campagnes`
  - risque : impossible de le classer comme commit minimal de continuité sans élargir le périmètre

## Vérifications techniques

```text
BUILD_FRONTEND = OK
PY_COMPILE_BACKEND = OK
```

Détail :

- `npm run build` : OK, avec warning non bloquant sur la taille du bundle principal
- `python -m py_compile` sur les fichiers backend de continuité : OK

## Risques restants

1. `api_v1.py` n'est pas inclus dans ce commit.
   - conséquence : le code backend de continuité est préservé, mais le montage runtime complet des nouveaux routeurs n'est pas sécurisé dans ce commit minimal.

2. Le dépôt local contient encore de nombreuses modifications et de nombreux fichiers non suivis hors périmètre.
   - conséquence : un push global serait risqué sans tri supplémentaire.

3. Le périmètre pollution / campagnes reste séparé.
   - conséquence : tout mélange futur avec la continuité Carte Métier doit être validé explicitement.

## Recommandation

```text
PUSH_RECOMMANDE = NON
```

Motif :

- le commit local `2221edf` est propre et utile ;
- mais il exclut volontairement `backend/app/api/api_v1.py`, donc il ne sécurise pas encore le câblage backend complet côté runtime ;
- avant push, il faut soit :
  1. isoler un diff propre de `api_v1.py` limité à `business_map` et `analysis`, soit
  2. valider un périmètre plus large incluant les dépendances hors continuité actuellement mélangées.

## Décision de ce passage

```text
CODE_CONTINUITE_AUDITE = OUI
CODE_CRITIQUE_COMMITTE = OUI
FICHIERS_LOURDS_EXCLUS = OUI
SECRETS_EXCLUS = OUI
BUILD_OK = OUI
PY_COMPILE_OK = OUI
PUSH_RECOMMANDE = NON
```
