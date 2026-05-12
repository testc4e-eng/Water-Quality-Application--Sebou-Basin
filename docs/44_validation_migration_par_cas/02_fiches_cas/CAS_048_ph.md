# CAS-048 pH

## Identification
- parametre_observe : `pH`
- nom_standard : `pH`
- type_cas : `UNIT_VALIDATION`
- unité source : `pH`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo, suivi_qualite_sebou_jr`
- volumes : `4754` lignes, `4754` non nulles, `0` nulles
- exemples : `8.32 | 8.4 | 8.22 | 7.81 | 8.95 | 7.56`

## Problème
Le paramètre `pH` est rattaché à `pH`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `pH`. Unité source observée : `pH` ; unité métier dominante : `— (sans unité)`. Volume agrégé du cas : `4754` lignes, dont `4754` non nulles, `0` nulles, `0` non numériques et `2` suspectes. Plage observée dans les audits existants : min `7.3` / max `8.8000000000000007`. Référence externe déjà associée dans l'audit précédent : `6.5-8.5 pH`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_048_ph.sql`

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
