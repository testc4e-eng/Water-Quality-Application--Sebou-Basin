# Controles QA Phase 3

## Context

Controles QA obligatoires executes en simulation avant tout chargement reel.

## Analysis

| Controle QA | Resultat | Statut |
|---|---:|---|
| doublons metier `(barrage_id, temps, parametre_code, scenario)` | 0 | OK |
| `barrage_id` null | 0 | OK |
| `temps` null | 0 | OK |
| `valeur` null | 0 | OK |
| parametre hors referentiel | 0 | OK |
| unite incoherente | 0 | OK |
| collisions business hash | 0 | OK |
| collisions FK referentiel | 0 | OK |
| valeurs negatives | 0 | OK |
| melange debit / volume | 0 | OK |
| `m3/s` sur `LACHER` | 0 | OK |
| `m3/s` sur `APPORTS_HM3` | 0 | OK |
| `m3/s` sur `TRANSFERT` | 0 | OK |

### Classification anomalies

| Classe | Anomalie | Volume | Traitement |
|---|---|---:|---|
| BACKLOG | lignes avec `date_jr` null | 92 | exclure du chargement |
| BACKLOG | doublons source apres priorite `(ire_barrage, date_jr) order by id` | 243 | exclure du chargement |
| INFO | `BARRAGE_ID_NULL` | 0 | aucun cas |
| INFO | parametre hors referentiel | 0 | aucun cas |
| INFO | unite incoherente | 0 | aucun cas |

## Solution

Tous les controles bloquants sont a zero.

Decision QA :

- `NORMALISATION_OK`

## Optional improvements

En Phase 4, les exclusions devront etre auditees avant l'insert reel :

- nombre par raison
- chemin du fichier `09_lignes_exclues.csv`
- hash ou horodatage du run d'execution
