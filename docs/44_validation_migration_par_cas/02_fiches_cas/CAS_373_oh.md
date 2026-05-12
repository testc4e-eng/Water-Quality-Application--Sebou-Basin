# CAS-373 OH

## Identification
- parametre_observe : `OH`
- nom_standard : `OH-`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, types_mesures`
- volumes : `2` lignes, `1` non nulles, `0` nulles
- exemples : `7.65`

## Problème
Le rattachement de `OH` vers `OH-` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `OH-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `2` lignes, dont `1` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `7.65` / max `7.65`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_373_oh.sql`

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
