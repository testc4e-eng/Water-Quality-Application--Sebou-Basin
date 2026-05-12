# CAS-268 Pb

## Identification
- parametre_observe : `Pb`
- nom_standard : `Pb`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `46` lignes, `46` non nulles, `0` nulles
- exemples : `0,0101 | 0,014 | 0,015 | <0,005 | <0,010`

## Problème
Le paramètre `Pb` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `Pb`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `46` lignes, dont `46` non nulles, `0` nulles, `30` non numériques et `1` suspectes. Plage observée dans les audits existants : min `1.01E-2` / max `4.2200000000000001E-2`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 0.01 mg/L`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_268_pb.sql`

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
