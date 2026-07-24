# Audit Git du code de continuité SAD/WQDSS

## Résumé

Audit réalisé sur la branche `Dev_refonte` après sécurisation de la documentation critique de passation.

Objectif de ce passage :

- isoler le code de continuité réellement utile à la Carte Métier analytique, au Workspace et au batch d'analyse ;
- exclure les fichiers lourds, secrets, brouillons et périmètres ambigus ;
- préparer un staging contrôlé sans `git add .`.

## Commandes exécutées

- `git status --short`
- `git diff --stat`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`
- `npm run build`
- `python -m py_compile ...`

## 1. Code backend critique

### Candidats continuité forte

| Fichier | Statut Git | Rôle | Lecture |
| --- | --- | --- | --- |
| `backend/app/routers/business_map.py` | non suivi | endpoints `availability`, `features`, `series`, `object`, `layers` | critique |
| `backend/app/routers/analysis.py` | non suivi | endpoints batch, corrélation, matrice | critique |
| `backend/app/services/business_map_service.py` | non suivi | providers SQL, filtres `data_family`, `data_temporality`, `latest_values` | critique |
| `backend/app/services/analysis_service.py` | non suivi | agrégation batch et enrichissement metadata | critique |
| `backend/app/models/business_map_models.py` | non suivi | contrats Pydantic business-map | critique |
| `backend/app/models/analysis_models.py` | non suivi | contrats batch / corrélation | critique |

### Fichier backend critique mais ambigu

| Fichier | Statut Git | Problème |
| --- | --- | --- |
| `backend/app/api/api_v1.py` | modifié suivi | mélange le montage `business_map` / `analysis` avec `pollution_campagnes`, périmètre plus large que la seule continuité Carte Métier |

Conclusion backend :

- les 6 fichiers `routers/services/models` business-map et analysis forment un sous-ensemble cohérent ;
- `api_v1.py` est nécessaire pour un runtime backend complet, mais son diff actuel n'est pas strictement borné à la continuité analytique ;
- ce fichier doit être traité comme `A_VALIDER` dans ce passage.

## 2. Code frontend critique

### Candidats continuité forte

| Fichier | Statut Git | Rôle | Lecture |
| --- | --- | --- | --- |
| `frontend/src/api/businessMapV1.ts` | non suivi | client API business-map V1 | critique |
| `frontend/src/api/analysis.ts` | non suivi | client batch/corrélation | critique |
| `frontend/src/hooks/useBusinessMapV1.ts` | non suivi | React Query business-map | critique |
| `frontend/src/hooks/useAnalysisBatch.ts` | non suivi | React Query batch analytique | critique |
| `frontend/src/store/workspaceStore.ts` | non suivi | Zustand workspace, typage `POINT_MEASURE` / `TIME_SERIES` | critique |
| `frontend/src/pages/DashboardCartoMetier.tsx` | modifié suivi | page d'entrée Carte Métier V1 | critique |
| `frontend/src/components/DashboardMetier/V1/BusinessSidebarV1.tsx` | non suivi | sidebar V1 | critique |
| `frontend/src/components/DashboardMetier/V1/BusinessRightPanelV1.tsx` | non suivi | panneau droit V1 | critique |
| `frontend/src/components/DashboardMetier/V1/MapV1.tsx` | non suivi | carte MapLibre V1 | critique |
| `frontend/src/components/DashboardMetier/V1/ThematicValuesTable.tsx` | non suivi | table valeurs/seuils | critique |
| `frontend/src/components/analysis-workspace/AnalysisWorkspace.tsx` | non suivi | panneau workspace | critique |
| `frontend/src/components/analysis-workspace/AnalysisWidget.tsx` | non suivi | wrapper widget | critique |
| `frontend/src/components/analysis-workspace/WidgetChart.tsx` | non suivi | widget chart | critique |
| `frontend/src/components/analysis-workspace/WidgetTable.tsx` | non suivi | widget table pour `POINT_MEASURE` | critique |
| `frontend/src/components/analysis-workspace/WidgetKPI.tsx` | non suivi | widget KPI | utile |
| `frontend/src/components/analysis-workspace/WidgetCorrelation.tsx` | non suivi | widget corrélation | utile |
| `frontend/src/components/analysis-workspace/CorrelationPanel.tsx` | non suivi | panneau corrélation | utile |

### Vérifications fonctionnelles

- imports business-map/analysis cohérents ;
- usage explicite de `data_family` et `data_temporality` détecté ;
- `DashboardCartoMetier.tsx` pointe désormais vers `MapV1`, `BusinessSidebarV1` et `AnalysisWorkspace` ;
- aucun secret détecté dans les candidats frontend.

## 3. Documentation déjà poussée / à ignorer

- la documentation critique de passation a déjà été poussée sur `origin/Dev_refonte` via le commit `0e72d2c` ;
- ces documents ne doivent pas être remis dans le staging de code de continuité ;
- la documentation complémentaire non demandée dans ce passage reste hors périmètre.

## 4. Scripts utiles

Aucun script de continuité métier strictement nécessaire n'a été retenu dans ce passage.

Éléments observés mais exclus :

- `backend/mock_main.py`
- services pollution campagnes
- scripts de maintenance hors périmètre

## 5. Fichiers temporaires

Éléments à ignorer dans ce passage :

- dossiers docs non critiques encore non suivis (`docs/01_*`, `docs/02_*`, `docs/03_documentation_technique/`, `docs/04_*`, `docs/05_*`, `docs/06_*`, `docs/07_*`, `docs/08_*`, `docs/09_*`) ;
- captures PNG non nécessaires au commit de continuité ;
- `dist/`, `node_modules/`, `__pycache__/`, artefacts de build.

## 6. Fichiers lourds à exclure

| Fichier / motif | Statut | Décision |
| --- | --- | --- |
| `backups/abh_sad_backup.sql` | lourd | exclure |
| `backups/*` | lourds / dumps | exclure |
| `*.dump` | dump | exclure |
| `*.rar` | archive | exclure |
| `*.zip` | archive | exclure |
| `*.7z` | archive | exclure |
| `docs/01_project_reference/data.rar` | archive binaire non critique pour continuité code | exclure |

## 7. Fichiers secrets / sensibles

| Fichier / type | Lecture | Décision |
| --- | --- | --- |
| `backend/.env` | contient DB et secrets réels | ne pas ajouter, ne pas modifier |
| logs potentiellement sensibles | risque d'exposer tokens / secrets | exclure |
| dumps BD | données potentiellement sensibles | exclure |

## 8. Fichiers ambigus à valider

| Fichier | Pourquoi ambigu | Décision |
| --- | --- | --- |
| `backend/app/api/api_v1.py` | diff mixte `business_map` / `analysis` + `pollution_campagnes` | ne pas committer dans ce passage |
| `frontend/src/pages/DashboardPollution*.tsx` | hors continuité Carte Métier / Workspace | exclure |
| `frontend/src/api/pollutionCampagnes.ts` | hors continuité ciblée | exclure |
| `backend/app/api/v1/pollution_campagnes.py` et dépendances | périmètre pollution campagnes | exclure |
| `frontend/src/hooks/useCorrelation.ts` | utile mais dépend d'un périmètre plus large | exclure de ce commit minimal |
| `frontend/src/components/Pollution/*` | hors continuité ciblée | exclure |

## Vérification sécurité

Recherche effectuée sur les candidats de continuité :

- `DB_PASS`
- `SECRET_KEY`
- `TOKEN`
- `PASSWORD`

Résultat :

- aucun secret détecté dans les fichiers candidats backend/frontend du commit minimal ;
- les secrets restent concentrés hors périmètre de commit, principalement dans `backend/.env`.

## Vérification technique

```text
BUILD_FRONTEND = OK
PY_COMPILE_BACKEND = OK
```

Réserve :

- warning Vite sur la taille du bundle principal, non bloquant pour ce passage Git.

## Proposition de staging contrôlé

### Backend retenu

- `backend/app/routers/business_map.py`
- `backend/app/routers/analysis.py`
- `backend/app/services/business_map_service.py`
- `backend/app/services/analysis_service.py`
- `backend/app/models/business_map_models.py`
- `backend/app/models/analysis_models.py`

### Frontend retenu

- `frontend/src/api/businessMapV1.ts`
- `frontend/src/api/analysis.ts`
- `frontend/src/hooks/useBusinessMapV1.ts`
- `frontend/src/hooks/useAnalysisBatch.ts`
- `frontend/src/store/workspaceStore.ts`
- `frontend/src/pages/DashboardCartoMetier.tsx`
- `frontend/src/components/DashboardMetier/V1/`
- `frontend/src/components/analysis-workspace/`

### Documentation de ce passage

- `docs/99_reorganisation_projet/07_audit_code_continuite_git.md`
- `docs/99_reorganisation_projet/08_fichiers_exclus_git.md`

## Décision audit

```text
CODE_CONTINUITE_AUDITE = OUI
SOUS_ENSEMBLE_COMMITTABLE = OUI
API_V1_ENTRYPOINT_COMMITTABLE_TEL_QUEL = NON
```
