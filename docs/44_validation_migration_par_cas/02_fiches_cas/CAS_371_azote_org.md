# CAS-371 Azote_Org

## Identification
- parametre_observe : `Azote_Org`
- nom_standard : `N_org`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `5` lignes, `4` non nulles, `0` nulles
- exemples : `0.25 | 0.15 | 0`

## Problème
Le rattachement de `Azote_Org` vers `N_org` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `N_org`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `5` lignes, dont `4` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.25` / max `0.25`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_371_azote_org.sql`

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
