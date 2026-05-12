# CAS-125 NO2- _Spectro.

## Identification
- parametre_observe : `NO2- _Spectro.`
- nom_standard : `NO2-`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `89` lignes, `89` non nulles, `0` nulles
- exemples : `0,036 | 0,01 | 0,114 | <0,010 | 5,62 | 0,049`

## Problème
Le paramètre `NO2- _Spectro.` est rattaché à `NO2-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `NO2-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `89` lignes, dont `89` non nulles, `0` nulles, `49` non numériques et `1` suspectes. Plage observée dans les audits existants : min `0.01` / max `6.81`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 3 mg/L as nitrite`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_125_no2_spectro.sql`

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
