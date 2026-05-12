# CAS-257 Phénol

## Identification
- parametre_observe : `Phénol`
- nom_standard : `Phenol`
- type_cas : `VALUE_PARSING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `72` lignes, `72` non nulles, `0` nulles
- exemples : `<0.01 | <0.065 | <0,065 | 0,122 | 0,017 | 0,085`

## Problème
Le paramètre `Phénol` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Phenol`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `72` lignes, dont `72` non nulles, `0` nulles, `33` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.01` / max `2.56`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_257_phenol.sql`

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
