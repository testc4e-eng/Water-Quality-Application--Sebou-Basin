# CAS-151 cap_equiv_hab

## Identification
- parametre_observe : `cap_equiv_hab`
- nom_standard : `Cap_equiv`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `step_abhs`
- volumes : `41` lignes, `12` non nulles, `29` nulles
- exemples : `4720 | 219000 | 37907`

## Problème
Le paramètre `cap_equiv_hab` est rattaché à `Cap_equiv`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cap_equiv`. Unité source observée : `à confirmer` ; unité métier dominante : `EH`. Volume agrégé du cas : `41` lignes, dont `12` non nulles, `29` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `20.067` / max `219000`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_151_cap_equiv_hab.sql`

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
