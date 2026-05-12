# CAS-232 MES

## Identification
- parametre_observe : `MES`
- nom_standard : `MES`
- type_cas : `VALUE_PARSING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `163` lignes, `163` non nulles, `0` nulles
- exemples : `<3,11 | 11,5 | 1924 | 672`

## Problème
Le paramètre `MES` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `MES`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `163` lignes, dont `163` non nulles, `0` nulles, `3` non numériques et `0` suspectes. Plage observée dans les audits existants : min `7.3684210529999996` / max `24008`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_232_mes.sql`

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
