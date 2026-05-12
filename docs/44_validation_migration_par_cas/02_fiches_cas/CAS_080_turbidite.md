# CAS-080 turbidite

## Identification
- parametre_observe : `turbidite`
- nom_standard : `Turbidite`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_src_pollution_globale, idp_2024_src_pollution_marche_cadre`
- volumes : `391` lignes, `202` non nulles, `189` nulles
- exemples : `176 | 129 | 13 | 155 | 459 | 347`

## Problème
Le paramètre `turbidite` est rattaché à `Turbidite`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Turbidite`. Unité source observée : `à confirmer` ; unité métier dominante : `NTU`. Volume agrégé du cas : `391` lignes, dont `202` non nulles, `189` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.9` / max `1000`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_080_turbidite.sql`

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
