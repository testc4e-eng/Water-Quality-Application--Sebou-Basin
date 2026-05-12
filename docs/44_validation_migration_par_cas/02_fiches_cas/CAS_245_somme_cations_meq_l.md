# CAS-245 Somme cations_meq/l

## Identification
- parametre_observe : `Somme cations_meq/l`
- nom_standard : `Som_cations`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `89` lignes, `89` non nulles, `0` nulles
- exemples : `9,174320524 | 7,8945857 | 10,98289952`

## Problème
Le paramètre `Somme cations_meq/l` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Som_cations`. Unité source observée : `à confirmer` ; unité métier dominante : `meq/L ou mg/L`. Volume agrégé du cas : `89` lignes, dont `89` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.3133092880000001` / max `569.7290418`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_245_somme_cations_meq_l.sql`

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
