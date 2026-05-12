# CAS-352 Sélénium(mg/l)

## Identification
- parametre_observe : `Sélénium(mg/l)`
- nom_standard : `Se`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/l`
- criticité : `Moyenne`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `22` non nulles, `160` nulles
- exemples : `0.005`

## Problème
Le rattachement de `Sélénium(mg/l)` vers `Se` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Se`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `22` non nulles, `160` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.0000000000000001E-3` / max `5.0000000000000001E-3`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_352_selenium_mg_l.sql`

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
