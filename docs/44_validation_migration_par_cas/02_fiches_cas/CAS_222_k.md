# CAS-222 K+

## Identification
- parametre_observe : `K+`
- nom_standard : `K`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `261` lignes, `261` non nulles, `0` nulles
- exemples : `2,71 | 2,4 | 2,42 | 1,86 | 62,8 | 1,76`

## Problème
Le paramètre `K+` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `K`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `261` lignes, dont `261` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.44800000000000001` / max `633`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_222_k.sql`

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
