# CAS-156 montant_md

## Identification
- parametre_observe : `montant_md`
- nom_standard : `Montant_MD`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `barrages_abhs`
- volumes : `34` lignes, `23` non nulles, `11` nulles
- exemples : `950 | 31.5 | 395`

## Problème
Le paramètre `montant_md` est rattaché à `Montant_MD`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Montant_MD`. Unité source observée : `à confirmer` ; unité métier dominante : `Millions Dirhams`. Volume agrégé du cas : `34` lignes, dont `23` non nulles, `11` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `31.5` / max `9366`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_156_montant_md.sql`

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
