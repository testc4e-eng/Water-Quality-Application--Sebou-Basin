# CAS-014 CT

## Identification
- parametre_observe : `CT`
- nom_standard : `CT`
- type_cas : `NON_NUMERIC`
- unité source : `mg/L`
- criticité : `Critique`

## Données
- tables sources : `idp_2024_mesures_qualite_globale, idp_2024_mesures_qualite_marche_cadre`
- volumes : `273` lignes, `273` non nulles, `0` nulles
- exemples : `3,4x102 | 1,8x102 | 1,1x102 | 6,2X102 | 5,0X103 | 1,5.104`

## Problème
Le paramètre `CT` contient des valeurs non numériques ou non interprétables qui bloquent une migration directe.

## Analyse
Mapping observé : `CT`. Unité source observée : `mg/L` ; unité métier dominante : `UFC/100 mL`. Volume agrégé du cas : `273` lignes, dont `273` non nulles, `0` nulles, `234` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `90`. Types de valeurs identifiés : `NON_PARSEABLE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `QUARANTINE`
- règles : `isoler les valeurs non interprétables en quarantaine`
- flags : `NON_NUMERIC_QUARANTINE`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_014_ct.sql`

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
