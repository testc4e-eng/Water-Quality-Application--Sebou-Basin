# CAS-085 Ni

## Identification
- parametre_observe : `Ni`
- nom_standard : `Ni`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `317` lignes, `317` non nulles, `0` nulles
- exemples : `0,0188 | 0,0133 | 0,0124 | <0,010 | 0,01 | 0,0102`

## Problème
Le paramètre `Ni` est rattaché à `Ni`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Ni`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `317` lignes, dont `317` non nulles, `0` nulles, `28` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.01` / max `7.3899999999999993E-2`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_085_ni.sql`

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
