# CAS-107 PT(mgP/l)

## Identification
- parametre_observe : `PT(mgP/l)`
- nom_standard : `PT`
- type_cas : `UNIT_VALIDATION`
- unité source : `mgP/l`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `178` non nulles, `4` nulles
- exemples : `0.166 | 0.06 | 0.071`

## Problème
Le paramètre `PT(mgP/l)` est rattaché à `PT`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `PT`. Unité source observée : `mgP/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `178` non nulles, `4` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.05` / max `0.69099999999999995`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_107_pt_mgp_l.sql`

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
