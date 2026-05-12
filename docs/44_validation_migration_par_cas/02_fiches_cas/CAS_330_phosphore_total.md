# CAS-330 Phosphore_Total

## Identification
- parametre_observe : `Phosphore_Total`
- nom_standard : `PT`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, types_mesures`
- volumes : `631` lignes, `630` non nulles, `0` nulles
- exemples : `0.138 | 0.139 | 2.06 | 0.02 | 0.03 | 0.039`

## Problème
Le rattachement de `Phosphore_Total` vers `PT` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `PT`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `631` lignes, dont `630` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `7.0000000000000001E-3` / max `164`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_330_phosphore_total.sql`

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
