# Tables legacy

## LEGACY_READ_ONLY

| Objet | Decision |
|---|---|
| `hydro.mesure_barrage` | conserver en lecture seule tant que les dashboards/API barrage restent sous surveillance |

## LEGACY_IGNORE

| Objet | Decision |
|---|---|
| `public.*` historiques | ne pas utiliser comme source de production |
| `staging.*` | conserver pour audit/reprise, pas exposition finale |

## LEGACY_MODELING_TO_REPLACE

| Objet | Decision |
|---|---|
| `swat_output.*` courant | temporaire, a remplacer par futur jeu client/modelisation |
| `wasp_output.*` courant | temporaire, a remplacer par futur jeu client/modelisation |

## Regle

Aucune suppression n'est autorisee dans cette cloture. Toute suppression future devra faire l'objet d'un plan de backup, validation, rollback et decision client/C4E.

