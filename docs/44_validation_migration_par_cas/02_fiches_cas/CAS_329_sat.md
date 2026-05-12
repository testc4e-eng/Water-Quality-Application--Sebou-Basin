# CAS-329 sat

## Identification
- parametre_observe : `sat`
- nom_standard : `sat`
- type_cas : `PARAMETER_MAPPING`
- unité source : `%`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `1221` lignes, `1220` non nulles, `0` nulles
- exemples : `98.8 | 83.6 | 94.1 | 0 | 108 | 111.8`

## Problème
Le rattachement de `sat` vers `sat` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `sat`. Unité source observée : `%` ; unité métier dominante : `%`. Volume agrégé du cas : `1221` lignes, dont `1220` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `3` / max `941.2`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_329_sat.sql`

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
