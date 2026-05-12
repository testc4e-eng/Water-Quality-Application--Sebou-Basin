# CAS-054 Conductivité

## Identification
- parametre_observe : `Conductivité`
- nom_standard : `Cond`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `suivi_qualite_sebou_jr`
- volumes : `4572` lignes, `4572` non nulles, `0` nulles
- exemples : `1593 | 877 | 2880`

## Problème
Le paramètre `Conductivité` est rattaché à `Cond`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Cond`. Unité source observée : `à confirmer` ; unité métier dominante : `µS/cm`. Volume agrégé du cas : `4572` lignes, dont `4572` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `n.d.`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_054_conductivite.sql`

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
