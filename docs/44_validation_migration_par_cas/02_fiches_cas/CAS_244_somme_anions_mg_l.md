# CAS-244 somme anions_mg/l

## Identification
- parametre_observe : `somme anions_mg/l`
- nom_standard : `Som_anions`
- type_cas : `VALUE_PARSING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `89` lignes, `89` non nulles, `0` nulles
- exemples : `522,197 | 461,44 | 585,346`

## Problème
Le paramètre `somme anions_mg/l` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Som_anions`. Unité source observée : `mg/L` ; unité métier dominante : `meq/L ou mg/L`. Volume agrégé du cas : `89` lignes, dont `89` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `134.44399999999999` / max `21594.242999999999`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_244_somme_anions_mg_l.sql`

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
