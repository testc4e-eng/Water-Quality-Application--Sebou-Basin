# CAS-219 Ca++

## Identification
- parametre_observe : `Ca++`
- nom_standard : `Ca`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `278` lignes, `278` non nulles, `0` nulles
- exemples : `258,5 | 56,1 | 55,1 | 138,3 | 86,2 | 280,6`

## Problème
Le paramètre `Ca++` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Ca`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `278` lignes, dont `278` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `19.600000000000001` / max `1222.4000000000001`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_219_ca.sql`

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
