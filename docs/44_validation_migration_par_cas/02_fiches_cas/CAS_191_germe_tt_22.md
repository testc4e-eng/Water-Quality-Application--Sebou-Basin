# CAS-191 Germe_tt_22

## Identification
- parametre_observe : `Germe_tt_22`
- nom_standard : `Germe_22`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_rivieres`
- volumes : `4` lignes, `4` non nulles, `0` nulles
- exemples : `0 | 3 | 3400`

## Problème
Le paramètre `Germe_tt_22` est rattaché à `Germe_22`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Germe_22`. Unité source observée : `à confirmer` ; unité métier dominante : `UFC/mL`. Volume agrégé du cas : `4` lignes, dont `4` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `3400`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_191_germe_tt_22.sql`

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
