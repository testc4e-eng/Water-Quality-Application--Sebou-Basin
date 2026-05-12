# CAS-374 CF

## Identification
- parametre_observe : `CF`
- nom_standard : `CF`
- type_cas : `PARAMETER_MAPPING`
- unité source : `UFC/100mL`
- criticité : `Moyenne`

## Données
- tables sources : `types_mesures`
- volumes : `1` lignes, `0` non nulles, `0` nulles
- exemples : `à confirmer`

## Problème
Le paramètre `CF` est déjà rattaché au standard métier `CF`, mais la décision de migration reste à tracer cas par cas avant tout chargement.

## Analyse
Mapping observé : `CF`. Unité source observée : `UFC/100mL` ; unité métier dominante : `UFC/100 mL`. Volume agrégé du cas : `1` lignes, dont `0` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Référence externe déjà associée dans l'audit précédent : `<= 100 geom. mean ; <= 320 STV cfu/100 mL`.

## Proposition
- action : `MIGRATE`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_374_cf.sql`

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
