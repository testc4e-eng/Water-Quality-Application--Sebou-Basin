# CAS-281 Hg

## Identification
- parametre_observe : `Hg`
- nom_standard : `HG / Hg`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `31` lignes, `31` non nulles, `0` nulles
- exemples : `0,0004242 | 0,0002614 | 0,00036 | <0,00025 | 0,0003`

## Problème
Le paramètre `Hg` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `HG / Hg`. Unité source observée : `à confirmer` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `31` lignes, dont `31` non nulles, `0` nulles, `24` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.6140000000000001E-4` / max `1.6999999999999999E-3`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_281_hg.sql`

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
