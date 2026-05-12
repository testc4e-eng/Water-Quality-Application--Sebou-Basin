# CAS-045 DBO5

## Identification
- parametre_observe : `DBO5`
- nom_standard : `DBO5`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg O2/L`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre, mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, suivi_qualite_sebou_jr, types_mesures`
- volumes : `6884` lignes, `6883` non nulles, `0` nulles
- exemples : `1.6 | 0.6 | 0.3 | 1 | 1.3 | 11`

## Problème
Le paramètre `DBO5` est rattaché à `DBO5`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `DBO5`. Unité source observée : `mg O2/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `6884` lignes, dont `6883` non nulles, `0` nulles, `6` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.2` / max `23`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_045_dbo5.sql`

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
