# CAS-118 Al

## Identification
- parametre_observe : `Al`
- nom_standard : `Al`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `104` lignes, `104` non nulles, `0` nulles
- exemples : `0.02 | 0.0364 | 0.051 | 0.0034 | 0.012 | 0.0207`

## Problème
Le paramètre `Al` est rattaché à `Al`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Al`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `104` lignes, dont `104` non nulles, `0` nulles, `1` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.02` / max `7.0000000000000007E-2`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_118_al.sql`

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
