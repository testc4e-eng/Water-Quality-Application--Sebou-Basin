# CAS-051 H_G

## Identification
- parametre_observe : `H_G`
- nom_standard : `HG / Hg`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_qualite_nappes, mesures_qualite_rivieres, suivi_qualite_sebou_jr`
- volumes : `4726` lignes, `4726` non nulles, `0` nulles
- exemples : `0.0008 | 0 | 0.0001 | 0.0002 | 0.5882352941162762 | 0.7647058823532488`

## Problème
Le paramètre `H_G` est rattaché à `HG / Hg`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `HG / Hg`. Unité source observée : `à confirmer` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `4726` lignes, dont `4726` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `8.0000000000000004E-4` / max `8.0000000000000004E-4`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_051_h_g.sql`

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
