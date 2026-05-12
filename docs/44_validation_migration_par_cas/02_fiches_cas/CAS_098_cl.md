# CAS-098 Cl-

## Identification
- parametre_observe : `Cl-`
- nom_standard : `Cl-`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `189` lignes, `189` non nulles, `0` nulles
- exemples : `269,848 | 85,1 | 79,7 | 497 | 395 | 173`

## Problème
Le paramètre `Cl-` est rattaché à `Cl-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cl-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `189` lignes, dont `189` non nulles, `0` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `5.9` / max `14508`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 250 (acceptabilité) mg/L`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_098_cl.sql`

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
