# CAS-113 NH4+ Spect

## Identification
- parametre_observe : `NH4+ Spect`
- nom_standard : `NH4+`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `127` lignes, `127` non nulles, `0` nulles
- exemples : `<0,016 | 58,8 | 0,028 | 0,121`

## Problème
Le paramètre `NH4+ Spect` est rattaché à `NH4+`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `NH4+`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `127` lignes, dont `127` non nulles, `0` nulles, `41` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.7000000000000001E-2` / max `154`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_113_nh4_spect.sql`

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
