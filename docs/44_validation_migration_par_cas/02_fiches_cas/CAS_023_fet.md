# CAS-023 FeT

## Identification
- parametre_observe : `FeT`
- nom_standard : `Fe`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `2071` lignes, `2071` non nulles, `0` nulles
- exemples : `0.227 | 0.267 | 0.39 | 0.3 | 0.28 | 0.142`

## Problème
Le paramètre `FeT` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `Fe`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `2071` lignes, dont `2071` non nulles, `0` nulles, `0` non numériques et `3` suspectes. Plage observée dans les audits existants : min `2.5000000000000001E-2` / max `2.5`. Référence externe déjà associée dans l'audit précédent : `0.5-50 (fresh waters); <= 2 (acceptabilité OMS, pas valeur sanitaire formelle) mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_023_fet.sql`

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
