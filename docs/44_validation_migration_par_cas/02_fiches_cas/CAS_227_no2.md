# CAS-227 NO2-

## Identification
- parametre_observe : `NO2-`
- nom_standard : `NO2-`
- type_cas : `VALUE_PARSING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `189` lignes, `189` non nulles, `0` nulles
- exemples : `0,432 | 0,08 | 0,074 | 4,844 | 0,072 | 0,028`

## Problème
Le paramètre `NO2-` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `NO2-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `189` lignes, dont `189` non nulles, `0` nulles, `110` non numériques et `1` suspectes. Plage observée dans les audits existants : min `2E-3` / max `11.128`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 3 mg/L as nitrite`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_227_no2.sql`

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
