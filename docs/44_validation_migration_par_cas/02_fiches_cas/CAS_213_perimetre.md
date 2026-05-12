# CAS-213 perimetre

## Identification
- parametre_observe : `perimetre`
- nom_standard : `Perimetre`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `bassin_sebou`
- volumes : `1` lignes, `1` non nulles, `0` nulles
- exemples : `1063.66456726`

## Problème
Le paramètre `perimetre` est rattaché à `Perimetre`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Perimetre`. Unité source observée : `à confirmer` ; unité métier dominante : `km`. Volume agrégé du cas : `1` lignes, dont `1` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1063.66456726` / max `1063.66456726`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_213_perimetre.sql`

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
