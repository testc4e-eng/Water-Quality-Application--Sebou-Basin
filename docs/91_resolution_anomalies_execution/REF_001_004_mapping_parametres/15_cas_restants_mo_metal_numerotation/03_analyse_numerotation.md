# Analyse NUMEROTATION

## Identification

| Champ | Valeur |
|---|---|
| ID anomalie | `REF-002-NUMEROTATION` |
| Table | `qualite.mesure_qualite_nappe` |
| Volume | 1 ligne |
| Statut avant analyse | `LEGACY_IGNORE` |
| Mode | read-only |

## Contexte observe

| Indicateur | Valeur |
|---|---|
| date | 1991-03-27 |
| station | `my yaacoub` |
| IRE station | `2881/15` |
| source brute | `Numerotation_GT` |
| valeur | 110 |
| nappe_id | null |
| code_nappe | null |
| `qa_flag_nappe_unmapped` | true |
| source system | `E1_1_NAPPE` |

## Analyse

`NUMEROTATION` / `Numerotation_GT` ne correspond pas a un parametre de qualite eau. Il s'agit d'un identifiant, numero de grille, numero technique ou champ legacy d'import.

La ligne n'a pas de rattachement nappe resolu (`qa_flag_nappe_unmapped = true`), ce qui renforce le statut hors referentiel qualite.

## Decision proposee

`LEGACY_IGNORE`

Regles d'usage :

| Regle | Decision |
|---|---|
| creer un parametre canonique qualite | non |
| mapper vers `parametre_ref_id` | non |
| exposer dashboard qualite | non |
| utiliser IA/analytics qualite | non |
| conserver trace source | oui |

## Risque

Risque nul pour la qualite metier si la ligne reste non mappee et ignoree dans les dashboards. La valeur `110` ne doit pas etre interpretee comme mesure qualite.
