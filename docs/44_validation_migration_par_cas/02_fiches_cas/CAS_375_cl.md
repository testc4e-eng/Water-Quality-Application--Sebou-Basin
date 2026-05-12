# CAS-375 Cl

## Identification
- parametre_observe : `Cl`
- nom_standard : `Cl-`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `types_mesures`
- volumes : `1` lignes, `0` non nulles, `0` nulles
- exemples : `à confirmer`

## Problème
Le paramètre `Cl` est déjà rattaché au standard métier `Cl-`, mais la décision de migration reste à tracer cas par cas avant tout chargement.

## Analyse
Mapping observé : `Cl-`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `1` lignes, dont `0` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Référence externe déjà associée dans l'audit précédent : `<= 250 (acceptabilité) mg/L`.

## Proposition
- action : `MIGRATE`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_375_cl.sql`

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
