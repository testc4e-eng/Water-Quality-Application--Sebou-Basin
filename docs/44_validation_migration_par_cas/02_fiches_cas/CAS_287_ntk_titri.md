# CAS-287 NTK Titri

## Identification
- parametre_observe : `NTK Titri`
- nom_standard : `NTK`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `21` lignes, `21` non nulles, `0` nulles
- exemples : `60,48 | 41,4 | 40,88 | 117,6 | 16,8 | 162`

## Problème
Le paramètre `NTK Titri` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `NTK`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `21` lignes, dont `21` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `16.8` / max `162`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_287_ntk_titri.sql`

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
