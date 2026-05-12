# CAS-282 Bilan_Ionique

## Identification
- parametre_observe : `Bilan_Ionique`
- nom_standard : `Bilan_Ion`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `28` lignes, `28` non nulles, `0` nulles
- exemples : `3,750072287 | 3,102461377 | 3,298896337 | 0,525216307 | 0,616442227 | 0,723237856`

## Problème
Le paramètre `Bilan_Ionique` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Bilan_Ion`. Unité source observée : `à confirmer` ; unité métier dominante : `%`. Volume agrégé du cas : `28` lignes, dont `28` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.52521630699999999` / max `8.7914703319999994`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_282_bilan_ionique.sql`

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
