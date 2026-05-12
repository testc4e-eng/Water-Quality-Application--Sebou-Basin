# API for Agents

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | synthèse agent de l'API FastAPI réellement observée |
| Source de vérité | Non, résumé contrôlé |
| Documents liés | [../00_SOURCE_OF_TRUTH_MASTER.md](../00_SOURCE_OF_TRUTH_MASTER.md), [../01_project_reference/backend/backend_overview.md](../01_project_reference/backend/backend_overview.md), [../01_project_reference/backend/api_contracts.md](../01_project_reference/backend/api_contracts.md) |
| Dernière mise à jour | 2026-05-08 |

## Base

- Préfixe global : `/api/v1`
- Santé service : `GET /health`
- Docs OpenAPI : `/docs`

## Groupes de routes réellement montés

### Auth

- `/api/v1/auth/*`

### Référentiels et accès station-centric

- `/api/v1/stations/*`
- `/api/v1/measurements/*`
- `/api/v1/entities/*`
- `/api/v1/names/*`
- `/api/v1/meta/*`

Attention : ces groupes existent côté montage FastAPI, mais une partie d’entre eux dépend encore de références SQL legacy ou absentes (`public.*`, `api.v_station_dimension`).

### Géospatial et couches

- `/api/v1/geojson/*`
- `/api/v1/layers/*`
- `/api/v1/layers/configs/*`

### Administration et sécurité

- `/api/v1/users/*`
- `/api/v1/security/*`
- `/api/v1/admin/data-availability/*`
- `/api/v1/admin/password-reset-requests/*`
- `/api/v1/admin/users/*`
- `/api/v1/raw/*`

### Dashboards métier

- `/api/v1/climate/*`
- `/api/v1/hydro/*`
- `/api/v1/quality/*`
- `/api/v1/observatory/*`
- `/api/v1/analytics/*`
- `/api/v1/alerts/*`

### Modèles et ingestion

- `/api/v1/swat/*`
- `/api/v1/ingestion/*`

### SWAT analysis

- routeur monté depuis `swat_analysis.py`
- risque de préfixe effectif doublé : `/api/v1/api/v1/swat/analysis/*`

## Règles d’usage pour agents

- Utiliser `backend_overview.md` et `00_SOURCE_OF_TRUTH_MASTER.md` pour la vérité de l’API réellement déployée.
- Utiliser `api_contracts.md` comme spécification cible ou backlog, pas comme photographie garantie du déployé.
- Se méfier des groupes `quality`, `stations`, `measurements` et `entities` tant que les références backend legacy `public.*` n’ont pas été purgées.
- Pour tout besoin de cartographie ou d’observatoire, privilégier d’abord les groupes `layers`, `observatory`, `analytics`, `climate`, `hydro` et `raw`, qui sont mieux alignés avec la réalité observée.
- Pour les barrages, les métriques `niveau_barrage`, `volume_barrage`, `lacher_barrage`, `apport` et `transfert` sont servies depuis `hydro.mesure_barrage_param` via les endpoints `/api/v1/observatory/barrage/*`.
- Ne jamais réinterpréter un volume journalier barrage en débit sans règle hydraulique validée; la référence métier est `Mm3/j` pour `LACHER`, `APPORT` et `TRANSFERT`.
- `apports_hm3` reste accepte comme alias API de compatibilite et se resout vers `APPORT`.
- `lacher_m3s` est un alias legacy rejete et ne doit pas etre utilise comme contrat metier API/dashboard.
