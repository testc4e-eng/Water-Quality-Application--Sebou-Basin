# CAS-225 DBO5

## Identification
- parametre_observe : `DBO5`
- nom_standard : `DBO5`
- type_cas : `VALUE_PARSING`
- unité source : `mg O2/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `202` lignes, `202` non nulles, `0` nulles
- exemples : `<0,2 | 2,132 | 261,69 | 25,815 | 0,762 | 0,839`

## Problème
Le paramètre `DBO5` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `DBO5`. Unité source observée : `mg O2/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `202` lignes, dont `202` non nulles, `0` nulles, `6` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.51249999999999996` / max `17450.57`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_225_dbo5.sql`

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
