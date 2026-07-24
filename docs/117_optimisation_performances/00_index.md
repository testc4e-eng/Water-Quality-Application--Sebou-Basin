# 117 — Optimisation des performances de chargement

**Contexte** : les lenteurs de chargement des dashboards étaient un bloqueur
identifié depuis la passation du 23/06 (latence `GET /api/v1/dashboard/home`
mesurée à 41,6 s). Passe de stabilisation pré-livraison du 2026-07-24.

## Mesures baseline (2026-07-24, stack Docker locale, port 8010)

| Endpoint | Baseline à froid | Baseline à chaud | Cause identifiée |
|----------|-----------------:|-----------------:|------------------|
| `GET /api/v1/dashboard/home` | 23,9 s | 0,01 s (cache TTL 120 s) | Reconstruction complète (~20-40 s) repayée par le premier visiteur après **chaque** expiration du cache (toutes les 2 min) |
| `GET /api/v1/stations` | 14,6 s | **14,6 s (aucun cache)** | Filtre `with_data=True` (défaut) : `SELECT DISTINCT trim(...)` + `UNION` sur 3 tables de mesures volumineuses (débit, température, qualité) à **chaque** appel |

## Correctifs appliqués

### 1. `dashboard/home` — stale-while-revalidate
`backend/app/services/dashboard/home_service.py` :

- `_cache_get` ne supprime plus l'entrée expirée ;
- nouvelle fonction `_cache_get_stale` + `_trigger_background_refresh` ;
- `get_dashboard_home` sert le payload expiré **immédiatement** et relance la
  reconstruction dans un thread dédié (anti-avalanche via le flag
  `_HOME_WARMING` existant, session `ClimateSessionLocal` propre).

Résultat : après le warm-up initial (déjà déclenché au démarrage par
`warm_dashboard_home_cache`), **plus aucun utilisateur n'attend la
reconstruction** — le coût de ~24 s est toujours payé par un thread
d'arrière-plan, jamais par une requête.

### 2. `/stations` — cache en mémoire (TTL 600 s)
`backend/app/api/v1/stations.py` : cache module keyé `(limit, with_data)`,
TTL 600 s surchargeable via `SAD_STATIONS_CACHE_SECONDS` (0 = désactivé).
La liste des stations avec mesures évolue rarement — un TTL long est sans
risque métier.

## Mesures après correctif (vérifiées en live, uvicorn --reload)

| Endpoint | Avant | Après |
|----------|------:|------:|
| `/stations` (2e appel et suivants) | 14,6 s | **0,01 s** |
| `/dashboard/home` (cache chaud) | 0,01 s | 0,01 s (inchangé) |
| `/dashboard/home` (après expiration TTL) | ~24 s | **~0,03 s** (stale servi, refresh en arrière-plan) |

## Pistes non traitées (hors périmètre de cette passe)

- Vue matérialisée `station_avec_donnees` côté DB pour remplacer le scan
  UNION (élimine aussi le premier appel à 14 s après redémarrage) — demande
  une gestion de refresh, à planifier hors gel de stabilisation.
- Latences des autres dashboards (qualité 49 s historique) : correctifs
  timeout/retry déjà appliqués dans les commits `4d0e5d3`/`44d000a` ;
  re-profilage recommandé après la présente passe.
