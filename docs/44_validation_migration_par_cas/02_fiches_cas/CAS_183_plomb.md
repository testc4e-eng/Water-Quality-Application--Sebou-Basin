# CAS-183 Plomb

## Identification
- parametre_observe : `Plomb`
- nom_standard : `Pb`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `8` lignes, `8` non nulles, `0` nulles
- exemples : `<0,005 | <0,010`

## Problème
Le paramètre `Plomb` est rattaché à `Pb`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Pb`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `8` lignes, dont `8` non nulles, `0` nulles, `8` non numériques et `1` suspectes. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `<= 0.01 mg/L`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_183_plomb.sql`

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
