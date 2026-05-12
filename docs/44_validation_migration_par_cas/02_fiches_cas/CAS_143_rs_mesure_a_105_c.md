# CAS-143 RS  mesuré_à 105 °C

## Identification
- parametre_observe : `RS  mesuré_à 105 °C`
- nom_standard : `RS105`
- type_cas : `UNIT_VALIDATION`
- unité source : `°C`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `50` lignes, `50` non nulles, `0` nulles
- exemples : `à confirmer`

## Problème
Le paramètre `RS  mesuré_à 105 °C` est rattaché à `RS105`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `RS105`. Unité source observée : `°C` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `50` lignes, dont `50` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `168` / max `3596`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_143_rs_mesure_a_105_c.sql`

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
