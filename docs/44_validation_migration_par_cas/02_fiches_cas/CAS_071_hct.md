# CAS-071 HCT

## Identification
- parametre_observe : `HCT`
- nom_standard : `HCO3-`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_rivieres, types_mesures`
- volumes : `492` lignes, `491` non nulles, `0` nulles
- exemples : `9.55 | 0.43 | 1.6 | 0.22`

## Problème
Le paramètre `HCT` est rattaché à `HCO3-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `HCO3-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `492` lignes, dont `491` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `9.5500000000000007` / max `9.5500000000000007`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_071_hct.sql`

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
