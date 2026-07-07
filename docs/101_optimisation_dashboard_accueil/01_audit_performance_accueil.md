# Audit performance — Dashboard Accueil DG

## Objectif

Identifier pourquoi l’endpoint `GET /api/v1/dashboard/home` met plusieurs dizaines de secondes à répondre et bloque l’affichage de la page d’accueil.

## Méthodologie

- Lecture du code backend : `backend/app/services/dashboard/home_service.py` (≈ 1 300 lignes).
- Analyse des sections `_build_*` et des requêtes SQL exécutées.
- Analyse des appels externes (KPI, alertes, recommandations, propagation pollution).
- Analyse du frontend : `frontend/src/pages/DashboardHomeV2.tsx`, `useDashboardHome`, `dashboardHome.ts`, `useDashboardRuntime`.

## Architecture de l’endpoint

`GET /dashboard/home` construit un payload unique contenant 9 sections :

| Section | Fichier | Coût estimé |
| --- | --- | --- |
| `data_freshness` | `home_service.py:337` | 4 `MAX` simples → faible |
| `hero` | `home_service.py:362` | Réutilise dates/comptages → faible |
| `map` | `home_service.py:451` | Métadonnées + comptages → faible |
| `basin_status` | `home_service.py:490` | 4 requêtes sur vues journalières → moyen |
| `alerts` | `home_service.py:777` | Appel `list_alerts` → moyen à élevé |
| `recommended_actions` | `home_service.py:869` | Appel `list_recommendations` → élevé |
| `trends` | `home_service.py:918` | 4 séries 30 jours → moyen |
| `secondary_kpis` | `home_service.py:1049` | Appel `get_overview_kpis` → **très élevé** |
| `metadata` | `home_service.py:1082` | Statique → négligeable |

## Goulots d’étranglement identifiés

### 1. Chaîne KPI / alertes / recommandations / propagation (dominant)

Les sections `alerts`, `recommended_actions` et `secondary_kpis` ne sont pas implémentées directement dans `home_service.py` : elles appellent :

- `list_alerts(db, limit=20)` → `get_station_kpis`, `get_pollution_kpis`, `get_subbasin_kpis`, `get_overview_kpis`
- `list_recommendations(db, limit=10)` → `list_alerts(limit=100)`, `get_overview_kpis`, `get_station_kpis`, `get_pollution_kpis`
- `get_overview_kpis(db)` → `get_station_kpis`, `get_subbasin_kpis`, `get_pollution_kpis`

Le coût dominant vient de `get_pollution_kpis` dans `app/services/kpi/engine.py` :

- Charge ~20 sites de pollution.
- Pour les 6 principaux sites, effectue **3 appels de propagation** (`propagate_source_to_garde`, `propagate_to_stations`, `propagate_to_barrages`).
- Chaque propagation charge le graphe hydro `geo_work.reseau_hydro_edges_final_candidate_20260602` et effectue un `CROSS JOIN LATERAL` de plus-proche-arête.
- Total : ~18 traversées de graphe + 18 jointures spatiales par requête froide.

Ces appels utilisent une connexion psycopg2 brute et **ne sont pas instrumentés** par les compteurs de `home_service.py`.

### 2. Requête pluie à triple scan

`_build_rainfall_status` utilise 3 CTE (`latest`, `rolling_7`, `rolling_30`) qui scannent 3 fois la vue `api.v_meteo_precipitation_journalier_qa` sur 30 jours.

### 3. Comptage qualité non borné

```sql
select count(distinct station_id) from qualite.mesure_qualite_sebou;
```

Effectué sans prédicat de date.

### 4. Frontend bloquant

`DashboardHomeV2.tsx` affichait un skeleton pleine page tant que `homeQuery.data` n’était pas disponible. L’utilisateur ne voyait aucun layout pendant tout le temps de réponse backend.

### 5. Absence de timeout côté frontend

`getDashboardHome()` n’avait pas de timeout ni d’`AbortSignal`. En cas de backend très lent, le navigateur attendait indéfiniment.

## Mesures déjà en place

- `home_service.py` dispose d’un cache module-level de 120 s sur le payload final (`HOME_CACHE_KEY`).
- Des fallbacks par section existent (`_fallback_*`).
- Un mécanisme de profiling interne compte les requêtes SQL et leur temps (mais ne loggeait pas).

## Bilan

La lenteur principale provient de la **chaîne KPI/propagation pollution** appelée par `secondary_kpis`, `alerts` et `recommended_actions`. La page reste ensuite bloquée en skeleton pleine page en attendant le payload complet.

---

*Fichiers d’analyse :*
- `backend/app/services/dashboard/home_service.py`
- `backend/app/services/kpi/engine.py`
- `backend/app/services/propagation/propagation_pollution_service.py`
- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/hooks/useDashboardHome.ts`
