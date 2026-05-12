# CAS-027 CF(UFC/100mL)

## Identification
- parametre_observe : `CF(UFC/100mL)`
- nom_standard : `CF`
- type_cas : `VALUE_ABERRANT`
- unité source : `UFC/100mL`
- criticité : `Critique`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `88` non nulles, `94` nulles
- exemples : `8 | 75 | 96`

## Problème
Le paramètre `CF(UFC/100mL)` montre des valeurs hors plage attendue ou suffisamment suspectes pour imposer une quarantaine avant migration.

## Analyse
Mapping observé : `CF`. Unité source observée : `UFC/100mL` ; unité métier dominante : `UFC/100 mL`. Volume agrégé du cas : `182` lignes, dont `88` non nulles, `94` nulles, `0` non numériques et `1` suspectes. Plage observée dans les audits existants : min `0` / max `110000`. Référence externe déjà associée dans l'audit précédent : `<= 100 geom. mean ; <= 320 STV cfu/100 mL`.

## Proposition
- action : `QUARANTINE`
- règles : `bloquer le chargement en métier et réviser les valeurs avec le métier`
- flags : `SUSPECT_OUTLIER`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_027_cf_ufc_100ml.sql`

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
