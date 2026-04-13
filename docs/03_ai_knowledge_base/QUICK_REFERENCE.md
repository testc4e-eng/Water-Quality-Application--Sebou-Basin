# QUICK_REFERENCE

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | accès rapide pour agents IA et intervenants techniques |
| Source de vérité | Oui sur le périmètre IA |
| Documents liés | [MEMORY_CORE](./MEMORY_CORE.md), [project_structure_for_agents](./project_structure_for_agents.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Fichiers à ouvrir en premier selon le besoin

| Besoin | Fichier |
|---|---|
| comprendre la structure documentaire | `docs/01_project_reference/DOCUMENT_MAP.md` |
| connaître la source de vérité d’un sujet | `docs/01_project_reference/SOURCE_OF_TRUTH.md` |
| comprendre l’architecture système | `docs/01_project_reference/architecture/system_architecture.md` |
| comprendre la base de données | `docs/01_project_reference/architecture/database_architecture.md` |
| comprendre les endpoints | `docs/01_project_reference/backend/api_contracts.md` |
| comprendre les écrans et routes UI | `docs/01_project_reference/frontend/frontend_reference.md` |
| préparer un livrable Mission IV | `docs/02_contractual_and_reports/cps/CPS_MAPPING_PROJECT.md` et `rapport_provisoire_mission_iv_sad.md` |

## 2. Commandes projet utiles

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8011 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --port 3001
npm run build
```

## 3. Repères backend

| Sujet | Localisation |
|---|---|
| point d’entrée API | `backend/app/main.py` |
| agrégation des routes | `backend/app/api/api_v1.py` |
| routes v1 historiques | `backend/app/api/v1/` |
| scripts de refresh MV | `backend/scripts/refresh_mviews.py` |
| SQL performance / MV | `backend/sql/2026_04_mv_perf_pack.sql` |

## 4. Repères frontend

| Sujet | Localisation |
|---|---|
| routes UI | `frontend/src/App.tsx` |
| pages métier | `frontend/src/pages/` |
| pages admin | `frontend/src/pages/admin/` |
| composants réutilisables | `frontend/src/components/` |
| intégration API | `frontend/src/api/` |

## 5. Repères base de données

| Usage | Schémas à regarder |
|---|---|
| données d’exposition | `api`, `analytics` |
| gouvernance et paramétrage | `metadata`, `security`, `audit` |
| données métier | `geo`, `infra`, `hydro`, `meteo`, `qualite` |
| modèles et scénarios | `swat_output`, `swat_sebou`, `wasp_output`, `wasp_sebou`, `modeles` |
| historiques et imports | `staging` |

## 6. Documents à ne pas confondre

- `docs/01_project_reference/` : maître
- `docs/03_ai_knowledge_base/` : résumé agent
- `docs/04_working_prompts_and_runs/` : mémoire de fabrication
- `docs/99_legacy_archive/` : historique
