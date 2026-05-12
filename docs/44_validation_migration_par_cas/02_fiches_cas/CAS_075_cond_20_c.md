# CAS-075 cond_20_c

## Identification
- parametre_observe : `cond_20_c`
- nom_standard : `Cond`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_src_pollution_globale, idp_2024_src_pollution_marche_cadre`
- volumes : `391` lignes, `328` non nulles, `63` nulles
- exemples : `34000 | 1919 | 1626 | 1070 | 1145 | 462`

## Problème
Le paramètre `cond_20_c` est rattaché à `Cond`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cond`. Unité source observée : `à confirmer` ; unité métier dominante : `µS/cm`. Volume agrégé du cas : `391` lignes, dont `328` non nulles, `63` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.25` / max `34000`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_075_cond_20_c.sql`

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
