# CAS-144 Sb

## Identification
- parametre_observe : `Sb`
- nom_standard : `Sb`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_rivieres`
- volumes : `49` lignes, `49` non nulles, `0` nulles
- exemples : `0,0109 | <0,010 | 0 | 0.076`

## Problème
Le paramètre `Sb` est rattaché à `Sb`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Sb`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `49` lignes, dont `49` non nulles, `0` nulles, `45` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.09E-2` / max `1.09E-2`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_144_sb.sql`

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
