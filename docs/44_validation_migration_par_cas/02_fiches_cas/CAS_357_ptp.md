# CAS-357 PTP

## Identification
- parametre_observe : `PTP`
- nom_standard : `PTP`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `137` lignes, `136` non nulles, `0` nulles
- exemples : `0.03 | 22.8 | 26.3 | 10 | 10.2 | 10.7`

## Problème
Le rattachement de `PTP` vers `PTP` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `PTP`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `137` lignes, dont `136` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.03` / max `80.7`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_357_ptp.sql`

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
