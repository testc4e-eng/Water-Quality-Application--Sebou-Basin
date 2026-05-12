# CAS-363 profond_tot_m

## Identification
- parametre_observe : `profond_tot_m`
- nom_standard : `Profondeur`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m`
- criticité : `Moyenne`

## Données
- tables sources : `points_eau_abhs`
- volumes : `46` lignes, `28` non nulles, `18` nulles
- exemples : `470 | 10 | 15`

## Problème
Le rattachement de `profond_tot_m` vers `Profondeur` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Profondeur`. Unité source observée : `m` ; unité métier dominante : `m`. Volume agrégé du cas : `46` lignes, dont `28` non nulles, `18` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5` / max `625`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_363_profond_tot_m.sql`

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
