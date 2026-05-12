# CAS-135 IP

## Identification
- parametre_observe : `IP`
- nom_standard : `Phenol`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `75` lignes, `75` non nulles, `0` nulles
- exemples : `0,667 | 1,87 | 2,93 | 0,8 | 0,595 | 9,22`

## Problème
Le paramètre `IP` est rattaché à `Phenol`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Phenol`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `75` lignes, dont `75` non nulles, `0` nulles, `51` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.59499999999999997` / max `9.2200000000000006`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_135_ip.sql`

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
