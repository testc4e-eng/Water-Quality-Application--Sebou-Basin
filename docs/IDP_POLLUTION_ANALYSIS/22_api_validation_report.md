# Rapport validation API DEV - IDP pollution

Date execution : 2026-05-18

## Vues SQL testees

| Vue | Nombre lignes | Statut |
|---|---:|---|
| `api.v_pollution_sites` | 1951 | OK |
| `api.v_pollution_latest_results` | 517 | OK |

## Performance observee

| Requete | Temps observe |
|---|---:|
| `SELECT * FROM api.v_pollution_sites LIMIT 100` | 12.056 ms |
| `SELECT * FROM api.v_pollution_latest_results WHERE parameter_code IN (...) LIMIT 100` | 12.729 ms |

## Endpoint FastAPI ajoute

| Endpoint | Source | Test |
|---|---|---|
| `GET /api/v1/pollution/sites.geojson` | `api.v_pollution_sites` + derniers resultats P0 | 200 OK |
| `GET /api/v1/pollution/latest-results` | `api.v_pollution_latest_results` | 200 OK |

## Filtres disponibles

- `parameter_code`
- `source_type_code`
- `commune`
- `limit`

## Points de vigilance

- `api.v_pollution_latest_results` contient actuellement `DBO5`, `DCO`, `MES` et une ligne sans code parametre ; `NH4` et `NO3` restent absents tant que les alias ne sont pas valides dans le referentiel.
- Les vues sont suffisantes pour un premier affichage MapLibre DEV.
