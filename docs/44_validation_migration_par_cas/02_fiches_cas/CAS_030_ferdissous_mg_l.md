# CAS-030 Ferdissous(mg/l)

## Identification
- parametre_observe : `Ferdissous(mg/l)`
- nom_standard : `Fe`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/l`
- criticité : `Critique`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `180` non nulles, `2` nulles
- exemples : `0.214 | 0.347 | 0.302`

## Problème
Le paramètre `Ferdissous(mg/l)` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `Fe`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `180` non nulles, `2` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.0000000000000001E-3` / max `0.52200000000000002`. Référence externe déjà associée dans l'audit précédent : `0.5-50 (fresh waters); <= 2 (acceptabilité OMS, pas valeur sanitaire formelle) mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_030_ferdissous_mg_l.sql`

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
