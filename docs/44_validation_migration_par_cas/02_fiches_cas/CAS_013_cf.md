# CAS-013 CF

## Identification
- parametre_observe : `CF`
- nom_standard : `CF`
- type_cas : `NON_NUMERIC`
- unité source : `UFC/100mL`
- criticité : `Critique`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `273` lignes, `273` non nulles, `0` nulles
- exemples : `2,4x102 | 1,5x102 | 1,3x102 | 1,0x103 | 4,9 x 106 | 2,9.103`

## Problème
Le paramètre `CF` contient des valeurs non numériques ou non interprétables qui bloquent une migration directe.

## Analyse
Mapping observé : `CF`. Unité source observée : `UFC/100mL` ; unité métier dominante : `UFC/100 mL`. Volume agrégé du cas : `273` lignes, dont `273` non nulles, `0` nulles, `216` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `94`. Types de valeurs identifiés : `NON_PARSEABLE`. Référence externe déjà associée dans l'audit précédent : `<= 100 geom. mean ; <= 320 STV cfu/100 mL`.

## Proposition
- action : `QUARANTINE`
- règles : `isoler les valeurs non interprétables en quarantaine`
- flags : `NON_NUMERIC_QUARANTINE`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_013_cf.sql`

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
