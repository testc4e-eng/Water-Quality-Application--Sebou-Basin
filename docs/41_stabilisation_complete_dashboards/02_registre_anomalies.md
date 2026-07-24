# 02  Registre anomalies

| ID | Dashboard | Fonction | Symptôme | Cause | Priorité | Correction | Test | Statut |
|---|---|---|---|---|---|---|---|---|
| STAB-01-HOME-001 | Accueil DG | Chargement initial | Chargement prolongé, risque d'écran erreur à froid | Construction `/dashboard/home` trop lente, alertes/actions Home dépendantes de moteurs KPI lourds | P0 | Alertes/actions Home dérivées des données déjà disponibles au lieu d'appeler les moteurs lourds `list_alerts` / `list_recommendations` | `frontend/e2e/01-home-dashboard.spec.ts` | Corrigé |
| STAB-01-HOME-002 | Accueil DG | Stations qualité Home | Erreur API secondaire sur stations avec timeseries | Requête `runtime_service` accédait à `admin.communes` sans droit `sad_app` | P1 | Suppression du `LEFT JOIN LATERAL admin.communes`; commune/province restent `NULL` pour le Home | Endpoint `/api/v1/quality/stations-with-timeseries?limit=6` => 200 | Corrigé |
| STAB-01-HOME-003 | Accueil DG | Validation backend locale | `pytest` local crash avant exécution Home | Crash NumPy Windows connu lors de l'import `analysis_service` | P2 | Non corrigé dans ce lot ; validation runtime conteneur + `py_compile` utilisée | `docker exec sad-backend python -m py_compile ...` | Réserve |
| STAB-01-HOME-004 | Accueil DG | Build frontend | Warning Vite chunk > 500 kB | Bundle existant volumineux | P3 | Non traité avant démo | `npm run build` OK avec warning | Réserve |

