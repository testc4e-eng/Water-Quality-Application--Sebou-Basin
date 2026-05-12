# CAS-323 CO3

## Identification
- parametre_observe : `CO3`
- nom_standard : `CO3²-`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `4420` lignes, `4419` non nulles, `0` nulles
- exemples : `0 | 14.4 | 18 | 1.2 | 6 | 26.4`

## Problème
Le rattachement de `CO3` vers `CO3²-` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `CO3²-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4420` lignes, dont `4419` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `0`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_323_co3.sql`

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
