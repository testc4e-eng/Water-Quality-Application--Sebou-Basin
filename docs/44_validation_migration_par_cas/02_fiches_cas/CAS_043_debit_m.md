# CAS-043 debit_m

## Identification
- parametre_observe : `debit_m`
- nom_standard : `Debit_m / Debit_jr`
- type_cas : `UNIT_VALIDATION`
- unité source : `m`
- criticité : `Élevée`

## Données
- tables sources : `mesures_debit_m`
- volumes : `19316` lignes, `19316` non nulles, `0` nulles
- exemples : `1.267579233 | 9.937586207 | 15.10652081`

## Problème
Le paramètre `debit_m` est rattaché à `Debit_m / Debit_jr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Debit_m / Debit_jr`. Unité source observée : `m` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `19316` lignes, dont `19316` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `2131.5666219999998`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_043_debit_m.sql`

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
