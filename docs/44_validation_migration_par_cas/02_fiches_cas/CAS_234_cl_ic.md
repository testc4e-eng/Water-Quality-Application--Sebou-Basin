# CAS-234 Cl-_IC

## Identification
- parametre_observe : `Cl-_IC`
- nom_standard : `Cl-`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `127` lignes, `127` non nulles, `0` nulles
- exemples : `64,9 | 56,2 | 74,2 | 60,9 | 27,3 | 129`

## Problème
Le paramètre `Cl-_IC` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Cl-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `127` lignes, dont `127` non nulles, `0` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `3.77` / max `20625`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 250 (acceptabilité) mg/L`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_234_cl_ic.sql`

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
