# CAS-358 Profondeur

## Identification
- parametre_observe : `Profondeur`
- nom_standard : `Profondeur`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `124` lignes, `123` non nulles, `0` nulles
- exemples : `0 | 0.2 | 0.35 | 2 | 0.1 | 0.15`

## Problème
Le rattachement de `Profondeur` vers `Profondeur` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Profondeur`. Unité source observée : `m` ; unité métier dominante : `m`. Volume agrégé du cas : `124` lignes, dont `123` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `55`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_358_profondeur.sql`

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
