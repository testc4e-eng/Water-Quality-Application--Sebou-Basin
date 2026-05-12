# CAS-237 SO42-_IC

## Identification
- parametre_observe : `SO42-_IC`
- nom_standard : `SO4²-`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `127` lignes, `127` non nulles, `0` nulles
- exemples : `8,09 | 10,8 | 78,4 | 3,61 | 78,6 | 9,98`

## Problème
Le paramètre `SO42-_IC` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `SO4²-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `127` lignes, dont `127` non nulles, `0` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `3.43` / max `2782`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 250 mg/L`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_237_so42_ic.sql`

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
