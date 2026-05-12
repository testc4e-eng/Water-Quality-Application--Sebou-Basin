# CAS-079 t_eau

## Identification
- parametre_observe : `t_eau`
- nom_standard : `T_eau`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_src_pollution_globale, idp_2024_src_pollution_marche_cadre`
- volumes : `391` lignes, `316` non nulles, `75` nulles
- exemples : `23.6 | 24.5 | 19.2 | 19.5 | 14.4 | 23.5`

## Problème
Le paramètre `t_eau` est rattaché à `T_eau`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `T_eau`. Unité source observée : `à confirmer` ; unité métier dominante : `°C`. Volume agrégé du cas : `391` lignes, dont `316` non nulles, `75` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `10.1` / max `30.5`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_079_t_eau.sql`

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
