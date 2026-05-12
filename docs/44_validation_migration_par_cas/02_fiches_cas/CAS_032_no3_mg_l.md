# CAS-032 NO3-(mg/l)

## Identification
- parametre_observe : `NO3-(mg/l)`
- nom_standard : `NO3-`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/l`
- criticité : `Critique`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `180` non nulles, `2` nulles
- exemples : `3.42 | 3.18 | 1.47`

## Problème
Le paramètre `NO3-(mg/l)` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `NO3-`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `180` non nulles, `2` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `0.89200000000000002` / max `81.7`. Référence externe déjà associée dans l'audit précédent : `<= 50 mg/L as nitrate`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_032_no3_mg_l.sql`

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
