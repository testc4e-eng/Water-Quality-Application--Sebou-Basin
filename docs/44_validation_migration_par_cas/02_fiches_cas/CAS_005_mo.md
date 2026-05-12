# CAS-005 MO

## Identification
- parametre_observe : `MO`
- nom_standard : `MO / Mo`
- type_cas : `AMBIGUOUS_PARAMETER`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `2658` lignes, `2657` non nulles, `0` nulles
- exemples : `0 | 7.6 | 1.81377 | 0.83 | 4.08 | 2.6`

## Problème
Le paramètre `MO` reste ambigu vis-à-vis du standard métier proposé `MO / Mo` ; aucune décision implicite n'est autorisée.

## Analyse
Mapping observé : `MO / Mo`. Unité source observée : `mg/L` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `2658` lignes, dont `2657` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `7.6`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `arbitrer le nom standard métier avant tout SQL de migration`
- flags : `PARAMETER_AMBIGUOUS`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_005_mo.sql`

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
