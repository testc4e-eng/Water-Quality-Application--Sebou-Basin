# CAS-337 Detergent

## Identification
- parametre_observe : `Detergent`
- nom_standard : `Detergent`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `192` lignes, `191` non nulles, `0` nulles
- exemples : `0.15 | 0.59 | 0 | 0.007 | 0.01`

## Problème
Le rattachement de `Detergent` vers `Detergent` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Detergent`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `192` lignes, dont `191` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.15` / max `0.15`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_337_detergent.sql`

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
