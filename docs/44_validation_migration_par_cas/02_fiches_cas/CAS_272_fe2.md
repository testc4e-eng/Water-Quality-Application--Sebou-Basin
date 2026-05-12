# CAS-272 Fe2+

## Identification
- parametre_observe : `Fe2+`
- nom_standard : `Fe`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `44` lignes, `44` non nulles, `0` nulles
- exemples : `0,074 | 0,054 | 0,078 | <0,050 | <0,010 | 0,0171`

## Problème
Le paramètre `Fe2+` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Fe`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `44` lignes, dont `44` non nulles, `0` nulles, `29` non numériques et `2` suspectes. Plage observée dans les audits existants : min `5.3999999999999999E-2` / max `0.255`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT, DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `0.5-50 (fresh waters); <= 2 (acceptabilité OMS, pas valeur sanitaire formelle) mg/L`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | convertir la virgule en point`
- flags : `BELOW_DETECTION_LIMIT | DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_272_fe2.sql`

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
