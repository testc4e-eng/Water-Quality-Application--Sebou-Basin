# CAS-044 DCO

## Identification
- parametre_observe : `DCO`
- nom_standard : `DCO`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg O2/L`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre, mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, suivi_qualite_sebou_jr, types_mesures`
- volumes : `7028` lignes, `7027` non nulles, `0` nulles
- exemples : `13.4 | 94.1 | 27.8 | 0 | 0.247 | 0.262`

## Problème
Le paramètre `DCO` est rattaché à `DCO`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `DCO`. Unité source observée : `mg O2/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `7028` lignes, dont `7027` non nulles, `0` nulles, `21` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.77` / max `199`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT, NON_PARSEABLE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_044_dco.sql`

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
