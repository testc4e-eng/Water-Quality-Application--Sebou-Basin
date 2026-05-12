# CAS-249 TAC/TACs_meq/l

## Identification
- parametre_observe : `TAC/TACs_meq/l`
- nom_standard : `TAC`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `89` lignes, `89` non nulles, `0` nulles
- exemples : `<0,40 | 10,2 | 14,6 | 2,94`

## Problème
Le paramètre `TAC/TACs_meq/l` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `TAC`. Unité source observée : `à confirmer` ; unité métier dominante : `meq/L`. Volume agrégé du cas : `89` lignes, dont `89` non nulles, `0` nulles, `1` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.34` / max `15.9`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_249_tac_tacs_meq_l.sql`

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
