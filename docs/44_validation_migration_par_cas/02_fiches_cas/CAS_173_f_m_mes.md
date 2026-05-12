# CAS-173 F_M_mes

## Identification
- parametre_observe : `F_M_mes`
- nom_standard : `FM`
- type_cas : `UNIT_VALIDATION`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `12` lignes, `11` non nulles, `0` nulles
- exemples : `0.059 | 38.4 | 55.4 | 0.161 | 0 | 0.759`

## Problème
Le paramètre `F_M_mes` est rattaché à `FM`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `FM`. Unité source observée : `mg/L` ; unité métier dominante : `à confirmer`. Volume agrégé du cas : `12` lignes, dont `11` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.8999999999999997E-2` / max `55.4`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_173_f_m_mes.sql`

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
