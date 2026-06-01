# Vrais cas ambigus restants

## Statut

`TRUE_AMBIGUOUS_CASES_REDUCED`

## Objectif

Retirer du backlog humain les duplications organisationnelles, copies de couches, renommages et couches derivees, puis conserver uniquement les cas qui peuvent changer une decision metier ou spatiale.

## Sont conserves comme ambigus

- conflit nom/commune reel ;
- distance incoherente par rapport aux regles officielles ;
- types incompatibles non couverts par `SAME_SITE_DIFFERENT_OBJECT` ;
- geometrie douteuse ;
- absence de geometrie ;
- source sans master candidat fiable ;
- cas avec score faible et contexte attributaire insuffisant.

## Sont exclus du backlog ambigu

- `EXACT_0M` ;
- `VERY_CLOSE_2M` ;
- duplications organisationnelles ;
- copies de couches ;
- renommages ;
- couches derivees ;
- objets metier distincts mais correctement rattaches au meme site physique.

## CSV produit

`docs/IDP_POLLUTION_ANALYSIS/true_ambiguous_cases_only.csv`

Colonnes :

- `case_type`
- `source_layer`
- `source_object_id`
- `source_name`
- `source_type`
- `master_site_id`
- `master_site_name`
- `distance_m`
- `match_score`
- `reason`
- `recommended_action`

## Volumes

| Famille | Volume |
|---|---:|
| `TO_VALIDATE` issu des conflits complets | 3 |
| `ORPHAN` a corriger/revoir | 102 |
| Total CSV ambigu reel | 105 |

## Decision

Le volume humain prioritaire est reduit a 105 cas dans le CSV de sortie, au lieu de traiter manuellement les 14335 objets des lots auto-validables ou multi-objets.
