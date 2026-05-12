# CAS-050 NTK

## Identification
- parametre_observe : `NTK`
- nom_standard : `NTK`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, suivi_qualite_sebou_jr`
- volumes : `4735` lignes, `4735` non nulles, `0` nulles
- exemples : `0.647 | 40.4 | 0.799 | <0,2 | 537,6 | 58,8`

## Problème
Le paramètre `NTK` est rattaché à `NTK`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `NTK`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4735` lignes, dont `4735` non nulles, `0` nulles, `1` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `3752`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_050_ntk.sql`

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
