# CAS-133 Mn5

## Identification
- parametre_observe : `Mn5`
- nom_standard : `Mn`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `88` lignes, `88` non nulles, `0` nulles
- exemples : `0,448 | 0,166 | 0,111 | 0,214 | 0,175 | 0,167`

## Problème
Le paramètre `Mn5` est rattaché à `Mn`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Mn`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `88` lignes, dont `88` non nulles, `0` nulles, `80` non numériques et `1` suspectes. Plage observée dans les audits existants : min `6.7000000000000004E-2` / max `0.44800000000000001`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 0.08 ; frais typiques 0.001-0.2 mg/L`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_133_mn5.sql`

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
