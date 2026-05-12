# CAS-154 apports_hm

## Identification
- parametre_observe : `apports_hm`
- nom_standard : `Apports_hm3`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `barrages_abhs`
- volumes : `34` lignes, `23` non nulles, `11` nulles
- exemples : `293 | 716 | 250`

## Problème
Le paramètre `apports_hm` est rattaché à `Apports_hm3`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Apports_hm3`. Unité source observée : `à confirmer` ; unité métier dominante : `Mm³`. Volume agrégé du cas : `34` lignes, dont `23` non nulles, `11` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `2776`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_154_apports_hm.sql`

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
