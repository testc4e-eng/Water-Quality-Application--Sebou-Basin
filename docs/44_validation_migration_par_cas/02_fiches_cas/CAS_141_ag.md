# CAS-141 Ag

## Identification
- parametre_observe : `Ag`
- nom_standard : `Ag`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_rivieres`
- volumes : `55` lignes, `55` non nulles, `0` nulles
- exemples : `0.01 | 0.03 | 19 | <0,010 | <0,0067`

## Problème
Le paramètre `Ag` est rattaché à `Ag`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Ag`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `55` lignes, dont `55` non nulles, `0` nulles, `46` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.01` / max `19`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_141_ag.sql`

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
