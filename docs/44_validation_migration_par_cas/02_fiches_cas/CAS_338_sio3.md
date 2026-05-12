# CAS-338 SiO3

## Identification
- parametre_observe : `SiO3`
- nom_standard : `SiO3`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `191` lignes, `190` non nulles, `0` nulles
- exemples : `0.5 | 0.839 | 0.89 | 16.05 | 29.2 | 36.2`

## Problème
Le rattachement de `SiO3` vers `SiO3` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `SiO3`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `191` lignes, dont `190` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.5` / max `30.06`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_338_sio3.sql`

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
