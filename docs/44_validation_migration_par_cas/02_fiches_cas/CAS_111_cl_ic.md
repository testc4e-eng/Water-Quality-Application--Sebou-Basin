# CAS-111 Cl-_IC

## Identification
- parametre_observe : `Cl-_IC`
- nom_standard : `Cl-`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `127` lignes, `127` non nulles, `0` nulles
- exemples : `64,9 | 56,2 | 74,2 | 60,9 | 27,3 | 129`

## Problème
Le paramètre `Cl-_IC` est rattaché à `Cl-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cl-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `127` lignes, dont `127` non nulles, `0` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `3.77` / max `20625`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 250 (acceptabilité) mg/L`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_111_cl_ic.sql`

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
