# CAS-177 Chrome

## Identification
- parametre_observe : `Chrome`
- nom_standard : `Cr`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `8` lignes, `8` non nulles, `0` nulles
- exemples : `0,009 | <0,005 | <0,010`

## Problème
Le paramètre `Chrome` est rattaché à `Cr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cr`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `8` lignes, dont `8` non nulles, `0` nulles, `7` non numériques et `0` suspectes. Plage observée dans les audits existants : min `8.9999999999999993E-3` / max `8.9999999999999993E-3`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_177_chrome.sql`

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
