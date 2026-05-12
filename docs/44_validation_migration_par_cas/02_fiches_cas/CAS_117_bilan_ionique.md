# CAS-117 Bilan_Ionique

## Identification
- parametre_observe : `Bilan_Ionique`
- nom_standard : `Bilan_Ion`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `117` lignes, `113` non nulles, `4` nulles
- exemples : `3,750072287 | 3,102461377 | 3,298896337 | 0,525216307 | 0,616442227 | 0,723237856`

## Problème
Le paramètre `Bilan_Ionique` est rattaché à `Bilan_Ion`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Bilan_Ion`. Unité source observée : `à confirmer` ; unité métier dominante : `%`. Volume agrégé du cas : `117` lignes, dont `113` non nulles, `4` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.52521630699999999` / max `8.7914703319999994`. Types de valeurs identifiés : `DECIMAL_COMMA, EMPTY_VALUE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_117_bilan_ionique.sql`

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
