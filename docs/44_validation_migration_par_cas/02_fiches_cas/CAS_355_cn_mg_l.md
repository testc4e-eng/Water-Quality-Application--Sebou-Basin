# CAS-355 CN(mg/l)

## Identification
- parametre_observe : `CN(mg/l)`
- nom_standard : `CN-`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/l`
- criticité : `Moyenne`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `179` lignes, `22` non nulles, `157` nulles
- exemples : `0.02`

## Problème
Le rattachement de `CN(mg/l)` vers `CN-` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `CN-`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `179` lignes, dont `22` non nulles, `157` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.02` / max `0.02`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_355_cn_mg_l.sql`

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
