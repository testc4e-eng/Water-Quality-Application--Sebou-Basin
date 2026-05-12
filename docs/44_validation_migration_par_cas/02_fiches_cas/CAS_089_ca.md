# CAS-089 Ca++

## Identification
- parametre_observe : `Ca++`
- nom_standard : `Ca`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `278` lignes, `278` non nulles, `0` nulles
- exemples : `258,5 | 56,1 | 55,1 | 138,3 | 86,2 | 280,6`

## Problème
Le paramètre `Ca++` est rattaché à `Ca`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Ca`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `278` lignes, dont `278` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `19.600000000000001` / max `1222.4000000000001`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_089_ca.sql`

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
