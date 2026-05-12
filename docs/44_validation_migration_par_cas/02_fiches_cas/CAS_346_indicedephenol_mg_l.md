# CAS-346 Indicedephénol(mg/l)

## Identification
- parametre_observe : `Indicedephénol(mg/l)`
- nom_standard : `Phenol`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/l`
- criticité : `Moyenne`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `182` non nulles, `0` nulles
- exemples : `0.011 | 0.012 | 0.01`

## Problème
Le rattachement de `Indicedephénol(mg/l)` vers `Phenol` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Phenol`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `182` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.01` / max `0.2`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_346_indicedephenol_mg_l.sql`

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
