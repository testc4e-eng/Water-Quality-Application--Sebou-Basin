# CAS-187 Couleur

## Identification
- parametre_observe : `Couleur`
- nom_standard : `Couleur`
- type_cas : `UNIT_VALIDATION`
- unité source : `UCV`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `5` lignes, `4` non nulles, `0` nulles
- exemples : `0.073 | 0.1 | 0.02 | 0.025`

## Problème
Le paramètre `Couleur` est rattaché à `Couleur`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Couleur`. Unité source observée : `UCV` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `5` lignes, dont `4` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `7.2999999999999995E-2` / max `7.2999999999999995E-2`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_187_couleur.sql`

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
