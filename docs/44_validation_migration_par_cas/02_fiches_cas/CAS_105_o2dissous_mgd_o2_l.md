# CAS-105 O2dissous(mgd'O2/l)

## Identification
- parametre_observe : `O2dissous(mgd'O2/l)`
- nom_standard : `O2_dissous`
- type_cas : `UNIT_VALIDATION`
- unité source : `mgd'O2/l`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `182` non nulles, `0` nulles
- exemples : `7.56 | 8.9 | 7.35`

## Problème
Le paramètre `O2dissous(mgd'O2/l)` est rattaché à `O2_dissous`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `O2_dissous`. Unité source observée : `mgd'O2/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `182` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `4.1399999999999997` / max `16.3`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_105_o2dissous_mgd_o2_l.sql`

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
