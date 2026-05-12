# CAS-021 NO2-

## Identification
- parametre_observe : `NO2-`
- nom_standard : `NO2-`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `4534` lignes, `4534` non nulles, `0` nulles
- exemples : `0.06 | 0.011 | 0.071 | 0.799 | 4.594 | 0.375`

## Problème
Le paramètre `NO2-` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `NO2-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4534` lignes, dont `4534` non nulles, `0` nulles, `0` non numériques et `2` suspectes. Plage observée dans les audits existants : min `0` / max `1.952`. Référence externe déjà associée dans l'audit précédent : `<= 3 mg/L as nitrite`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_021_no2.sql`

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
