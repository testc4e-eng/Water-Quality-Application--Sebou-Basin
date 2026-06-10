# Endpoints Expérimentaux (API Qualité Unifiée)

Dans le cadre de la bascule progressive, trois nouvelles routes ont été créées dans `backend/app/routers/quality.py`. Elles s'appuient exclusivement sur la vue unifiée `api.v_qualite_dashboard_unifiee` et `api.v_station_dimension`.

## 1. `GET /api/v1/quality/unified/stations`

**Description** : Retourne la liste des stations avec leurs métadonnées consolidées et les agrégats de mesures (date de première/dernière mesure, nombre total de mesures, nombre de paramètres).
**Paramètres** :
- `support_type` (optionnel) : Permet de filtrer par type (ex: `SENTINELLE`, `RIVIERE`, `BARRAGE`, `BARRAGE_GARDE`).

## 2. `GET /api/v1/quality/unified/parameters`

**Description** : Retourne la liste des paramètres de qualité disponibles, avec les statistiques globales d'utilisation par les stations.
**Paramètres** :
- `support_type` (optionnel) : Filtre les paramètres par support.

## 3. `GET /api/v1/quality/unified/timeseries`

**Description** : Récupère l'historique brut des mesures (timeseries).
**Paramètres** :
- `support_type` (optionnel)
- `ire_station` (optionnel)
- `parametre_qualite` (optionnel)
- `limit` (défaut : 100)
