# CAS-094 eau_ss_terr_niv_statique_m_sol

## Identification
- parametre_observe : `eau_ss_terr_niv_statique_m_sol`
- nom_standard : `Eau_ss_terr`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_src_pollution_globale`
- volumes : `243` lignes, `11` non nulles, `232` nulles
- exemples : `3.6 | 3.5 | 11.8`

## Problème
Le paramètre `eau_ss_terr_niv_statique_m_sol` est rattaché à `Eau_ss_terr`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Eau_ss_terr`. Unité source observée : `à confirmer` ; unité métier dominante : `m`. Volume agrégé du cas : `243` lignes, dont `11` non nulles, `232` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.7` / max `12`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_094_eau_ss_terr_niv_statique_m_sol.sql`

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
