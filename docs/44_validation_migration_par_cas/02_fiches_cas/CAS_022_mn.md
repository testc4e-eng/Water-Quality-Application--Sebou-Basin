# CAS-022 Mn

## Identification
- parametre_observe : `Mn`
- nom_standard : `Mn`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `2625` lignes, `2625` non nulles, `0` nulles
- exemples : `0.138 | 0.733 | 0.3 | 0.647 | 0.29 | 0.4905`

## Problème
Le paramètre `Mn` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `Mn`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `2625` lignes, dont `2625` non nulles, `0` nulles, `0` non numériques et `3` suspectes. Plage observée dans les audits existants : min `1.4E-2` / max `8.3070000000000004`. Référence externe déjà associée dans l'audit précédent : `<= 0.08 ; frais typiques 0.001-0.2 mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_022_mn.sql`

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
