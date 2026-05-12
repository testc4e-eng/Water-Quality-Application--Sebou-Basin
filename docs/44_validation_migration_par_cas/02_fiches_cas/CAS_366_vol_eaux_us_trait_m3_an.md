# CAS-366 vol_eaux_us_trait_m3_an

## Identification
- parametre_observe : `vol_eaux_us_trait_m3_an`
- nom_standard : `Vol_trait`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m3/an`
- criticité : `Moyenne`

## Données
- tables sources : `step_abhs`
- volumes : `41` lignes, `27` non nulles, `14` nulles
- exemples : `315000 | 1825000 | 816788`

## Problème
Le rattachement de `vol_eaux_us_trait_m3_an` vers `Vol_trait` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Vol_trait`. Unité source observée : `m3/an` ; unité métier dominante : `m³/an`. Volume agrégé du cas : `41` lignes, dont `27` non nulles, `14` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2052` / max `47450000`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_366_vol_eaux_us_trait_m3_an.sql`

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
