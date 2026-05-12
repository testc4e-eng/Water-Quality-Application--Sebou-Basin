# Decision normalisation Phase 3

## Context

La Phase 3 devait preparer la normalisation vers `hydro.mesure_barrage_param`, sans chargement reel.

Interdictions respectees :

- aucune insertion dans `hydro.mesure_barrage_param`
- aucune modification de table metier
- aucune modification de `staging.*`
- aucun usage de `ctid`
- aucun passage a la Phase 4

## Analysis

Resultats de simulation :

| Controle | Resultat |
|---|---:|
| volume source brut | 85166 |
| volume stable | 84831 |
| volume parametrique simule | 272652 |
| volume backlog | 0 |
| volume exclu | 335 |
| collisions business hash | 0 |
| collisions FK referentiel | 0 |
| unites incoherentes | 0 |
| parametres hors referentiel | 0 |
| doublons metier simules | 0 |

Tableau final :

| Parametre | Volume | Unite | QA |
|---|---:|---|---|
| `NIVEAU_EAU` | 84831 | `m` | OK |
| `VOLUME` | 10136 | `Mm3` | OK |
| `LACHER` | 84830 | `Mm3/j` | OK |
| `APPORTS_HM3` | 84820 | `Mm3/j` | OK |
| `TRANSFERT` | 8035 | `Mm3/j` | OK |

## Solution

Decision finale Phase 3 :

- `NORMALISATION_OK`

Motif :

- les cinq parametres barrage sont normalisables
- les unites sont conformes au referentiel canonique
- les hash metier ne collisionnent pas
- les FK referentiel sont resolues
- les exclusions sont documentees dans `09_lignes_exclues.csv`
- la table cible reste vide

## Optional improvements

La Phase 4 pourra etre lancee uniquement apres validation explicite, avec :

- backup prealable si la cible contient des donnees
- audit de chargement
- insertion controlee depuis la CTE validee
- controles post-load
