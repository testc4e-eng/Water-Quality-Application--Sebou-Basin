# CAS-157 vrn_hm3

## Identification
- parametre_observe : `vrn_hm3`
- nom_standard : `Volume`
- type_cas : `UNIT_VALIDATION`
- unité source : `Hm3`
- criticité : `Moyenne`

## Données
- tables sources : `barrages_abhs`
- volumes : `34` lignes, `23` non nulles, `11` nulles
- exemples : `12 | 266 | 55.5`

## Problème
Le paramètre `vrn_hm3` est rattaché à `Volume`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Volume`. Unité source observée : `Hm3` ; unité métier dominante : `Mm³`. Volume agrégé du cas : `34` lignes, dont `23` non nulles, `11` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.8` / max `3800`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_157_vrn_hm3.sql`

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
