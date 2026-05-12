# CAS-082 dimension

## Identification
- parametre_observe : `dimension`
- nom_standard : `Dimension`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `rejets_domestiques_abhs`
- volumes : `362` lignes, `197` non nulles, `165` nulles
- exemples : `400 | 2000 | 500`

## Problème
Le paramètre `dimension` est rattaché à `Dimension`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Dimension`. Unité source observée : `à confirmer` ; unité métier dominante : `—`. Volume agrégé du cas : `362` lignes, dont `197` non nulles, `165` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `100` / max `2000`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_082_dimension.sql`

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
