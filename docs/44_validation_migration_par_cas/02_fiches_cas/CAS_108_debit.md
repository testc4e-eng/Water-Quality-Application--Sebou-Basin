# CAS-108 Debit

## Identification
- parametre_observe : `Debit`
- nom_standard : `Debit_m / Debit_jr`
- type_cas : `UNIT_VALIDATION`
- unité source : `m³/s`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `176` lignes, `175` non nulles, `0` nulles
- exemples : `0.047 | 0.332 | 154 | 10 | 260 | 31.6`

## Problème
Le paramètre `Debit` est rattaché à `Debit_m / Debit_jr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Debit_m / Debit_jr`. Unité source observée : `m³/s` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `176` lignes, dont `175` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `4.7E-2` / max `5050`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_108_debit.sql`

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
