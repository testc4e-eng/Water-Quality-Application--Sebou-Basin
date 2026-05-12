# CAS-286 indice de phénol M:A

## Identification
- parametre_observe : `indice de phénol M:A`
- nom_standard : `Phenol`
- type_cas : `VALUE_PARSING`
- unité source : `Indice`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `27` lignes, `27` non nulles, `0` nulles
- exemples : `<0,01`

## Problème
Le paramètre `indice de phénol M:A` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Phenol`. Unité source observée : `Indice` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `27` lignes, dont `27` non nulles, `0` nulles, `10` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.01` / max `0.14699999999999999`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `<x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier`
- flags : `BELOW_DETECTION_LIMIT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_286_indice_de_phenol_m_a.sql`

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
