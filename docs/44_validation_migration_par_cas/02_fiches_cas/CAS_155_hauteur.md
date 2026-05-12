# CAS-155 hauteur

## Identification
- parametre_observe : `hauteur`
- nom_standard : `Hauteur`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `barrages_abhs`
- volumes : `34` lignes, `33` non nulles, `1` nulles
- exemples : `10 | 88 | 15`

## Problème
Le paramètre `hauteur` est rattaché à `Hauteur`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Hauteur`. Unité source observée : `à confirmer` ; unité métier dominante : `m`. Volume agrégé du cas : `34` lignes, dont `33` non nulles, `1` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `112`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_155_hauteur.sql`

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
