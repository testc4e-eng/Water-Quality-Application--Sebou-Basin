# CAS-100 Bore(mg/l)

## Identification
- parametre_observe : `Bore(mg/l)`
- nom_standard : `à confirmer`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg/l`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `22` non nulles, `160` nulles
- exemples : `0.06 | 0.066 | 0.079`

## Problème
Le paramètre `Bore(mg/l)` est rattaché à `à confirmer`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `à confirmer`. Unité source observée : `mg/l` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `182` lignes, dont `22` non nulles, `160` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.8000000000000003E-2` / max `0.157`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_100_bore_mg_l.sql`

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
