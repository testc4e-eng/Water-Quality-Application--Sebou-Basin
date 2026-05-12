# CAS-361 dist_pt_eau_foyer_pollut_m

## Identification
- parametre_observe : `dist_pt_eau_foyer_pollut_m`
- nom_standard : `Dist_foyer`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m`
- criticité : `Moyenne`

## Données
- tables sources : `points_eau_abhs`
- volumes : `46` lignes, `28` non nulles, `18` nulles
- exemples : `340 | 1700 | 800`

## Problème
Le rattachement de `dist_pt_eau_foyer_pollut_m` vers `Dist_foyer` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Dist_foyer`. Unité source observée : `m` ; unité métier dominante : `m`. Volume agrégé du cas : `46` lignes, dont `28` non nulles, `18` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2` / max `1700`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_361_dist_pt_eau_foyer_pollut_m.sql`

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
