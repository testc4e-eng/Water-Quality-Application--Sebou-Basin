# CAS-072 Pb

## Identification
- parametre_observe : `Pb`
- nom_standard : `Pb`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, mesures_qualite_nappes, mesures_qualite_rivieres`
- volumes : `488` lignes, `488` non nulles, `0` nulles
- exemples : `0,0101 | 0,014 | 0,015 | <0,005 | <0,010 | 0.011`

## Problème
Le paramètre `Pb` est rattaché à `Pb`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Pb`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `488` lignes, dont `488` non nulles, `0` nulles, `30` non numériques et `3` suspectes. Plage observée dans les audits existants : min `1.01E-2` / max `4.2200000000000001E-2`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 0.01 mg/L`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_072_pb.sql`

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
