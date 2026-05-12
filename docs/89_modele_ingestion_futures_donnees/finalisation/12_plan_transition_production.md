# Plan transition production

## Phases

| Phase | Objectif | Sortie |
|---|---|---|
| 1 | stabiliser referentiel et alias | gaps unites/table cible reduits |
| 2 | construire ingestion qualite | batch test qualite publie |
| 3 | construire ingestion GEO/IDP | quarantaines client standardisees |
| 4 | construire ingestion meteo/hydro | mise a jour incrementalisee |
| 5 | construire ingestion SWAT/WASP | nouveaux jeux versionnes |
| 6 | dashboard ingestion | suivi batch/erreurs |
| 7 | gouvernance | workflow validation operationnel |

## Readiness actuelle

| Axe | Etat |
|---|---|
| referentiel canonique | pret avec backlog |
| qualite historique | cloturee |
| barrage | pret |
| GEO/IDP | client required |
| SWAT/WASP | a remplacer |
| audit/backup | disponible mais a industrialiser |

## Prochaine action recommandee

Specifer le schema `ingestion` et implementer un premier pipeline qualite avec quarantaine, alias et rollback.
