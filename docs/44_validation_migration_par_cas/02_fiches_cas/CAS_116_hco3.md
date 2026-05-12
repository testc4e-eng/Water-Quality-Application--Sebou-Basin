# CAS-116 HCO3

## Identification
- parametre_observe : `HCO3`
- nom_standard : `HCO3-`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `121` lignes, `121` non nulles, `0` nulles
- exemples : `133 | 167 | 173 | 81,7 | 185,4 | 17,1`

## Problème
Le paramètre `HCO3` est rattaché à `HCO3-`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `HCO3-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `121` lignes, dont `121` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `133` / max `839`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_116_hco3.sql`

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
