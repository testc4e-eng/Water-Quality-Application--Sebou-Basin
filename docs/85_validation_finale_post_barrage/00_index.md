# Validation finale post-barrage

## Contexte

Validation finale en lecture seule apres :

- deploiement de `hydro.mesure_barrage_param`
- bascule API/dashboard barrage
- harmonisation `APPORTS_HM3 -> APPORT`

Aucune ecriture DB destructive n'a ete executee pendant cette cloture.

## Livrables

| Fichier | Role |
|---|---|
| `01_controle_barrage_final.md` | controle final barrage parametrique et APPORT |
| `02_volumetrie_tables_finales.md` | volumetrie finale des schemas cibles |
| `03_controles_integrite_globale.md` | controles doublons/nulls/GEO/referentiel/scenarios |
| `04_classification_tables.md` | statut final par table/domaine |
| `05_backlog_final.md` | backlog final consolide |
| `06_decision_go_no_go_final.md` | decision GO / NO GO |
| `07_rapport_synthese_cloture.md` | synthese strategique de cloture |

## Decision

`FINAL_GO_AVEC_BACKLOG`

## Lecture rapide

| Classe | Resultat |
|---|---:|
| anomalies BLOQUANT | 0 |
| barrage final | OK |
| API/dashboard SQL | OK |
| schemas metier principaux exploitables | oui |
| backlog residuel | qualite, referentiel, IDP/GEO client, scenarios modeles, legacy |

