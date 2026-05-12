# CAS-060 TAC

## Identification
- parametre_observe : `TAC`
- nom_standard : `TAC`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg/L CaCO₃`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `3202` lignes, `3201` non nulles, `0` nulles
- exemples : `19.5 | 13.4 | 23.5 | 24.59 | 40.25 | 40.4`

## Problème
Le paramètre `TAC` est rattaché à `TAC`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `TAC`. Unité source observée : `mg/L CaCO₃` ; unité métier dominante : `meq/L`. Volume agrégé du cas : `3202` lignes, dont `3201` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.8` / max `1053`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_060_tac.sql`

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
