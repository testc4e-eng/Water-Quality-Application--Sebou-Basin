# CAS-020 Cl

## Identification
- parametre_observe : `Cl`
- nom_standard : `Cl-`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `4666` lignes, `4666` non nulles, `0` nulles
- exemples : `512.17 | 30.6 | 75 | 89.5 | 247 | 40.4`

## Problème
Le paramètre `Cl` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `Cl-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4666` lignes, dont `4666` non nulles, `0` nulles, `0` non numériques et `3` suspectes. Plage observée dans les audits existants : min `2` / max `2742`. Référence externe déjà associée dans l'audit précédent : `<= 250 (acceptabilité) mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_020_cl.sql`

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
