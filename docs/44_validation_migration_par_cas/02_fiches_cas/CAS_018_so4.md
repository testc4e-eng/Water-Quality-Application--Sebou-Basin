# CAS-018 SO4

## Identification
- parametre_observe : `SO4`
- nom_standard : `SO4²-`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `4793` lignes, `4793` non nulles, `0` nulles
- exemples : `123 | 144.08 | 19.5 | 8.92 | 30.6 | 89.5`

## Problème
Le paramètre `SO4` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `SO4²-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4793` lignes, dont `4793` non nulles, `0` nulles, `0` non numériques et `3` suspectes. Plage observée dans les audits existants : min `0.11700000000000001` / max `777`. Référence externe déjà associée dans l'audit précédent : `<= 250 mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_018_so4.sql`

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
