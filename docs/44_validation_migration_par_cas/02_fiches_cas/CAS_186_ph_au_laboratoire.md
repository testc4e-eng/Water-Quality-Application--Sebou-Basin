# CAS-186 pH au laboratoire

## Identification
- parametre_observe : `pH au laboratoire`
- nom_standard : `pH`
- type_cas : `UNIT_VALIDATION`
- unité source : `pH`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `7` lignes, `4` non nulles, `3` nulles
- exemples : `(*) Interférence probable des ions chlorures sur l'analyse de la DCO. | (*) NM = Disque de secchi n'est pas mesuré, l'accès est difficile.`

## Problème
Le paramètre `pH au laboratoire` est rattaché à `pH`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `pH`. Unité source observée : `pH` ; unité métier dominante : `— (sans unité)`. Volume agrégé du cas : `7` lignes, dont `4` non nulles, `3` nulles, `4` non numériques et `1` suspectes. Types de valeurs identifiés : `EMPTY_VALUE`. Référence externe déjà associée dans l'audit précédent : `6.5-8.5 pH`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_186_ph_au_laboratoire.sql`

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
