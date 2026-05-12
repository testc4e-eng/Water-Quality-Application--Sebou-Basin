# CAS-266 Mo

## Identification
- parametre_observe : `Mo`
- nom_standard : `MO / Mo`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `46` lignes, `46` non nulles, `0` nulles
- exemples : `0,0102 | 0,0205 | 0,0117 | <0,010 | 0,0105`

## Problème
Le paramètre `Mo` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `MO / Mo`. Unité source observée : `à confirmer` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `46` lignes, dont `46` non nulles, `0` nulles, `40` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.0200000000000001E-2` / max `2.0500000000000001E-2`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_266_mo.sql`

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
