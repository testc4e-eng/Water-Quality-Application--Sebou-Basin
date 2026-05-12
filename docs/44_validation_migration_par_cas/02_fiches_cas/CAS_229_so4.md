# CAS-229 SO4--

## Identification
- parametre_observe : `SO4--`
- nom_standard : `SO4²-`
- type_cas : `VALUE_PARSING`
- unité source : `à confirmer`
- criticité : `Moyenne`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `189` lignes, `189` non nulles, `0` nulles
- exemples : `85,7 | 82,2 | 78,45 | 75 | 27,3 | 98,3`

## Problème
Le paramètre `SO4--` présente des valeurs interprétables avec règle explicite de parsing, mais cette règle doit être validée avant migration.

## Analyse
Mapping observé : `SO4²-`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `189` lignes, dont `189` non nulles, `0` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `2.48` / max `1959`. Types de valeurs identifiés : `DECIMAL_COMMA`. Référence externe déjà associée dans l'audit précédent : `<= 250 mg/L`.

## Proposition
- action : `MIGRATE_WITH_FLAG`
- règles : `convertir la virgule en point`
- flags : `DECIMAL_COMMA`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_229_so4.sql`

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
