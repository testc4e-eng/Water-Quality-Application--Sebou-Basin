# CAS-106 PO43-(mgP/l)

## Identification
- parametre_observe : `PO43-(mgP/l)`
- nom_standard : `PO4³-`
- type_cas : `UNIT_VALIDATION`
- unité source : `mgP/l`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `182` non nulles, `0` nulles
- exemples : `0.022 | 0.032 | 0.028`

## Problème
Le paramètre `PO43-(mgP/l)` est rattaché à `PO4³-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `PO4³-`. Unité source observée : `mgP/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `182` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.02` / max `0.32`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_106_po43_mgp_l.sql`

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
