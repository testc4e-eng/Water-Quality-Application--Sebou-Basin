# CAS-068 p_max

## Identification
- parametre_observe : `p_max`
- nom_standard : `P_max`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_precipitations_jr_max`
- volumes : `2085` lignes, `1915` non nulles, `170` nulles
- exemples : `65.6 | 52.6 | 61.3`

## Problème
Le paramètre `p_max` est rattaché à `P_max`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `P_max`. Unité source observée : `à confirmer` ; unité métier dominante : `mm`. Volume agrégé du cas : `2085` lignes, dont `1915` non nulles, `170` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `420`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_068_p_max.sql`

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
