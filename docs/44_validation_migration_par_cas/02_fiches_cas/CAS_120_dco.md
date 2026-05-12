# CAS-120 DCO

## Identification
- parametre_observe : `DCO`
- nom_standard : `DCO`
- type_cas : `NON_NUMERIC`
- unité source : `mg O2/L`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `35` lignes, `35` non nulles, `0` nulles
- exemples : `288 (*) | 192 (*) | <8,10 | 11,5 | 1121`

## Problème
Le paramètre `DCO` contient des valeurs non numériques ou non interprétables qui bloquent une migration directe.

## Analyse
Mapping observé : `DCO`. Unité source observée : `mg O2/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `35` lignes, dont `35` non nulles, `0` nulles, `5` non numériques et `0` suspectes. Plage observée dans les audits existants : min `11.5` / max `1121`. Types de valeurs identifiés : `NON_PARSEABLE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `QUARANTINE`
- règles : `isoler les valeurs non interprétables en quarantaine`
- flags : `NON_NUMERIC_QUARANTINE`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_120_dco.sql`

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
