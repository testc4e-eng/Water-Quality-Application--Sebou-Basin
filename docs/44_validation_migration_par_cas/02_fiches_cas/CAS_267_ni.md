# CAS-267 Ni

## Identification
- parametre_observe : `Ni`
- nom_standard : `Ni`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `46` lignes, `46` non nulles, `0` nulles
- exemples : `0,0188 | 0,0133 | 0,0124 | <0,010 | 0,01 | 0,0102`

## Problème
Le paramètre `Ni` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Ni`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `46` lignes, dont `46` non nulles, `0` nulles, `28` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.01` / max `7.3899999999999993E-2`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_267_ni.sql`

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
