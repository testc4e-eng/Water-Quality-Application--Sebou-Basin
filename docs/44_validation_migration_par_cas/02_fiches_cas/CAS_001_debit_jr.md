# CAS-001 debit_jr

## Identification
- parametre_observe : `debit_jr`
- nom_standard : `Debit_m / Debit_jr`
- type_cas : `AMBIGUOUS_PARAMETER`
- unité source : `à confirmer`
- criticité : `Critique`

## Données
- tables sources : `mesures_debit_jr`
- volumes : `521433` lignes, `521433` non nulles, `0` nulles
- exemples : `-1 | -2 | 0`

## Problème
Le paramètre `debit_jr` reste ambigu vis-à-vis du standard métier proposé `Debit_m / Debit_jr` ; aucune décision implicite n'est autorisée.

## Analyse
Mapping observé : `Debit_m / Debit_jr`. Unité source observée : `à confirmer` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `521433` lignes, dont `521433` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `-2` / max `4084.353071`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `arbitrer le nom standard métier avant tout SQL de migration`
- flags : `PARAMETER_AMBIGUOUS`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_001_debit_jr.sql`

## Validation
- statut : `PENDING`
- validateur :
- date :

## Exécution
- script utilisé : aucun
- volume impacté : `0`

## Résultat
- succès / échec : non exécuté
- anomalies restantes : cas non traité tant que la validation humaine n’est pas fournie
