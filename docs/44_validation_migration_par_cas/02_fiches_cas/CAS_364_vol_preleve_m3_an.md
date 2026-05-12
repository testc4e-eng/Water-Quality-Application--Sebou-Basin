# CAS-364 vol_preleve_m3_an

## Identification
- parametre_observe : `vol_preleve_m3_an`
- nom_standard : `Vol_preleve`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m3/an`
- criticité : `Moyenne`

## Données
- tables sources : `points_eau_abhs`
- volumes : `46` lignes, `17` non nulles, `29` nulles
- exemples : `28041 | 500714 | 41012`

## Problème
Le rattachement de `vol_preleve_m3_an` vers `Vol_preleve` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Vol_preleve`. Unité source observée : `m3/an` ; unité métier dominante : `m³/an`. Volume agrégé du cas : `46` lignes, dont `17` non nulles, `29` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `1271110`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_364_vol_preleve_m3_an.sql`

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
