# CAS-081 debit_l_s

## Identification
- parametre_observe : `debit_l_s`
- nom_standard : `Debit_m / Debit_jr`
- type_cas : `UNIT_VALIDATION`
- unité source : `L/s`
- criticité : `Élevée`

## Données
- tables sources : `rejets_domestiques_abhs`
- volumes : `362` lignes, `207` non nulles, `155` nulles
- exemples : `12 | 10 | 7`

## Problème
Le paramètre `debit_l_s` est rattaché à `Debit_m / Debit_jr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Debit_m / Debit_jr`. Unité source observée : `L/s` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `362` lignes, dont `207` non nulles, `155` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `n.d.`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_081_debit_l_s.sql`

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
