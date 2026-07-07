# Corrections appliquées — Dashboard Accueil DG

## 1. Backend — Instrumentation et logs

### Fichier : `backend/app/services/dashboard/home_service.py`

- Ajout d’un logger (`logging.getLogger(__name__)`).
- Mesure de la durée totale de `get_dashboard_home`.
- Log structuré à la fin de chaque construction de payload :
  - durée totale (ms)
  - nombre de requêtes SQL
  - temps cumulé des requêtes SQL (ms)
  - métriques par section (`duration_ms`, `query_count`, `query_time_ms`, `status`)

Cela permet de suivre précisément l’évolution des temps sans modifier le contrat API.

## 2. Backend — Cache des dépendances transverses

### Fichier : `backend/app/services/dashboard/home_service.py`

Ajout d’un cache module-level (`_DEP_CACHE`) pour les ressources coûteuses mais stables sur une fenêtre de quelques secondes :

- `_latest_dates` : les 4 dates de dernière mesure
- `_layer_counts` : les comptages de stations/barrages par couche
- `_quality_regulatory_context` : le contexte réglementaire qualité

Avantages :
- Évite de relancer ces requêtes à chaque section qui les réutilise (`hero`, `map`, `basin_status`, `trends`, `secondary_kpis`).
- Partagé entre requêtes concurrentes pendant la durée du cache (120 s par défaut, configurable via `SAD_DASHBOARD_HOME_CACHE_SECONDS`).
- Invalidé automatiquement par `warm_dashboard_home_cache(force=True)`.

## 3. Backend — Optimisation requête pluie

### Fichier : `backend/app/services/dashboard/home_service.py`

`_build_rainfall_status` a été réécrit en un seul scan de `api.v_meteo_precipitation_journalier_qa` avec des agrégats conditionnels (`FILTER`) :

```sql
select
    avg(val_remplies) filter (where bucket_day = :latest_day)::double precision as cumul_24h,
    avg(val_remplies) filter (where bucket_day > cast(:latest_day as date) - interval '7 days')::double precision as cumul_7j,
    avg(val_remplies) filter (where bucket_day > cast(:latest_day as date) - interval '30 days')::double precision as cumul_30j,
    count(distinct station_id) filter (where bucket_day = :latest_day)::int as station_count
from api.v_meteo_precipitation_journalier_qa
where bucket_day > cast(:latest_day as date) - interval '30 days'
  and bucket_day <= :latest_day
  and val_remplies is not null
```

Avant : 3 CTE scannaient séparément 24h, 7j et 30j.  
Après : un seul parcours de la fenêtre 30j.

## 4. Backend — Comptage qualité borné

### Fichier : `backend/app/services/dashboard/home_service.py`

Le comptage des stations sentinelles qualité utilise désormais la date du dernier jour disponible :

```sql
select count(distinct station_id)
from qualite.mesure_qualite_sebou
where temps::date = :latest_day
```

Fallback sur les 30 derniers jours si `latest_day` est indisponible.

## 5. Frontend — Affichage immédiat du layout

### Fichier : `frontend/src/pages/DashboardHomeV2.tsx`

- Suppression du skeleton pleine page opaque.
- Pendant le chargement, la page affiche maintenant le **layout complet** avec des placeholders animés par bloc :
  - hero
  - carte opérationnelle
  - état du bassin / confiance / tendances
  - cartes récapitulatives
  - cartes signaux
  - footer métadonnées
- Le message de chargement prolongé apparaît après 5 s comme avant, mais l’utilisateur voit désormais la structure de la page en moins d’une seconde.

## 6. Frontend — Timeouts et contrôle des appels

### Fichiers modifiés

- `frontend/src/api/dashboardHome.ts`
- `frontend/src/hooks/useDashboardHome.ts`
- `frontend/src/api/dashboardRuntime.ts`
- `frontend/src/hooks/useDashboardRuntime.ts`

Mesures appliquées :
- `getDashboardHome`, `getQualityStationsWithTimeseries`, `getDashboardTrends` acceptent un `AbortSignal` et définissent un timeout de **10 s**.
- `useDashboardHome`, `useQualityStationsWithTimeseries`, `useDashboardRuntimeTrends` passent le `signal` à leurs `queryFn`.
- Désactivation des retries (`retry: false`) et du refetch au focus de fenêtre (`refetchOnWindowFocus: false`) pour éviter les appels répétés qui prolongent le skeleton.

## 7. Non réalisé dans ce passage (hors périmètre)

- Optimisation de la chaîne KPI/propagation pollution : le gain le plus important, mais il touche `app/services/kpi/engine.py` et `app/services/propagation/propagation_pollution_service.py`, qui servent aussi d’autres dashboards. Il faut le traiter dans un chantier dédié.
- Refonte complète du payload en plusieurs endpoints : coûteuse et risquée ; reportée.
- Ajout d’indexes SQL : dépend du DBA / environnement cible.

---

*Les modifications restent strictement limitées au dashboard Accueil DG et à ses dépendances directes.*
