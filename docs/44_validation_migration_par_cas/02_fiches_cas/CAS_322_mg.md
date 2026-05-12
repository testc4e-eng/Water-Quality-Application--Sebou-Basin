# CAS-322 Mg

## Identification
- parametre_observe : `Mg`
- nom_standard : `Mg`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `4533` lignes, `4532` non nulles, `0` nulles
- exemples : `96 | 52.5 | 29.7 | 40.4 | 62.6 | 69.1`

## Problème
Le rattachement de `Mg` vers `Mg` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Mg`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `4533` lignes, dont `4532` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.02` / max `96`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_322_mg.sql`

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
