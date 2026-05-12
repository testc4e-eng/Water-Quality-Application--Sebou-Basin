# CAS-145 IBGN

## Identification
- parametre_observe : `IBGN`
- nom_standard : `IBGN`
- type_cas : `UNIT_VALIDATION`
- unité source : `Indice`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_rivieres, types_mesures`
- volumes : `47` lignes, `46` non nulles, `0` nulles
- exemples : `13 | 15 | 9 | 1 | 10 | 11`

## Problème
Le paramètre `IBGN` est rattaché à `IBGN`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `IBGN`. Unité source observée : `Indice` ; unité métier dominante : `— (indice /20)`. Volume agrégé du cas : `47` lignes, dont `46` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `9` / max `15`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_145_ibgn.sql`

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
