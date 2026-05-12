# CAS-319 NH4

## Identification
- parametre_observe : `NH4`
- nom_standard : `NH4+`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `4776` lignes, `4775` non nulles, `0` nulles
- exemples : `0.214 | 0.035 | 0.603 | 0.18257 | 4.32 | 0.29`

## Problème
Le rattachement de `NH4` vers `NH4+` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `NH4+`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4776` lignes, dont `4775` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2E-3` / max `4.6989999999999998`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_319_nh4.sql`

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
