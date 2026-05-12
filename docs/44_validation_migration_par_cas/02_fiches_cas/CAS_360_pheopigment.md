# CAS-360 Pheopigment

## Identification
- parametre_observe : `Pheopigment`
- nom_standard : `Pheopigment`
- type_cas : `PARAMETER_MAPPING`
- unité source : `µg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_rivieres, types_mesures`
- volumes : `55` lignes, `54` non nulles, `0` nulles
- exemples : `0.0001 | 0.0002 | 0.0009 | 0 | 0.0006`

## Problème
Le rattachement de `Pheopigment` vers `Pheopigment` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Pheopigment`. Unité source observée : `µg/L` ; unité métier dominante : `µg/L`. Volume agrégé du cas : `55` lignes, dont `54` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1E-4` / max `31.87`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_360_pheopigment.sql`

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
