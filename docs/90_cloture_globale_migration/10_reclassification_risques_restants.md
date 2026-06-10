# Reclassification risques restants

## Statut

`POST_MIGRATION_CONSOLIDATION`

Cette reclassification acte que les sujets ci-dessous ne relèvent plus de la migration historique. Ils basculent vers gouvernance, ingestion future, exposition API/frontend ou enrichissement progressif.

## Reclassifications officielles

| Sujet | Ancien statut | Nouveau statut | Justification | Action |
|---|---|---|---|---|
| Evaporation nulles | `QA_WARNING` | `QA_ACCEPTED_SOURCE_GAP` | donnees client, aucune interpolation validee, non bloquant | conserver nulls, filtrer/afficher warning |
| Temperature | `DONNEE_NON_FOURNIE` → **RÉSOLU** | `COMMITTED` | ingestion exécutée le 2026-05-25 (437 889 lignes, 36 stations) | maintenance et QA continue |
| Nappes non resolues | `CLIENT_REQUIRED` | `OPTIONAL_GEO_ENRICHMENT` | donnees exploitables sans rattachement complet | enrichissement spatial progressif |
| Profils nappe | `CLIENT_REQUIRED` | `CONSULTATION_ONLY` | faible usage analytique, usage documentaire | exposition consultation si utile |
| Unites manquantes | `BACKLOG_REFERENTIEL` | `BACKLOG_GOUVERNANCE` | gouvernance continue du referentiel | validation Yassine/C4E |
| `table_cible` manquantes | `BACKLOG_REFERENTIEL` | `BACKLOG_ARCHITECTURE_REFERENTIEL` | choix d'exposition/API, pas correction donnees | definir vues/API candidates |

## Impacts

| Axe | Impact |
|---|---|
| Migration historique | aucun blocage |
| Dashboards | afficher warnings/lacunes, ne pas masquer les donnees resolues |
| IA/LLM | utiliser statut QA/GEO pour pondérer ou exclure |
| Ingestion future | gerer ces classes au chargement, pas en post-correction |

## Decision

La migration reste cloturee. Ces risques sont gouvernes dans le cycle post-migration.
