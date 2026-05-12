# CAS-063 O2_diss

## Identification
- parametre_observe : `O2_diss`
- nom_standard : `O2_dissous`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg O2/L`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `2812` lignes, `2811` non nulles, `0` nulles
- exemples : `10.2 | 7.54 | 9.98 | 0 | 0.031 | 0.188`

## Problème
Le paramètre `O2_diss` est rattaché à `O2_dissous`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `O2_dissous`. Unité source observée : `mg O2/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `2812` lignes, dont `2811` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.2` / max `921.2`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_063_o2_diss.sql`

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
