# CAS-370 S

## Identification
- parametre_observe : `S`
- nom_standard : `S²-`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `10` lignes, `9` non nulles, `0` nulles
- exemples : `0.026 | 20.8 | 29.6 | 3.8 | 0 | 0.02`

## Problème
Le rattachement de `S` vers `S²-` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `S²-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `10` lignes, dont `9` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.5999999999999999E-2` / max `2.5999999999999999E-2`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_370_s.sql`

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
