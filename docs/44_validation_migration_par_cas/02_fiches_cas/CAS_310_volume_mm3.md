# CAS-310 volume_mm3

## Identification
- parametre_observe : `volume_mm3`
- nom_standard : `Volume`
- type_cas : `PARAMETER_MAPPING`
- unité source : `Mm3`
- criticité : `Moyenne`

## Données
- tables sources : `bathymetries_barrages_abhs, mesures_niv_eau_barrages`
- volumes : `147525` lignes, `72495` non nulles, `75030` nulles
- exemples : `10.307 | 15.0421 | 7.562 | 16.22 | 13.14 | 4.32`

## Problème
Le rattachement de `volume_mm3` vers `Volume` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Volume`. Unité source observée : `Mm3` ; unité métier dominante : `Mm³`. Volume agrégé du cas : `147525` lignes, dont `72495` non nulles, `75030` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `4033.7809999999999`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_310_volume_mm3.sql`

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
