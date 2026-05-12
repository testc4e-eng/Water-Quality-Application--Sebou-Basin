# CAS-162 somme anions_meq/l3

## Identification
- parametre_observe : `somme anions_meq/l3`
- nom_standard : `Som_anions`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `28` lignes, `28` non nulles, `0` nulles
- exemples : `25,059986 | 43,08299183 | 58,39430646`

## Problème
Le paramètre `somme anions_meq/l3` est rattaché à `Som_anions`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Som_anions`. Unité source observée : `à confirmer` ; unité métier dominante : `meq/L ou mg/L`. Volume agrégé du cas : `28` lignes, dont `28` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `3.50430391` / max `252.75308910000001`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_162_somme_anions_meq_l3.sql`

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
