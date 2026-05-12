# Controle normalisation Phase 3

## Context

Preparation de normalisation vers `hydro.mesure_barrage_param`, sans insertion reelle.

Source :

- `staging.raw_mesures_niv_eau_barrages`

Cible simulee :

- `hydro.mesure_barrage_param`

Cle source stable :

- `id`

Dedoublonnage :

- `(ire_barrage, date_jr) order by id`

Aucun `ctid` n'est utilise.

## Analysis

### Synthese controle

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
| `barrage_id` null apres normalisation | 0 |
| `temps` null apres normalisation | 0 |
| `valeur` null apres normalisation | 0 |
| valeurs negatives | 0 |
| melange debit / volume | 0 |

### Exclusions

| Raison | Volume |
|---|---:|
| `DATE_NULL` | 92 |
| `DUPLICATE_SOURCE_KEY` | 243 |
| `BARRAGE_ID_NULL` | 0 |

Fichier detail :

- `09_lignes_exclues.csv`

### Regles d'unite

| Parametre | Unite cible | Statut |
|---|---|---|
| `NIVEAU_EAU` | `m` | OK |
| `VOLUME` | `Mm3` | OK |
| `LACHER` | `Mm3/j` | OK |
| `APPORTS_HM3` | `Mm3/j` | OK |
| `TRANSFERT` | `Mm3/j` | OK |

## Solution

La normalisation simulee respecte les contraintes cible de Phase 2 :

- aucune valeur null dans les lignes candidates
- aucun barrage null
- aucun temps null
- aucun parametre hors referentiel canonique
- aucune unite incoherente
- aucune collision business hash
- aucun doublon metier
- aucun `m3/s` sur `LACHER`, `APPORTS_HM3` ou `TRANSFERT`

Decision controle :

- `NORMALISATION_OK`

## Optional improvements

La Phase 4 devra reprendre exactement les CTE de `07_sql_prepare_normalisation.sql` et ajouter seulement l'instruction `INSERT` controlee avec audit et backup prealable.
