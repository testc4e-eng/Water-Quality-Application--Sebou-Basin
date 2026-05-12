# CAS-047 SF

## Identification
- parametre_observe : `SF`
- nom_standard : `SF`
- type_cas : `UNIT_VALIDATION`
- unité source : `g/L`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre, mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `4927` lignes, `4926` non nulles, `0` nulles
- exemples : `3,9x102 | 1,4x102 | 1,1x102 | 3,7x105 | 9,0 x 105 | 1,2 x 102`

## Problème
Le paramètre `SF` est rattaché à `SF`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `SF`. Unité source observée : `g/L` ; unité métier dominante : `UFC/100 mL`. Volume agrégé du cas : `4927` lignes, dont `4926` non nulles, `0` nulles, `218` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `65`. Types de valeurs identifiés : `NON_PARSEABLE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_CONFLICT`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_047_sf.sql`

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
