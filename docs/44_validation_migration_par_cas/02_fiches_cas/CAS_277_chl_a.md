# CAS-277 Chl a

## Identification
- parametre_observe : `Chl a`
- nom_standard : `Chla`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `38` lignes, `38` non nulles, `0` nulles
- exemples : `<0,1 | 0,54 | 0,6`

## Problème
Le paramètre `Chl a` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Chla`. Unité source observée : `à confirmer` ; unité métier dominante : `µg/L`. Volume agrégé du cas : `38` lignes, dont `38` non nulles, `0` nulles, `6` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.54` / max `459`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_277_chl_a.sql`

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
