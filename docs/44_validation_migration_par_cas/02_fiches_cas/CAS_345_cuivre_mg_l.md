# CAS-345 Cuivre(mg/l)

## Identification
- parametre_observe : `Cuivre(mg/l)`
- nom_standard : `Cu`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/l`
- criticité : `Moyenne`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `22` non nulles, `160` nulles
- exemples : `0.0052 | 0.0122 | 0.0105`

## Problème
Le rattachement de `Cuivre(mg/l)` vers `Cu` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Cu`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `22` non nulles, `160` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.0000000000000001E-3` / max `2.1700000000000001E-2`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_345_cuivre_mg_l.sql`

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
