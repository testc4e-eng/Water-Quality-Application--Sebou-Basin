# CAS-348 Mercure(mg/l)

## Identification
- parametre_observe : `Mercure(mg/l)`
- nom_standard : `Hg`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/l`
- criticité : `Moyenne`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `22` non nulles, `160` nulles
- exemples : `0.00025 | 0.564`

## Problème
Le rattachement de `Mercure(mg/l)` vers `Hg` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Hg`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `22` non nulles, `160` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2.5000000000000001E-4` / max `0.56399999999999995`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_348_mercure_mg_l.sql`

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
