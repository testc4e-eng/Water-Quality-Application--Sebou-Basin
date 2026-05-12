# CAS-336 Largeur

## Identification
- parametre_observe : `Largeur`
- nom_standard : `Largeur`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_rivieres, types_mesures`
- volumes : `197` lignes, `196` non nulles, `0` nulles
- exemples : `0.9 | 10 | 2.5 | 0 | 0.2 | 0.3`

## Problème
Le rattachement de `Largeur` vers `Largeur` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Largeur`. Unité source observée : `m` ; unité métier dominante : `m`. Volume agrégé du cas : `197` lignes, dont `196` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.9` / max `20`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_336_largeur.sql`

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
