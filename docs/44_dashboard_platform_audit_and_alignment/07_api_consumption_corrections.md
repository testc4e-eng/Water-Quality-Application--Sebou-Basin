# Corrections de consommation API

## Corrections obligatoires P0
| Sujet | État | Correction |
|---|---|---|
| `type_eau` | Backend officiel `surface_generale` | Afficher dans tous les dashboards qualité |
| `water_type` | deprecated | Ne pas l’utiliser côté frontend; si réponse warning, l’afficher |
| `NON_CLASSIFIABLE` | Partiellement affiché | Badge dédié, pas simple “sans classe” |
| `HORS_PERIMETRE_REGLEMENTAIRE` | À afficher | Badge dédié + exclusion qualité globale |
| `TYPE_EAU_NON_OPERATIONNEL` | À afficher | Message bloquant si type documentaire demandé |
| `PARAMETRE_NON_REGLEMENTAIRE` | Backend disponible | Afficher comme non classable |
| Version réglementaire | Disponible API | Header permanent dans dashboards qualité |
| Seuils inactifs | Exclus par défaut | Ne jamais les afficher en opérationnel |
| Température batch | Disponible DB | Afficher batch et période |
| Hydraulique | Non validée | Badge `TOPOLOGIQUE_NON_SCIENTIFIQUE` |

## Dashboard cartographique métier
Utiliser exclusivement :
- `/api/v1/map/catalog`
- `/api/v1/map/entities`
- `/api/v1/map/latest-values`
- `/api/v1/map/classification`

Ne pas afficher les supports legacy comme navigation principale.

## Pollution IDP
Utiliser :
- `/api/v1/pollution/sites.geojson`
- `/api/v1/pollution/latest-results`

Conditions :
- DEV uniquement tant que spatial identity PREPROD n’est pas validée.
- Statuts réglementaires dans popup.
- Non classifiable explicite.

## Qualité spécialisée
Utiliser :
- `/api/v1/qualite/metaux`
- `/api/v1/qualite/chimie-minerale`
- `/api/v1/qualite/physicochimie`
- `/api/v1/qualite/pollution-organique`

Ne pas fusionner `MO` et `Mo`.

## Hydraulique / routing
Utiliser :
- `/api/v1/routing/topology-qa`
- `/api/v1/routing/downstream-to-garde`

Mais afficher :
- `hydraulic_direction_validated=false`
- `direction_validated=false`
- `scientific_mode=topology_visual_demo`
- pas de temps d’arrivée scientifique.

## Points à corriger dans le code plus tard
- `DashboardClimate.tsx` doit être réparé ou retiré de la navigation préprod.
- Les composants legacy doivent éviter les appels `/stations/{id}/measurements` si la source spécialisée existe.
- Les labels frontend doivent utiliser “Données en validation” pour IDP et “Hydraulique non validée” pour le routing.
