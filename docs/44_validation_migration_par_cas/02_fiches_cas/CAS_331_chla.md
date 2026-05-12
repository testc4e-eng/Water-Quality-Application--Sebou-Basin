# CAS-331 Chla

## Identification
- parametre_observe : `Chla`
- nom_standard : `Chla`
- type_cas : `PARAMETER_MAPPING`
- unité source : `µg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `605` lignes, `604` non nulles, `0` nulles
- exemples : `1.6 | 27.8 | 4.32 | 0 | 0.07 | 1.91`

## Problème
Le rattachement de `Chla` vers `Chla` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Chla`. Unité source observée : `µg/L` ; unité métier dominante : `µg/L`. Volume agrégé du cas : `605` lignes, dont `604` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `228.3`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_331_chla.sql`

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
