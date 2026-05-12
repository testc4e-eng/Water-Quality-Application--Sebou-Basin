# CAS-102 IP(mgO2/l)

## Identification
- parametre_observe : `IP(mgO2/l)`
- nom_standard : `Phenol`
- type_cas : `UNIT_VALIDATION`
- unité source : `mgO2/l`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `88` non nulles, `94` nulles
- exemples : `2.22 | 1.448559671 | 1.666666667`

## Problème
Le paramètre `IP(mgO2/l)` est rattaché à `Phenol`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Phenol`. Unité source observée : `mgO2/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `88` non nulles, `94` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.80334728` / max `3.49`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_102_ip_mgo2_l.sql`

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
