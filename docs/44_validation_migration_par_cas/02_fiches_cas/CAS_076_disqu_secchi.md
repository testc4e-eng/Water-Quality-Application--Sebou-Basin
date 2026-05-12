# CAS-076 disqu_secchi

## Identification
- parametre_observe : `disqu_secchi`
- nom_standard : `Disque_Secchi`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_src_pollution_globale, idp_2024_src_pollution_marche_cadre`
- volumes : `391` lignes, `22` non nulles, `369` nulles
- exemples : `0.2 | 0.35 | 0.4 | 0.8 | 2.1 | 6.1`

## Problème
Le paramètre `disqu_secchi` est rattaché à `Disque_Secchi`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Disque_Secchi`. Unité source observée : `à confirmer` ; unité métier dominante : `m`. Volume agrégé du cas : `391` lignes, dont `22` non nulles, `369` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.15` / max `0.6`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_076_disqu_secchi.sql`

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
