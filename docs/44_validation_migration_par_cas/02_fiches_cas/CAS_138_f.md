# CAS-138 F

## Identification
- parametre_observe : `F`
- nom_standard : `F-`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `61` lignes, `61` non nulles, `0` nulles
- exemples : `1.06 | 1.2 | 644 | 0 | 0.02 | 0.05`

## Problème
Le paramètre `F` est rattaché à `F-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `F-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `61` lignes, dont `61` non nulles, `0` nulles, `0` non numériques et `2` suspectes. Plage observée dans les audits existants : min `1.06` / max `690`. Référence externe déjà associée dans l'audit précédent : `<= 1.5 mg/L`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_138_f.sql`

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
