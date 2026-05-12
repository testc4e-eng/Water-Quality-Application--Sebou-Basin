# CAS-325 MES

## Identification
- parametre_observe : `MES`
- nom_standard : `MES`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `2401` lignes, `2400` non nulles, `0` nulles
- exemples : `16.4 | 9.5 | 20.1 | 0 | 0.38 | 0.4`

## Problème
Le rattachement de `MES` vers `MES` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `MES`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `2401` lignes, dont `2400` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `13480`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_325_mes.sql`

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
