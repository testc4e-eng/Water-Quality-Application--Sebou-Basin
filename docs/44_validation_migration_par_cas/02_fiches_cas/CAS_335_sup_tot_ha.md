# CAS-335 sup_tot_ha

## Identification
- parametre_observe : `sup_tot_ha`
- nom_standard : `Superficie_ha`
- type_cas : `PARAMETER_MAPPING`
- unité source : `ha`
- criticité : `Moyenne`

## Données
- tables sources : `decharges_abhs`
- volumes : `233` lignes, `128` non nulles, `105` nulles
- exemples : `0.06 | 12 | 2.1085`

## Problème
Le rattachement de `sup_tot_ha` vers `Superficie_ha` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Superficie_ha`. Unité source observée : `ha` ; unité métier dominante : `ha`. Volume agrégé du cas : `233` lignes, dont `128` non nulles, `105` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.02` / max `700`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_335_sup_tot_ha.sql`

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
