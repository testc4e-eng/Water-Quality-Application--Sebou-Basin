# CAS-031 Manganèse(mg/l)

## Identification
- parametre_observe : `Manganèse(mg/l)`
- nom_standard : `Mn`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/l`
- criticité : `Critique`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `180` non nulles, `2` nulles
- exemples : `0.064 | 0.005 | 0.137`

## Problème
Le paramètre `Manganèse(mg/l)` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `Mn`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `182` lignes, dont `180` non nulles, `2` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `5.0000000000000001E-3` / max `0.13700000000000001`. Référence externe déjà associée dans l'audit précédent : `<= 0.08 ; frais typiques 0.001-0.2 mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_031_manganese_mg_l.sql`

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
