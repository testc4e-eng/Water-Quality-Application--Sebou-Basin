# CAS-028 Cl-(mg/l)

## Identification
- parametre_observe : `Cl-(mg/l)`
- nom_standard : `Cl-`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/l`
- criticité : `Critique`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `92` non nulles, `90` nulles
- exemples : `133 | 123 | 224`

## Problème
Le paramètre `Cl-(mg/l)` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `Cl-`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `92` non nulles, `90` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `123` / max `634`. Référence externe déjà associée dans l'audit précédent : `<= 250 (acceptabilité) mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_028_cl_mg_l.sql`

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
