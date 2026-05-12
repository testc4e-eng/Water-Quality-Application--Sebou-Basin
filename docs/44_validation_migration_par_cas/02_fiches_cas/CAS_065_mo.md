# CAS-065 MO

## Identification
- parametre_observe : `MO`
- nom_standard : `MO / Mo`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg/L`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `2658` lignes, `2657` non nulles, `0` nulles
- exemples : `0 | 7.6 | 1.81377 | 0.83 | 4.08 | 2.6`

## Problème
Le paramètre `MO` est rattaché à `MO / Mo`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `MO / Mo`. Unité source observée : `mg/L` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `2658` lignes, dont `2657` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `7.6`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_065_mo.sql`

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
