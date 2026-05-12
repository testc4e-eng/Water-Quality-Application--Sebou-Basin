# CAS-139 DCO_dec2h

## Identification
- parametre_observe : `DCO_dec2h`
- nom_standard : `DCO_dec2h`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg O2/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_rivieres, types_mesures`
- volumes : `59` lignes, `58` non nulles, `0` nulles
- exemples : `34.27 | 0 | 10 | 102`

## Problème
Le paramètre `DCO_dec2h` est rattaché à `DCO_dec2h`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `DCO_dec2h`. Unité source observée : `mg O2/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `59` lignes, dont `58` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `34.270000000000003` / max `34.270000000000003`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_139_dco_dec2h.sql`

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
