# CAS-035 F-(mg/l)

## Identification
- parametre_observe : `F-(mg/l)`
- nom_standard : `F-`
- type_cas : `VALUE_ABERRANT`
- unité source : `mg/l`
- criticité : `Critique`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `181` lignes, `22` non nulles, `159` nulles
- exemples : `0.347 | 0.305 | 0.178`

## Problème
Le paramètre `F-(mg/l)` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `F-`. Unité source observée : `mg/l` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `181` lignes, dont `22` non nulles, `159` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.16800000000000001` / max `0.56399999999999995`. Référence externe déjà associée dans l'audit précédent : `<= 1.5 mg/L`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_035_f_mg_l.sql`

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
