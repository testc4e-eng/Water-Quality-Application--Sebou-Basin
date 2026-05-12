# CAS-318 T_Air

## Identification
- parametre_observe : `T_Air`
- nom_standard : `T_air`
- type_cas : `PARAMETER_MAPPING`
- unité source : `°C`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `5033` lignes, `5032` non nulles, `0` nulles
- exemples : `30.6 | 19.5 | 75 | 8.22 | 21.7 | 20.9`

## Problème
Le rattachement de `T_Air` vers `T_air` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `T_air`. Unité source observée : `°C` ; unité métier dominante : `°C`. Volume agrégé du cas : `5033` lignes, dont `5032` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `7` / max `108`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_318_t_air.sql`

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
