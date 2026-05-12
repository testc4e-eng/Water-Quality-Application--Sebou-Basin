# Distribution parametres Phase 3

## Context

Distribution des lignes parametriques candidates apres normalisation simulee.

## Analysis

| Parametre | Volume | Unite | QA |
|---|---:|---|---|
| `NIVEAU_EAU` | 84831 | `m` | OK |
| `VOLUME` | 10136 | `Mm3` | OK |
| `LACHER` | 84830 | `Mm3/j` | OK |
| `APPORTS_HM3` | 84820 | `Mm3/j` | OK |
| `TRANSFERT` | 8035 | `Mm3/j` | OK |

Total :

- `272652` lignes candidates

## Solution

La distribution couvre les cinq parametres barrage requis.

Regles metier respectees :

- `RESTITUTION` est reclassee vers `LACHER`.
- `LACHER` reste un volume journalier en `Mm3/j`.
- `APPORTS_HM3` reste un volume journalier entrant en `Mm3/j`.
- `TRANSFERT` reste un volume journalier transfere en `Mm3/j`.
- aucun flux journalier barrage n'est expose en `m3/s`.

Decision distribution :

- `NORMALISATION_OK`

## Optional improvements

La Phase 5 devra afficher ces unites depuis le referentiel canonique ou depuis la table parametrique, sans reutiliser `lacher_m3s`.
