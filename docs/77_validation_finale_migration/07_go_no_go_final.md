# GO / NO GO final

## Context

La cloture demandee vise un etat verrouille et production-ready.

## Analysis

Ce seuil n'est pas atteint pour deux raisons transverses :

- le flux barrage n'est pas semantiquement normalise
- le referentiel parametre n'est pas encore univoque

## Solution

Verdict :

- `NO GO`

Conditions minimales de passage a `GO` :

1. creer et charger `metadata.referentiel_parametre_canonique`
   statut 2026-05-07 : phase validee pour execution avec backup prealable sans toucher aux tables metier migrees
2. deployer `hydro.mesure_barrage_param`
3. purger toute exposition legacy `lacher_m3s`
4. basculer dashboards/API barrage sur la couche parametrique avec `Mm3/j`
5. deployer les controles QA interdisant tout melange debit / volume
6. traiter ou classer explicitement les grands volumes qualite sans `parametre_ref_id`
