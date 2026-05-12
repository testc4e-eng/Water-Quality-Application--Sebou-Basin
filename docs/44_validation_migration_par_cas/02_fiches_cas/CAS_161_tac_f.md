# CAS-161 TAC_°F

## Identification
- parametre_observe : `TAC_°F`
- nom_standard : `TAC`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `32` lignes, `32` non nulles, `0` nulles
- exemples : `24,3 | 48,5 | 36,7 | 10,9 | 13,7 | 14,2`

## Problème
Le paramètre `TAC_°F` est rattaché à `TAC`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `TAC`. Unité source observée : `à confirmer` ; unité métier dominante : `meq/L`. Volume agrégé du cas : `32` lignes, dont `32` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `10.9` / max `68.8`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_161_tac_f.sql`

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
