# CAS-083 Cd

## Identification
- parametre_observe : `Cd`
- nom_standard : `Cd`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `325` lignes, `325` non nulles, `0` nulles
- exemples : `0 | 0.001 | 0.0015 | 0.0001 | 0.0002 | 0,0024`

## Problème
Le paramètre `Cd` est rattaché à `Cd`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cd`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `325` lignes, dont `325` non nulles, `0` nulles, `44` non numériques et `3` suspectes. Plage observée dans les audits existants : min `0` / max `1.4999999999999999E-2`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 0.003 mg/L`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_083_cd.sql`

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
