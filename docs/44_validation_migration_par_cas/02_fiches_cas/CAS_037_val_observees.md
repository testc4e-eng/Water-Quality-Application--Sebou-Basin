# CAS-037 val_observees

## Identification
- parametre_observe : `val_observees`
- nom_standard : `Val_obs`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_precipitations_jr_traitees`
- volumes : `546007` lignes, `500305` non nulles, `45702` nulles
- exemples : `0 | 0.05 | 0.1`

## Problème
Le paramètre `val_observees` est rattaché à `Val_obs`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Val_obs`. Unité source observée : `à confirmer` ; unité métier dominante : `— (variable)`. Volume agrégé du cas : `546007` lignes, dont `500305` non nulles, `45702` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `420`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_037_val_observees.sql`

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
