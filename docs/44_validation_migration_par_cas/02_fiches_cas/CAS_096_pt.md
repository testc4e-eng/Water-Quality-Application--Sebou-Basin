# CAS-096 PT

## Identification
- parametre_observe : `PT`
- nom_standard : `PT`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `240` lignes, `240` non nulles, `0` nulles
- exemples : `<0,05 | 2,96 | 0,144 | 0,072 | 0,819 déctanté | 3,84 (déctanté)`

## Problème
Le paramètre `PT` est rattaché à `PT`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `PT`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `240` lignes, dont `240` non nulles, `0` nulles, `42` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.7000000000000002E-2` / max `14.1`. Types de valeurs identifiés : `BELOW_DETECTION_LIMIT, TEXT_VALUE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_096_pt.sql`

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
