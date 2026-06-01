# Priorisation implementation

| Module | Complexite | Valeur metier | Risque | Priorite |
|---|---|---|---|---|
| Repository generic `api.*` views | Moyenne | Tres forte | Faible si whiteliste | P0 |
| Endpoint `/api/v1/qualite/metaux` | Faible | Forte | Faible | P0 |
| Endpoint `/api/v1/qualite/pollution-organique` | Faible | Forte | Faible | P0 |
| Endpoint `/api/v1/qualite/chimie-minerale` | Moyenne | Forte | Moyen, unites mixtes | P0 |
| Endpoint `/api/v1/qualite/physicochimie` | Faible | Forte | Faible | P0 |
| Endpoint `/api/v1/meteo/precipitation` | Moyenne | Forte | Moyen, volumetrie | P1 |
| Endpoint `/api/v1/hydro/barrages/parametres` | Faible | Forte | Faible | P1 |
| Endpoint `/api/v1/hydro/barrages/qualite` | Faible | Moyenne | Faible | P1 |
| Endpoint `/api/v1/qualite/microbiologie` | Faible | Moyenne | Faible | P1 |
| Endpoint `/api/v1/qualite/terrain` | Moyenne | Moyenne | Double classification `T_AIR` | P1 |
| Endpoint `/api/v1/pollution/analyses-finales` | Moyenne | Forte | Donnees non numeriques a flagger | P1 |
| Endpoint `/api/v1/idp/points` | Moyenne | Forte | GEO status | P1 |
| Front pilote Metaux | Moyenne | Forte | Faible | P1 |
| Front Pollution / IDP | Forte | Forte | GEO et mocks existants | P2 |
| Deprecation `/quality/*` legacy | Moyenne | Moyenne | Regression possible | P2 |
| Refactor `/observatory/parameter/*` | Forte | Forte | Dispatcher complexe | P2 |
| Ingestion V1 | Forte | Tres forte | Hors phase courante | P3 |

## Ordre recommande

1. Backend repository + schema response standard.
2. Endpoints qualite P0.
3. Tests backend P0.
4. Front pilote Metaux.
5. Météo précipitation et barrage paramètres.
6. Pollution / IDP.
7. Refactor observatory et legacy.

## Critère de passage à la phase suivante

- Endpoint retourne le format standard.
- Count cohérent avec la vue source.
- Filtres date/support/paramètre validés.
- Front utilise uniquement l'endpoint spécialisé.
- Pas de régression sur l'ancien endpoint.
