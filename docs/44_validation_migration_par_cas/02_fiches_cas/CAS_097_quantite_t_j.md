# CAS-097 quantite_t_j

## Identification
- parametre_observe : `quantite_t_j`
- nom_standard : `Quantite_tj`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `decharges_abhs`
- volumes : `233` lignes, `159` non nulles, `74` nulles
- exemples : `560 | 3.5 | 15.26`

## Problème
Le paramètre `quantite_t_j` est rattaché à `Quantite_tj`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Quantite_tj`. Unité source observée : `à confirmer` ; unité métier dominante : `t/jour`. Volume agrégé du cas : `233` lignes, dont `159` non nulles, `74` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.02` / max `560`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_097_quantite_t_j.sql`

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
