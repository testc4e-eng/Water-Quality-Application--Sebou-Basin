# CAS-332 Azote_Total

## Identification
- parametre_observe : `Azote_Total`
- nom_standard : `N_tot`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_rivieres, types_mesures`
- volumes : `370` lignes, `369` non nulles, `0` nulles
- exemples : `0.133 | 0.175 | 0.302 | 44.8 | 0.251 | 54.66`

## Problème
Le rattachement de `Azote_Total` vers `N_tot` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `N_tot`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `370` lignes, dont `369` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.13300000000000001` / max `5.04`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_332_azote_total.sql`

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
