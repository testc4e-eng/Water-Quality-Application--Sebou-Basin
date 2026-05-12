# CAS-110 IBD

## Identification
- parametre_observe : `IBD`
- nom_standard : `IBD`
- type_cas : `UNIT_VALIDATION`
- unité source : `Indice`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_rivieres, types_mesures`
- volumes : `142` lignes, `141` non nulles, `0` nulles
- exemples : `0 | 11.054 | 13.411 | 10.031 | 10.052`

## Problème
Le paramètre `IBD` est rattaché à `IBD`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `IBD`. Unité source observée : `Indice` ; unité métier dominante : `— (indice /20)`. Volume agrégé du cas : `142` lignes, dont `141` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `16.422000000000001`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_110_ibd.sql`

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
