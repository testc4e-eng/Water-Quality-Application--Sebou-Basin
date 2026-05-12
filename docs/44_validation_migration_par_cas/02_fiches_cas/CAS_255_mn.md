# CAS-255 Mn

## Identification
- parametre_observe : `Mn`
- nom_standard : `Mn`
- type_cas : `VALUE_PARSING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `75` lignes, `75` non nulles, `0` nulles
- exemples : `<0,005 | <0,050 | 0,072 | 0,118 | 0,175`

## Problème
Le paramètre `Mn` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Mn`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `75` lignes, dont `75` non nulles, `0` nulles, `31` non numériques et `1` suspectes. Plage observée dans les audits existants : min `8.3000000000000001E-3` / max `1.099`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `<= 0.08 ; frais typiques 0.001-0.2 mg/L`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_255_mn.sql`

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
