# CAS-101 DisquedeSecchi(m)

## Identification
- parametre_observe : `DisquedeSecchi(m)`
- nom_standard : `Disque_Secchi`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `91` non nulles, `91` nulles
- exemples : `0.6 | 0.3 | 0.45`

## Problème
Le paramètre `DisquedeSecchi(m)` est rattaché à `Disque_Secchi`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Disque_Secchi`. Unité source observée : `à confirmer` ; unité métier dominante : `m`. Volume agrégé du cas : `182` lignes, dont `91` non nulles, `91` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.01` / max `1.2`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_101_disquedesecchi_m.sql`

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
