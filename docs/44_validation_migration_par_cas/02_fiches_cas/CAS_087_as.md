# CAS-087 As

## Identification
- parametre_observe : `As`
- nom_standard : `As`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `289` lignes, `289` non nulles, `0` nulles
- exemples : `0.01 | 0.015 | 0 | 0.002 | 0.0021 | <0,005`

## Problème
Le paramètre `As` est rattaché à `As`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `As`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `289` lignes, dont `289` non nulles, `0` nulles, `46` non numériques et `3` suspectes. Plage observée dans les audits existants : min `0.01` / max `1.4999999999999999E-2`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `<= 0.01 mg/L`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_087_as.sql`

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
