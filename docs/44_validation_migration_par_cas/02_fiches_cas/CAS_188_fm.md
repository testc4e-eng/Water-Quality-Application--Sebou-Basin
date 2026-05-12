# CAS-188 FM

## Identification
- parametre_observe : `FM`
- nom_standard : `FM`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_rivieres, types_mesures`
- volumes : `5` lignes, `4` non nulles, `0` nulles
- exemples : `38.4 | 12.4 | 298.6 | 37`

## Problème
Le paramètre `FM` est rattaché à `FM`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `FM`. Unité source observée : `à confirmer` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `5` lignes, dont `4` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `38.4` / max `38.4`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_188_fm.sql`

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
