# CAS-040 debit_jr

## Identification
- parametre_observe : `debit_jr`
- nom_standard : `Debit_m / Debit_jr`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_debit_jr`
- volumes : `521433` lignes, `521433` non nulles, `0` nulles
- exemples : `-1 | -2 | 0`

## Problème
Le paramètre `debit_jr` est rattaché à `Debit_m / Debit_jr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Debit_m / Debit_jr`. Unité source observée : `à confirmer` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `521433` lignes, dont `521433` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `-2` / max `4084.353071`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_040_debit_jr.sql`

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
