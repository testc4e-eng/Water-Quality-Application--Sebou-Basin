# CAS-170 Cond 25°C

## Identification
- parametre_observe : `Cond 25°C`
- nom_standard : `Cond`
- type_cas : `UNIT_VALIDATION`
- unité source : `°C`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `13` lignes, `13` non nulles, `0` nulles
- exemples : `1929,564 | 1314,648 | 1113,768`

## Problème
Le paramètre `Cond 25°C` est rattaché à `Cond`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cond`. Unité source observée : `°C` ; unité métier dominante : `µS/cm`. Volume agrégé du cas : `13` lignes, dont `13` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `554.65200000000004` / max `17454.240000000002`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_170_cond_25c.sql`

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
