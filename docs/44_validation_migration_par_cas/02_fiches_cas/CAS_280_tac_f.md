# CAS-280 TAC_°F

## Identification
- parametre_observe : `TAC_°F`
- nom_standard : `TAC`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `32` lignes, `32` non nulles, `0` nulles
- exemples : `24,3 | 48,5 | 36,7 | 10,9 | 13,7 | 14,2`

## Problème
Le paramètre `TAC_°F` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `TAC`. Unité source observée : `à confirmer` ; unité métier dominante : `meq/L`. Volume agrégé du cas : `32` lignes, dont `32` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `10.9` / max `68.8`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_280_tac_f.sql`

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
