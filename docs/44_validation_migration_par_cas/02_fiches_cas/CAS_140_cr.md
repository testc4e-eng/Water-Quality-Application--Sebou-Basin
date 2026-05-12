# CAS-140 Cr

## Identification
- parametre_observe : `Cr`
- nom_standard : `Cr`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `57` lignes, `57` non nulles, `0` nulles
- exemples : `0.013 | 0.02 | 0.085 | 0 | 0.001 | 0.002`

## Problème
Le paramètre `Cr` est rattaché à `Cr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cr`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `57` lignes, dont `57` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.2999999999999999E-2` / max `8.5000000000000006E-2`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_140_cr.sql`

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
