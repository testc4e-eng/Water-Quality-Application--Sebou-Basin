# Roadmap post-migration

## Statut

`ROADMAP_POST_MIGRATION_VALIDATION_REQUISE`

## Phases

| Phase | Chantier | Objectif | Sortie |
|---|---|---|---|
| 1 | gouvernance referentiel | valider 39 unites et 65 `table_cible` | referentiel v2 pret ingestion |
| 2 | pipeline qualite | ingestion fichiers qualite + alias + QA | batch qualite pilote |
| 3 | pipeline meteo | temperature, evaporation, precipitation | meteo incrementalisee |
| 4 | pipeline hydrologie | debits et barrage parametrique | hydro incrementalise |
| 5 | pipeline GEO/IDP | points non resolus + statuts GEO | couche progressive IDP |
| 6 | pipeline SWAT/WASP | remplacement jeux legacy | scenarios versionnes |
| 7 | API exposition | vues et endpoints minimaux | backend FastAPI stabilise |
| 8 | dashboards ingestion | suivi batch, quarantine, erreurs | cockpit ingestion |
| 9 | validation metier continue | workflow C4E/client | decisions tracables |
| 10 | industrialisation production | jobs, monitoring, rollback | ingestion v1 production |

## Backlog gouvernance prioritaire

| Sujet | Priorite |
|---|---|
| valider unites probables | P1 |
| arbitrer unites ambigues `FM`, `F_M_MES`, `S`, `S2` | P1 |
| definir `table_cible` via vues/API | P1 |
| implementer statuts GEO progressifs | P1 |
| specifier schema `ingestion` | P1 |
| remplacer SWAT/WASP legacy | P2 |

## Readiness ingestion v1

| Axe | Etat |
|---|---|
| referentiel canonique | pret avec backlog gouvernance |
| alias qualite | utilisable |
| barrage | pret |
| meteo temperature | pipeline a implementer |
| GEO/IDP | strategie progressive prete |
| SWAT/WASP | transition definie, remplacement requis |
| API/frontend | vues/API candidates proposees |

## Prochaine action

Valider le schema `ingestion` et implementer le pipeline pilote qualite + quarantine + audit rollback.
