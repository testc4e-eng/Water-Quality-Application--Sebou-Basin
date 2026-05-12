# CAS-019 CF

## Identification
- parametre_observe : `CF`
- nom_standard : `CF`
- type_cas : `VALUE_ABERRANT`
- unité source : `UFC/100mL`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `4735` lignes, `4735` non nulles, `0` nulles
- exemples : `340 | 95 | 32 | 24000 | 2200 | 165`

## Problème
Le paramètre `CF` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `CF`. Unité source observée : `UFC/100mL` ; unité métier dominante : `UFC/100 mL`. Volume agrégé du cas : `4735` lignes, dont `4735` non nulles, `0` nulles, `0` non numériques et `3` suspectes. Plage observée dans les audits existants : min `0` / max `160000`. Référence externe déjà associée dans l'audit précédent : `<= 100 geom. mean ; <= 320 STV cfu/100 mL`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_019_cf.sql`

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
