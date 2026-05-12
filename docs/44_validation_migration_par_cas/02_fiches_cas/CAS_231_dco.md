# CAS-231 DCO

## Identification
- parametre_observe : `DCO`
- nom_standard : `DCO`
- type_cas : `VALUE_PARSING`
- unité source : `mg O2/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `172` lignes, `172` non nulles, `0` nulles
- exemples : `<14,1 | <8,10 | 1585 | 96 | 266`

## Problème
Le paramètre `DCO` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `DCO`. Unité source observée : `mg O2/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `172` lignes, dont `172` non nulles, `0` nulles, `16` non numériques et `0` suspectes. Plage observée dans les audits existants : min `9.6` / max `30720`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_231_dco.sql`

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
