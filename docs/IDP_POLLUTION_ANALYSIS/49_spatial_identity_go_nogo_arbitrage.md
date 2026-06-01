# GO/NOGO arbitrage identite spatiale

Date : 2026-05-19  
Statut : `GO_REVUE_METIER_DEV`, `NOGO_PREPROD`.

## Volumes QA charges

| Objet | Volume |
|---|---:|
| Candidats QA | 14380 |
| Conflits QA | 14366 |
| Orphelins QA | 590 |
| Decisions metier | 0 |

## Lots prets a revue

| Lot | Fichier | Volume |
|---|---|---:|
| STEP/STM | `batch_01_step_stm.csv` | 106 |
| Rejets | `batch_02_rejets.csv` | 543 |
| Huileries | `batch_03_huileries.csv` | 1155 |
| Mines/decharges | `batch_04_mines_decharges.csv` | 348 |
| IDP mesure/inventaire | `batch_05_idp_measure_inventory.csv` | 12054 |
| Orphelins | `batch_99_orphans.csv` | 590 |

## Ce qui peut etre valide rapidement

- Les doublons exacts `DUPLICATE_EXACT` avec distance 0 m et meme contexte administratif.
- Les petits lots `STEP/STM`, `rejets`, `mines/decharges`.
- Les orphelins avec geometrie absente clairement identifies comme `WAIT_SOURCE_FIX`.

## Ce qui bloque PREPROD

- 14366 conflits restent en statut `PENDING`.
- 590 orphelins restent sans rattachement master.
- Le lot IDP mesure/inventaire represente 12054 lignes et doit etre segmente avant validation.
- Aucune decision n'est encore chargee dans `qa.spatial_identity_decisions`.

## Decision

GO :

- exploitation DEV QA;
- revue metier par lots CSV;
- preparation des decisions.

NOGO :

- bascule PREPROD;
- fusion automatique;
- creation definitive de master pour cas ambigus;
- remplacement des endpoints `/api/v1/pollution/*`.

## Prochaine etape recommandee

Commencer par `batch_01_step_stm.csv`, puis `batch_02_rejets.csv`, puis `batch_04_mines_decharges.csv`. Ces lots sont suffisamment petits pour etablir les regles de validation avant d'attaquer le lot IDP massif.
