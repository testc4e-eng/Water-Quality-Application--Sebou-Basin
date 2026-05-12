# CAS-017 NO3-

## Identification
- parametre_observe : `NO3-`
- nom_standard : `NO3-`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `5158` lignes, `5158` non nulles, `0` nulles
- exemples : `0.647 | 2.35 | 1.81 | 30.6 | 89.5 | 66.936`

## Problème
Le paramètre `NO3-` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `NO3-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `5158` lignes, dont `5158` non nulles, `0` nulles, `0` non numériques et `3` suspectes. Plage observée dans les audits existants : min `0` / max `51.66`. Référence externe déjà associée dans l'audit précédent : `<= 50 mg/L as nitrate`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_017_no3.sql`

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
