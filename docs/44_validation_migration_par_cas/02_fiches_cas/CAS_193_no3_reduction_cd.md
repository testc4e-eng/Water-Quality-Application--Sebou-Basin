# CAS-193 NO3-_Réduction Cd

## Identification
- parametre_observe : `NO3-_Réduction Cd`
- nom_standard : `NO3-`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `4` lignes, `4` non nulles, `0` nulles
- exemples : `0,127 | 3,55 | 3,3 | 0,057`

## Problème
Le paramètre `NO3-_Réduction Cd` est rattaché à `NO3-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `NO3-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4` lignes, dont `4` non nulles, `0` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `5.7000000000000002E-2` / max `3.55`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 50 mg/L as nitrate`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_193_no3_reduction_cd.sql`

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
