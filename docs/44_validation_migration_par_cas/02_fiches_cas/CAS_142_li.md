# CAS-142 Li

## Identification
- parametre_observe : `Li`
- nom_standard : `Li`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_rivieres`
- volumes : `50` lignes, `50` non nulles, `0` nulles
- exemples : `0.01 | 0.012 | 0.014 | <0,020 | 0,0082 | 0,0089`

## Problème
Le paramètre `Li` est rattaché à `Li`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Li`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `50` lignes, dont `50` non nulles, `0` nulles, `10` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.01` / max `3`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_142_li.sql`

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
