# CAS-070 Ph�nol

## Identification
- parametre_observe : `Ph�nol`
- nom_standard : `Phenol`
- type_cas : `UNIT_VALIDATION`
- unité source : `pH`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `687` lignes, `687` non nulles, `0` nulles
- exemples : `0 | 0.011 | 0.018 | 0.084 | 0.01 | 0.34`

## Problème
Le paramètre `Ph�nol` est rattaché à `Phenol`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Phenol`. Unité source observée : `pH` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `687` lignes, dont `687` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `0.04`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_070_phnol.sql`

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
