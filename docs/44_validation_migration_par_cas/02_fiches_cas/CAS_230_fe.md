# CAS-230 Fe

## Identification
- parametre_observe : `Fe`
- nom_standard : `Fe`
- type_cas : `VALUE_PARSING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `175` lignes, `175` non nulles, `0` nulles
- exemples : `<0,050 | 0,101 | 0,095 | 0,132 | 5,24 | 3,693`

## Problème
Le paramètre `Fe` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Fe`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `175` lignes, dont `175` non nulles, `0` nulles, `49` non numériques et `2` suspectes. Plage observée dans les audits existants : min `0.02` / max `2.99`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `0.5-50 (fresh waters); <= 2 (acceptabilité OMS, pas valeur sanitaire formelle) mg/L`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_230_fe.sql`

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
