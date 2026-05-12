# CAS-149 Sn

## Identification
- parametre_observe : `Sn`
- nom_standard : `Sn`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `42` lignes, `42` non nulles, `0` nulles
- exemples : `<0,010 | 0,0102 | 0,0106`

## Problème
Le paramètre `Sn` est rattaché à `Sn`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Sn`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `42` lignes, dont `42` non nulles, `0` nulles, `13` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.0200000000000001E-2` / max `0.88480000000000003`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_149_sn.sql`

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
