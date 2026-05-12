# CAS-252 MEST Filtr

## Identification
- parametre_observe : `MEST Filtr`
- nom_standard : `MES`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `77` lignes, `77` non nulles, `0` nulles
- exemples : `<3,11 | 44,5 | 25 | 3,9`

## Problème
Le paramètre `MEST Filtr` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `MES`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `77` lignes, dont `77` non nulles, `0` nulles, `16` non numériques et `0` suspectes. Plage observée dans les audits existants : min `3.2` / max `1484`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_252_mest_filtr.sql`

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
