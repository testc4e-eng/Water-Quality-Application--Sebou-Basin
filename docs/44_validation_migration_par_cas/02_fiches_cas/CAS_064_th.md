# CAS-064 TH

## Identification
- parametre_observe : `TH`
- nom_standard : `TH`
- type_cas : `UNIT_VALIDATION`
- unité source : `°F`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre, mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `2743` lignes, `2742` non nulles, `0` nulles
- exemples : `330,9980656 | 21,28095661 | 33,50342525 | 47,49500998 | 25,02279392 | 33,9817279`

## Problème
Le paramètre `TH` est rattaché à `TH`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `TH`. Unité source observée : `°F` ; unité métier dominante : `meq/L`. Volume agrégé du cas : `2743` lignes, dont `2742` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `11.512099259999999` / max `437.48447549999997`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_064_th.sql`

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
