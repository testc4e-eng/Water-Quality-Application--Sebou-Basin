# CAS-317 Conductivite

## Identification
- parametre_observe : `Conductivite`
- nom_standard : `Cond`
- type_cas : `PARAMETER_MAPPING`
- unité source : `µS/cm`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `5072` lignes, `5071` non nulles, `0` nulles
- exemples : `1868 | 262 | 711 | 877 | 34000 | 2880`

## Problème
Le rattachement de `Conductivite` vers `Cond` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Cond`. Unité source observée : `µS/cm` ; unité métier dominante : `µS/cm`. Volume agrégé du cas : `5072` lignes, dont `5071` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `9.8000000000000007` / max `12260`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_317_conductivite.sql`

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
