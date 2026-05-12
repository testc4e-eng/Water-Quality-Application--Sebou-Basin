# Decision unite hm3 / Mm3 - APPORT et TRANSFERT

## Decision

La collision d'alias `hm3` entre `APPORT` et `TRANSFERT` est levee.

Regle :

- `hm3`, `Hm3`, `HM3` ne sont plus des alias de parametre ;
- ces libelles sont des variantes historiques d'unite ;
- l'unite normalisee est `Mm3` ;
- pour les flux journaliers barrage, l'exposition metier reste `Mm3/j` ;
- aucune valeur numerique n'est modifiee ;
- `APPORT` et `TRANSFERT` restent deux parametres metier distincts.

## Execution realisee

| Objet | Resultat |
|---|---|
| backup | `audit.bkp_ref_param_hm3_unit_alias_20260508` |
| journal audit | `audit.referentiel_unite_hm3_decision_journal` |
| lignes backup | 2 |
| lignes journal | 2 |
| valeurs numeriques modifiees | 0 |
| tables qualite modifiees | 0 |

## Etat apres execution

| Parametre | Unite reference | Alias restants |
|---|---|---|
| `APPORT` | `Mm3/j` | `apports_hm`, `apports_hm3`, `APPORTS_HM3`, `apports_mm3` |
| `TRANSFERT` | `Mm3/j` | `transfert_mm3` |

## Controle collision

La collision `hm3` dans les alias de parametres actifs est supprimee.

## Gouvernance

Toute future ingestion doit traiter `hm3`, `Hm3`, `HM3` comme unite source legacy normalisee vers `Mm3`, jamais comme alias permettant de confondre `APPORT` et `TRANSFERT`.

