# CAS-112 CN

## Identification
- parametre_observe : `CN`
- nom_standard : `CN-`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `127` lignes, `127` non nulles, `0` nulles
- exemples : `0.003 | 0.0057 | 0.0073 | 0 | 0.0001 | 0.0003`

## Problème
Le paramètre `CN` est rattaché à `CN-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `CN-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `127` lignes, dont `127` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `3.0000000000000001E-3` / max `7.3000000000000001E-3`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_112_cn.sql`

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
