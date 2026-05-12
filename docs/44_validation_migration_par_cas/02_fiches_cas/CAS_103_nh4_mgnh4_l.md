# CAS-103 NH4+(mgNH4+/l)

## Identification
- parametre_observe : `NH4+(mgNH4+/l)`
- nom_standard : `NH4+`
- type_cas : `UNIT_VALIDATION`
- unité source : `mgNH4+/l`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `182` non nulles, `0` nulles
- exemples : `0.041 | 0.53 | 0.166`

## Problème
Le paramètre `NH4+(mgNH4+/l)` est rattaché à `NH4+`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `NH4+`. Unité source observée : `mgNH4+/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `182` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.02` / max `3.27`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_103_nh4_mgnh4_l.sql`

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
