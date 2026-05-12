# CAS-274 V

## Identification
- parametre_observe : `V`
- nom_standard : `V`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `42` lignes, `42` non nulles, `0` nulles
- exemples : `0,0076 | 0,0125 | 0,0157 | <0,005 | <0,010`

## Problème
Le paramètre `V` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `V`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `42` lignes, dont `42` non nulles, `0` nulles, `21` non numériques et `0` suspectes. Plage observée dans les audits existants : min `7.6E-3` / max `0.37190000000000001`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_274_v.sql`

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
