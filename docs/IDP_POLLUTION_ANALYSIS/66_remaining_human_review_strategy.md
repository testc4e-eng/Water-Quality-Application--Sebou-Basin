# Strategie revue humaine restante

## Statut

`FINAL_HUMAN_REVIEW_READY`

## Objectif

Limiter la revue Imane aux seuls cas non stabilises par auto-validation :

- conflits reels residuels ;
- orphelins ;
- sources a corriger ou rattacher manuellement.

Les cas `EXACT_0M`, `VERY_CLOSE_2M` et `DIFFERENT_OBJECT` sont exclus de ce workspace.

## Volumes

| Bucket final | Volume | Source |
|---|---:|---|
| `TRUE_AMBIGUOUS` | 3 | conflits `TO_VALIDATE` residuels |
| `ORPHAN_REVIEW` | 102 | `review_orphans.csv` |
| Total unique | 105 | workspace final |

Note : le fichier historique `true_ambiguous_cases_only.csv` contient 105 lignes dont 102 orphelins. Le workspace final separe ces objets en deux couches pour eviter la confusion.

## Buckets métier

### TRUE_AMBIGUOUS

Cas pouvant changer une decision metier ou spatiale :

- `NAME_CONFLICT`
- `COMMUNE_CONFLICT`
- `MULTI_OBJECT_CONFLICT`
- `GEOMETRY_SUSPICIOUS`
- `POSSIBLE_WRONG_MATCH`
- `POSSIBLE_DUPLICATE`
- `REVIEW_REQUIRED`

### ORPHAN_REVIEW

Cas sans master candidat fiable ou source non exploitable :

- `MISSING_GEOMETRY`
- `SOURCE_LAYER_PROBLEM`
- `MISSING_MAPPING`
- `INVALID_COORDINATES`
- `NOT_DISPLAYABLE`
- `SOURCE_FIX_REQUIRED`

## Sous-classification appliquee

| Regle | issue_type | suggested_action |
|---|---|---|
| distance > 2 m | `POSSIBLE_WRONG_MATCH` | `WAIT_BUSINESS_DECISION` |
| nom/source vide ou similarite faible | `GEOMETRY_SUSPICIOUS` | `NEED_FIELD_VALIDATION` |
| commune divergente | `COMMUNE_CONFLICT` | `WAIT_BUSINESS_DECISION` |
| orphelin avec geometrie | `MISSING_MAPPING` | `WAIT_SOURCE_FIX` |
| orphelin sans geometrie | `MISSING_GEOMETRY` | `WAIT_SOURCE_FIX` |

## Exclusions explicites

Ne sont pas envoyes a Imane dans ce package :

- `EXACT_0M` auto-valides ;
- `VERY_CLOSE_2M` auto-valides ;
- `DIFFERENT_OBJECT` rattaches comme objets metier distincts ;
- duplications organisationnelles ;
- copies de couches ;
- renommages simples.

## Sortie attendue

Imane renseigne uniquement :

- `reviewer_decision`
- `reviewer_comment`

Le reste sert a l'audit et a l'ingestion future.
