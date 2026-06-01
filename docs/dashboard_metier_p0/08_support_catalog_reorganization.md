# Réorganisation catalogue supports cartographiques P0

## Statut

`BACKEND_MAP_CATALOG_METIER_READY_DEV`

## Ancienne organisation

Les supports étaient exposés selon les noms techniques :

- `idp_pollution`
- `barrages`
- `stations_qualite`
- `step`
- `rejets_industriels`
- `rejets_domestiques`

Ces supports restent disponibles en compatibilité temporaire avec `legacy_support=true`.

## Nouvelle organisation métier

```text
Stations
  -> forage
  -> puits
  -> point_prelevement
  -> barrage
  -> pluvio
  -> source
  -> hydro

Inventaire sources pollution
  -> point_mesures

Inventaire mesures pollution
  -> point_prelevement
```

## Mapping technique connu

| Groupe | Support | Source backend | Statut |
|---|---|---|---|
| `stations` | `forage` | `api.v_station_dimension` filtre `type_station=forage` | `AVAILABLE` |
| `stations` | `puits` | `api.v_station_dimension` filtre `type_station=puits` | `AVAILABLE` |
| `stations` | `point_prelevement` | `api.v_source_pollution_prelevement` | `AVAILABLE` |
| `stations` | `barrage` | `api.v_barrage_dimension` | `AVAILABLE` |
| `stations` | `pluvio` | `api.v_station_dimension` filtre `type_station=pluviometrique` | `AVAILABLE` |
| `stations` | `source` | `api.v_station_dimension` filtre `type_station=source` | `AVAILABLE` |
| `stations` | `hydro` | `api.v_station_dimension` filtre `type_station=hydrologique` | `AVAILABLE` |
| `inventaire_source_pollution` | `point_mesures` | `api.v_pollution_sites` filtre `source_origin` IDP inventaire | `AVAILABLE` |
| `inventaire_mesures_pollution` | `point_prelevement` | `api.v_pollution_sites` filtre `source_origin` IDP mesures | `AVAILABLE` |

## Mapping technique manquant

Aucun support demandé n'est retourné en `NOT_YET_MAPPED` à cette étape. La structure du service prévoit toutefois `data_status = NOT_YET_MAPPED` si un futur support métier n'a pas encore de source backend fiable.

## Impacts frontend

Le futur dashboard `/dashboard-carto-metier` doit consommer :

- `GET /api/v1/map/catalog` pour construire la navigation métier ;
- `GET /api/v1/map/entities?group_code=...&support_code=...` pour charger les couches ;
- les anciens appels `support=...` uniquement en compatibilité ou debug.

Le menu ne doit plus afficher les noms techniques comme premier niveau.

## Endpoints testés

| Endpoint | Résultat |
|---|---|
| `GET /api/v1/map/catalog` | 200 |
| `GET /api/v1/map/entities?group_code=stations&support_code=barrage&limit=5` | 200, 5 features |
| `GET /api/v1/map/entities?group_code=inventaire_source_pollution&support_code=point_mesures&limit=5` | 200, 5 features |
| `GET /api/v1/map/entities?group_code=inventaire_mesures_pollution&support_code=point_prelevement&limit=5` | 200, 5 features |
| `GET /api/v1/map/entities?support=idp_pollution&limit=5` | 200, legacy |
| `GET /api/v1/map/entities?support=barrages&limit=5` | 200, legacy |

Contrôle complémentaire : tous les supports `stations` demandés répondent avec `200`.

## Limites P0

- La classification et les dernières valeurs restent principalement branchées sur les données IDP pollution.
- Les supports `stations` sont cartographiques et attributaires en P0 ; les séries temporelles restent P1.
- Les filtres typologiques reposent sur les valeurs existantes de `type_station`.
- Aucune donnée source n'a été modifiée.
