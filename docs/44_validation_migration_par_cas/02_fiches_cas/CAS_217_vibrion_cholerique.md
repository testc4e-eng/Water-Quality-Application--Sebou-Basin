# CAS-217 Vibrion_Cholerique

## Identification
- parametre_observe : `Vibrion_Cholerique`
- nom_standard : `Vibrio`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_rivieres`
- volumes : `1` lignes, `1` non nulles, `0` nulles
- exemples : `3400`

## Problème
Le paramètre `Vibrion_Cholerique` est rattaché à `Vibrio`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Vibrio`. Unité source observée : `à confirmer` ; unité métier dominante : `UFC/100 mL`. Volume agrégé du cas : `1` lignes, dont `1` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `3400` / max `3400`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_217_vibrion_cholerique.sql`

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
