# CAS-314 hauteur_m

## Identification
- parametre_observe : `hauteur_m`
- nom_standard : `Hauteur`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m`
- criticité : `Moyenne`

## Données
- tables sources : `bathymetries_barrages_abhs`
- volumes : `62359` lignes, `62359` non nulles, `0` nulles
- exemples : `325.28 | 161.01 | 541.79`

## Problème
Le rattachement de `hauteur_m` vers `Hauteur` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Hauteur`. Unité source observée : `m` ; unité métier dominante : `m`. Volume agrégé du cas : `62359` lignes, dont `62359` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `94.5` / max `765`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_314_hauteur_m.sql`

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
