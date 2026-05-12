# CAS-136 Huiles Graisses

## Identification
- parametre_observe : `Huiles Graisses`
- nom_standard : `HG`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `72` lignes, `72` non nulles, `0` nulles
- exemples : `<0.377 | <0,377 | <1.7`

## Problème
Le paramètre `Huiles Graisses` est rattaché à `HG`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `HG`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `72` lignes, dont `72` non nulles, `0` nulles, `22` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.44` / max `126`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_136_huiles_graisses.sql`

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
