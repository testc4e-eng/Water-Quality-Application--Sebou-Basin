# CAS-320 HCO3-

## Identification
- parametre_observe : `HCO3-`
- nom_standard : `HCO3-`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `4564` lignes, `4563` non nulles, `0` nulles
- exemples : `247 | 250 | 113 | 10.9 | 21.96 | 575.8`

## Problème
Le rattachement de `HCO3-` vers `HCO3-` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `HCO3-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4564` lignes, dont `4563` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `878.8`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_320_hco3.sql`

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
