# CAS-324 Ca

## Identification
- parametre_observe : `Ca`
- nom_standard : `Ca`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `4418` lignes, `4417` non nulles, `0` nulles
- exemples : `49.7 | 63.8 | 95.4 | 59.1 | 124.3 | 144.3`

## Problème
Le rattachement de `Ca` vers `Ca` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Ca`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4418` lignes, dont `4417` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `19` / max `260`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_324_ca.sql`

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
