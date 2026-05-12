# CAS-305 DCO  2h décant.

## Identification
- parametre_observe : `DCO  2h décant.`
- nom_standard : `DCO`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `4` lignes, `4` non nulles, `0` nulles
- exemples : `9,6 | 15,4 | 19,2`

## Problème
Le paramètre `DCO  2h décant.` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `DCO`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4` lignes, dont `4` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `9.6` / max `53.8`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_305_dco_2h_decant.sql`

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
