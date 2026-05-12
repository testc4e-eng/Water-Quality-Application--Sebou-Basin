# CAS-327 Turbidite

## Identification
- parametre_observe : `Turbidite`
- nom_standard : `Turbidite`
- type_cas : `PARAMETER_MAPPING`
- unité source : `NTU`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `1997` lignes, `1996` non nulles, `0` nulles
- exemples : `8 | 19.5 | 1280 | 0 | 2.4 | 26`

## Problème
Le rattachement de `Turbidite` vers `Turbidite` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Turbidite`. Unité source observée : `NTU` ; unité métier dominante : `NTU`. Volume agrégé du cas : `1997` lignes, dont `1996` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.7` / max `16800`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_327_turbidite.sql`

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
