# Plan backend implementation

## Objectif

Implémenter `GET /api/v1/dashboard/home` sans recréer les moteurs existants.

## Fichiers recommandés

### Router

- `backend/app/api/v1/dashboard.py`

### Service agrégateur

- `backend/app/services/dashboard/home_service.py`

## Réutilisations obligatoires

### KPI

- `backend/app/api/v1/kpi.py`
- `backend/app/services/kpi/engine.py`

### Alertes

- `backend/app/api/v1/alerts.py`
- `backend/app/services/alerts/engine.py`

### Recommandations

- `backend/app/api/v1/recommendations.py`
- `backend/app/services/recommendations/engine.py`

### Barrages / pluie / température

- `backend/app/routers/observatory.py`

### Carte

- `backend/app/api/v1/map.py`
- `backend/app/services/map_business_service.py`

## Stratégie d'agrégation

1. calculer la fraîcheur par famille ;
2. construire le `hero` ;
3. préparer la config `map` ;
4. agréger `basin_status` ;
5. reprendre les alertes moteur existant et les limiter à `5` ;
6. reprendre les recommandations moteur existant et les limiter à `5` ;
7. produire les tendances courtes ;
8. réinjecter les KPI DG dans `secondary_kpis`.

## Points de vigilance

- ne pas recalculer l'hydraulique ;
- ne pas dupliquer la logique KPI ;
- ne pas appeler les endpoints HTTP internes si l'import de service est plus propre ;
- garder la règle température explicitement dans `metadata`.

## Smoke tests backend

- endpoint `200`
- payload complet
- aucune exception si une sous-section est partiellement indisponible
- `status=partial` autorisé si le contrat est respecté

## Implémentation réalisée

- router créé : `backend/app/api/v1/dashboard.py`
- service agrégateur créé : `backend/app/services/dashboard/home_service.py`
- package créé : `backend/app/services/dashboard/__init__.py`
- montage ajouté dans `backend/app/api/api_v1.py`

## Stratégie technique réellement appliquée

- agrégation directe par service Python sur la session SQLAlchemy ;
- réutilisation directe des moteurs existants :
  - `get_overview_kpis`
  - `list_alerts`
  - `list_recommendations`
- aucune recréation HTTP interne des endpoints KPI/alertes/recommandations ;
- `safe_section` avec `rollback()` pour isoler les erreurs SQL par sous-section ;
- fallback contrôlé section par section pour respecter le contrat JSON.

## Validation réelle

- `python -m pytest tests/test_dashboard_home_v2.py -q` : `10 passed`
- validation Docker : `GET /api/v1/dashboard/home` répond `200`
- payload Docker validé en `status=success`

## Optimisation performance 2026-06-04

- cache mémoire court ajouté dans `backend/app/services/dashboard/home_service.py`
- variable d’environnement : `SAD_DASHBOARD_HOME_CACHE_SECONDS`
- valeur par défaut : `120`
- désactivation possible : `0`
- mutualisation interne ajoutée pour :
  - `latest_dates`
  - `layer_counts`
  - contexte réglementaire qualité
- réduction des requêtes directes `home_service` d’environ `44` à `17`
- contrat JSON inchangé
