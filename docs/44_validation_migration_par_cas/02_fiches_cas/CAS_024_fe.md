# CAS-024 Fe

## Identification
- parametre_observe : `Fe`
- nom_standard : `Fe`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `1175` lignes, `1175` non nulles, `0` nulles
- exemples : `0.06 | 2.805 | 0.43 | 13 | 9.3 | 0.3`

## Problème
Le paramètre `Fe` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `Fe`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `1175` lignes, dont `1175` non nulles, `0` nulles, `0` non numériques et `3` suspectes. Plage observée dans les audits existants : min `1.9E-2` / max `5.58`. Référence externe déjà associée dans l'audit précédent : `0.5-50 (fresh waters); <= 2 (acceptabilité OMS, pas valeur sanitaire formelle) mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_024_fe.sql`

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
