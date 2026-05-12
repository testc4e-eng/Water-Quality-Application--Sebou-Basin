# CAS-365 superficie_ha

## Identification
- parametre_observe : `superficie_ha`
- nom_standard : `Superficie_ha`
- type_cas : `PARAMETER_MAPPING`
- unité source : `ha`
- criticité : `Moyenne`

## Données
- tables sources : `step_abhs`
- volumes : `41` lignes, `25` non nulles, `16` nulles
- exemples : `0.945 | 10 | 7`

## Problème
Le rattachement de `superficie_ha` vers `Superficie_ha` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Superficie_ha`. Unité source observée : `ha` ; unité métier dominante : `ha`. Volume agrégé du cas : `41` lignes, dont `25` non nulles, `16` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.7` / max `37`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_365_superficie_ha.sql`

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
