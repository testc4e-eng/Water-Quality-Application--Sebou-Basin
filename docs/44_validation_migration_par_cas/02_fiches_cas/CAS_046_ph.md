# CAS-046 ph

## Identification
- parametre_observe : `ph`
- nom_standard : `pH`
- type_cas : `UNIT_VALIDATION`
- unité source : `pH`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_src_pollution_globale, idp_2024_src_pollution_marche_cadre, mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `5457` lignes, `5393` non nulles, `63` nulles
- exemples : `7.7 | 7.35 | 8.7 | 8 | 7.75 | 7.2`

## Problème
Le paramètre `ph` est rattaché à `pH`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `pH`. Unité source observée : `pH` ; unité métier dominante : `— (sans unité)`. Volume agrégé du cas : `5457` lignes, dont `5393` non nulles, `63` nulles, `0` non numériques et `6` suspectes. Plage observée dans les audits existants : min `6.6` / max `9`. Référence externe déjà associée dans l'audit précédent : `6.5-8.5 pH`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_046_ph.sql`

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
