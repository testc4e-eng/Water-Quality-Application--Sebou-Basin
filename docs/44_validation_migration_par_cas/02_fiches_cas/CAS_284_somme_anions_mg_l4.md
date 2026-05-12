# CAS-284 somme anions_mg/l4

## Identification
- parametre_observe : `somme anions_mg/l4`
- nom_standard : `Som_anions`
- type_cas : `VALUE_PARSING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `28` lignes, `28` non nulles, `0` nulles
- exemples : `503,048 | 877,81 | 1200,64`

## Problème
Le paramètre `somme anions_mg/l4` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Som_anions`. Unité source observée : `mg/L` ; unité métier dominante : `meq/L ou mg/L`. Volume agrégé du cas : `28` lignes, dont `28` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `69.63` / max `5451.94`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_284_somme_anions_mg_l4.sql`

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
