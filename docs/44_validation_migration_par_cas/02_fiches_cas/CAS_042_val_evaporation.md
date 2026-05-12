# CAS-042 val_evaporation

## Identification
- parametre_observe : `val_evaporation`
- nom_standard : `Evaporation`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_evaporation_jr`
- volumes : `48900` lignes, `38592` non nulles, `10308` nulles
- exemples : `13.48 | 6.77 | 4.28`

## Problème
Le paramètre `val_evaporation` est rattaché à `Evaporation`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Evaporation`. Unité source observée : `à confirmer` ; unité métier dominante : `mm`. Volume agrégé du cas : `48900` lignes, dont `38592` non nulles, `10308` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `20.079999999999998`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_042_val_evaporation.sql`

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
