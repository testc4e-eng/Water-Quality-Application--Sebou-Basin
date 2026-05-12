# CAS-334 sup_occupee_ha

## Identification
- parametre_observe : `sup_occupee_ha`
- nom_standard : `Superficie_ha`
- type_cas : `PARAMETER_MAPPING`
- unité source : `ha`
- criticité : `Moyenne`

## Données
- tables sources : `decharges_abhs`
- volumes : `233` lignes, `108` non nulles, `125` nulles
- exemples : `13.5 | 10 | 0.005`

## Problème
Le rattachement de `sup_occupee_ha` vers `Superficie_ha` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Superficie_ha`. Unité source observée : `ha` ; unité métier dominante : `ha`. Volume agrégé du cas : `233` lignes, dont `108` non nulles, `125` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.0000000000000001E-3` / max `128`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_334_sup_occupee_ha.sql`

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
