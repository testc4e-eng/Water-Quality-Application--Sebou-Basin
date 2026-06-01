# Implementation API cartographique metier P0

## Statut

`BACKEND_MAP_P0_READY_DEV`

## Fichiers crees/modifies

- `backend/app/api/v1/map.py`
- `backend/app/services/map_business_service.py`
- `backend/app/api/api_v1.py`

## Endpoints ajoutes

| Endpoint | Statut | Role |
|---|---|---|
| `GET /api/v1/map/catalog` | OK | catalogue métier hiérarchique groupes/supports |
| `GET /api/v1/map/entities` | OK | GeoJSON metier unifie via `group_code`/`support_code` ou legacy `support` |
| `GET /api/v1/map/entities/{id}` | OK | fiche entite |
| `GET /api/v1/map/entities/{id}/parameters` | OK P0 IDP | parametres disponibles |
| `GET /api/v1/map/entities/{id}/timeseries` | P1 placeholder | contrat reserve |
| `GET /api/v1/map/latest-values` | OK P0 IDP | dernieres valeurs |
| `GET /api/v1/map/classification` | OK | classification reglementaire unitaire |
| `GET /api/v1/map/layers` | OK | couches contexte MapLibre |

## Supports métier P0 exposés

| Groupe | Supports |
|---|---|
| `stations` | `forage`, `puits`, `point_prelevement`, `barrage`, `pluvio`, `source`, `hydro` |
| `inventaire_source_pollution` | `point_mesures` |
| `inventaire_mesures_pollution` | `point_prelevement` |

Compatibilité legacy conservée avec `legacy_support=true` :

- `idp_pollution`
- `barrages`
- `stations_qualite`
- `step`
- `rejets_industriels`
- `rejets_domestiques`

## Tests executes

Compilation :

- `python -m compileall backend/app/api/v1/map.py backend/app/services/map_business_service.py backend/app/api/api_v1.py`

Import FastAPI :

- 142 routes chargees.
- routes `/api/v1/map/*` montees.

Tests TestClient :

| Test | Resultat |
|---|---|
| `/api/v1/map/catalog` | 200 |
| `/api/v1/map/entities?support=idp_pollution&parameter_code=DBO5&limit=5` | 200, 5 features |
| `/api/v1/map/entities?group_code=stations&support_code=barrage&limit=5` | 200, 5 features |
| `/api/v1/map/entities?group_code=inventaire_source_pollution&support_code=point_mesures&limit=5` | 200, 5 features |
| `/api/v1/map/entities?group_code=inventaire_mesures_pollution&support_code=point_prelevement&limit=5` | 200, 5 features |
| `/api/v1/map/latest-values?support=idp_pollution&parameter_code=DBO5&limit=5` | 200, 5 lignes |
| `/api/v1/map/classification?parameter_code=DBO5&value=10&unit=mg/L` | 200, `CLASSIFIED` |
| `/api/v1/map/layers` | 200 |
| supports `barrages`, `stations_qualite`, `step`, `rejets_industriels`, `rejets_domestiques` | 200 |

## Limites P0

- `timeseries` reste volontairement en P1.
- `latest-values` complet est branche uniquement sur `idp_pollution`.
- Les supports STEP/rejets/barrages/stations sont exposes spatialement avec metadonnees minimales.
- Pas de cache backend dedie en P0.
- Pas de nouvelle vue SQL ni migration.

## Prochaine etape

Creer la page frontend isolee `/dashboard-carto-metier` avec :

- client `frontend/src/api/mapBusiness.ts`;
- hook `frontend/src/hooks/useMapBusiness.ts`;
- composants `frontend/src/components/DashboardMetier/*`;
- carte MapLibre basee sur le contrat `/api/v1/map/entities`.
