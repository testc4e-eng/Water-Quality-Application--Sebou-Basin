# CAS-315 surface_km2

## Identification
- parametre_observe : `surface_km2`
- nom_standard : `Superficie_km2`
- type_cas : `PARAMETER_MAPPING`
- unité source : `km2`
- criticité : `Moyenne`

## Données
- tables sources : `bathymetries_barrages_abhs`
- volumes : `62359` lignes, `62359` non nulles, `0` nulles
- exemples : `5.083 | 6.529940002 | 7.562`

## Problème
Le rattachement de `surface_km2` vers `Superficie_km2` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Superficie_km2`. Unité source observée : `km2` ; unité métier dominante : `km²`. Volume agrégé du cas : `62359` lignes, dont `62359` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `132.12`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_315_surface_km2.sql`

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
