# Rapport consolidation spatiale DEV - IDP pollution

Date execution : 2026-05-18

Script execute : `scripts/idp_pollution/build_spatial_consolidation.py --execute`.

## Objets generes

- `geo.v_existing_pollution_spatial_sources`
- `geo.v_idp_spatial_sources`
- `qa.v_spatial_site_candidates`

## Statistiques candidats

| Type candidat | Geometrie | Revue requise | Nombre |
|---|---|---:|---:|
| `NEW_SITE` | `OK` | oui | 9593 |
| `REUSE_EXISTING_SITE_EXACT` | `OK` | non | 1929 |
| `GEOMETRY_MISSING` | `MISSING` | oui | 311 |
| `REUSE_EXISTING_SITE_EXACT` | `OK` | oui | 290 |
| `POSSIBLE_EXISTING_SITE` | `OK` | oui | 242 |

## Lecture operationnelle

- 1929 rattachements exacts sont reutilisables en DEV.
- 9593 candidats nouveaux ne doivent pas etre charges en production sans arbitrage metier.
- 311 candidats sont bloques par geometrie manquante.
- La vue `qa.v_spatial_site_candidates` est disponible pour prioriser les arbitrages et alimenter les lots de validation.
