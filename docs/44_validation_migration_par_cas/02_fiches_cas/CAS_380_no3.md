# CAS-380 NO3-

## Identification
- parametre_observe : `NO3-`
- nom_standard : `NO3-`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `types_mesures`
- volumes : `1` lignes, `0` non nulles, `0` nulles
- exemples : `à confirmer`

## Problème
Le paramètre `NO3-` est déjà rattaché au standard métier `NO3-`, mais la décision de migration reste à tracer cas par cas avant tout chargement.

## Analyse
Mapping observé : `NO3-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `1` lignes, dont `0` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Référence externe déjà associée dans l'audit précédent : `<= 50 mg/L as nitrate`.

## Proposition
- action : `MIGRATE`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_380_no3.sql`

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
