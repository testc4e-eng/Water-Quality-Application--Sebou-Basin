# CAS-016 PT

## Identification
- parametre_observe : `PT`
- nom_standard : `PT`
- type_cas : `NON_NUMERIC`
- unité source : `à confirmer`
- criticité : `Critique`

## Données
- tables sources : `idp_2024_mesures_qualite_globale`
- volumes : `163` lignes, `163` non nulles, `0` nulles
- exemples : `0,819 déctanté | 3,84 (déctanté) | 1,25 | 0,18 | 6,18`

## Problème
Le paramètre `PT` contient des valeurs non numériques ou non interprétables qui bloquent une migration directe.

## Analyse
Mapping observé : `PT`. Unité source observée : `à confirmer` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `163` lignes, dont `163` non nulles, `0` nulles, `12` non numériques et `0` suspectes. Plage observée dans les audits existants : min `5.5E-2` / max `506.03`. Types de valeurs identifiés : `TEXT_VALUE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `QUARANTINE`
- règles : `isoler les valeurs non interprétables en quarantaine`
- flags : `NON_NUMERIC_QUARANTINE`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_016_pt.sql`

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
