# CAS-091 Hg

## Identification
- parametre_observe : `Hg`
- nom_standard : `HG / Hg`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `261` lignes, `261` non nulles, `0` nulles
- exemples : `0.0005 | 0.0008 | 0.0013 | 0 | 0.0001 | 0.00013`

## Problème
Le paramètre `Hg` est rattaché à `HG / Hg`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `HG / Hg`. Unité source observée : `à confirmer` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `261` lignes, dont `261` non nulles, `0` nulles, `24` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.0000000000000001E-4` / max `1.2999999999999999E-3`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_091_hg.sql`

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
