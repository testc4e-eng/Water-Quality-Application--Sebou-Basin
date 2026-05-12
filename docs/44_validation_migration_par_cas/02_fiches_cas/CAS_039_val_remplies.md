# CAS-039 val_remplies

## Identification
- parametre_observe : `val_remplies`
- nom_standard : `Val_remplies`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_precipitations_jr_traitees`
- volumes : `546007` lignes, `546007` non nulles, `0` nulles
- exemples : `0 | 0.003225806 | 0.012739591`

## Problème
Le paramètre `val_remplies` est rattaché à `Val_remplies`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Val_remplies`. Unité source observée : `à confirmer` ; unité métier dominante : `— (variable)`. Volume agrégé du cas : `546007` lignes, dont `546007` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `420`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_039_val_remplies.sql`

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
