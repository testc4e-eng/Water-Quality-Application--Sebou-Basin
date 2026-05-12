# CAS-036 precipitation_jr

## Identification
- parametre_observe : `precipitation_jr`
- nom_standard : `Precip_jr`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_precipitations_jr`
- volumes : `669880` lignes, `507930` non nulles, `161950` nulles
- exemples : `0 | 0.05 | 0.1`

## Problème
Le paramètre `precipitation_jr` est rattaché à `Precip_jr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Precip_jr`. Unité source observée : `à confirmer` ; unité métier dominante : `mm/jour`. Volume agrégé du cas : `669880` lignes, dont `507930` non nulles, `161950` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `420`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_036_precipitation_jr.sql`

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
