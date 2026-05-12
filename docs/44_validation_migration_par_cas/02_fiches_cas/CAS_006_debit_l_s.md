# CAS-006 debit_l_s

## Identification
- parametre_observe : `debit_l_s`
- nom_standard : `Debit_m / Debit_jr`
- type_cas : `AMBIGUOUS_PARAMETER`
- unité source : `L/s`
- criticité : `Critique`

## Données
- tables sources : `rejets_domestiques_abhs`
- volumes : `362` lignes, `207` non nulles, `155` nulles
- exemples : `12 | 10 | 7`

## Problème
Le paramètre `debit_l_s` reste ambigu vis-à-vis du standard métier proposé `Debit_m / Debit_jr` ; aucune décision implicite n'est autorisée.

## Analyse
Mapping observé : `Debit_m / Debit_jr`. Unité source observée : `L/s` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `362` lignes, dont `207` non nulles, `155` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `n.d.`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `arbitrer le nom standard métier avant tout SQL de migration`
- flags : `PARAMETER_AMBIGUOUS`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_006_debit_l_s.sql`

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
