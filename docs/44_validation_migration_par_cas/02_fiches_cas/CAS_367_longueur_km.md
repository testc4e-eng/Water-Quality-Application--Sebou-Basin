# CAS-367 longueur_km

## Identification
- parametre_observe : `longueur_km`
- nom_standard : `Longueur`
- type_cas : `PARAMETER_MAPPING`
- unité source : `km`
- criticité : `Moyenne`

## Données
- tables sources : `reseau_hydro_abhs`
- volumes : `28` lignes, `28` non nulles, `0` nulles
- exemples : `41.19843662694767 | 50.237760900027446 | 103.6095934061964`

## Problème
Le rattachement de `longueur_km` vers `Longueur` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Longueur`. Unité source observée : `km` ; unité métier dominante : `km`. Volume agrégé du cas : `28` lignes, dont `28` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `6.0280619358447218` / max `471.40927379922306`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_367_longueur_km.sql`

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
