# CAS-166 RS  mesuré

## Identification
- parametre_observe : `RS  mesuré`
- nom_standard : `RS105`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `24` lignes, `24` non nulles, `0` nulles
- exemples : `à confirmer`

## Problème
Le paramètre `RS  mesuré` est rattaché à `RS105`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `RS105`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `24` lignes, dont `24` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `252` / max `4171`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_166_rs_mesure.sql`

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
