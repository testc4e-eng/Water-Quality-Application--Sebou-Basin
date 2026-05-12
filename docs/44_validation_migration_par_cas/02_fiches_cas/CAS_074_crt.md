# CAS-074 CrT

## Identification
- parametre_observe : `CrT`
- nom_standard : `Cr`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `437` lignes, `437` non nulles, `0` nulles
- exemples : `0.02 | 0.06 | 0.011 | 0.43 | 0.3 | <0,005`

## Problème
Le paramètre `CrT` est rattaché à `Cr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cr`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `437` lignes, dont `437` non nulles, `0` nulles, `16` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.02` / max `0.06`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_074_crt.sql`

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
