# CAS-049 T_air

## Identification
- parametre_observe : `T_air`
- nom_standard : `T_air`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo, suivi_qualite_sebou_jr`
- volumes : `4754` lignes, `4754` non nulles, `0` nulles
- exemples : `13 | 28 | 19 | 26 | 15.8`

## Problème
Le paramètre `T_air` est rattaché à `T_air`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `T_air`. Unité source observée : `à confirmer` ; unité métier dominante : `°C`. Volume agrégé du cas : `4754` lignes, dont `4754` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `9` / max `42`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_049_t_air.sql`

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
