# CAS-052 CT

## Identification
- parametre_observe : `CT`
- nom_standard : `CT`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg/L`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre, mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `4725` lignes, `4724` non nulles, `0` nulles
- exemples : `3,4x102 | 1,8x102 | 1,1x102 | 6,2X102 | 5,0X103 | 1,5.104`

## Problème
Le paramètre `CT` est rattaché à `CT`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `CT`. Unité source observée : `mg/L` ; unité métier dominante : `UFC/100 mL`. Volume agrégé du cas : `4725` lignes, dont `4724` non nulles, `0` nulles, `234` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `90`. Types de valeurs identifiés : `NON_PARSEABLE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_052_ct.sql`

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
