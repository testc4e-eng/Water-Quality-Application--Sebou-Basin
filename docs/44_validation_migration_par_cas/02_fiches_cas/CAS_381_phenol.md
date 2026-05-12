# CAS-381 Phénol

## Identification
- parametre_observe : `Phénol`
- nom_standard : `Phenol`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `types_mesures`
- volumes : `1` lignes, `0` non nulles, `0` nulles
- exemples : `à confirmer`

## Problème
Le rattachement de `Phénol` vers `Phenol` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Phenol`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `1` lignes, dont `0` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_381_phenol.sql`

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
