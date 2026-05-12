# CAS-119 Bilan_Ionique

## Identification
- parametre_observe : `Bilan_Ionique`
- nom_standard : `Bilan_Ion`
- type_cas : `NON_NUMERIC`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `idp_2024_mesures_qualite_marche_cadre`
- volumes : `89` lignes, `85` non nulles, `4` nulles
- exemples : `7,513775763 | 6,182296049 | 0,832945489`

## Problème
Le paramètre `Bilan_Ionique` contient des valeurs non numériques ou non interprétables qui bloquent une migration directe.

## Analyse
Mapping observé : `Bilan_Ion`. Unité source observée : `à confirmer` ; unité métier dominante : `%`. Volume agrégé du cas : `89` lignes, dont `85` non nulles, `4` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `4.0490623000000003E-2` / max `9.7942684270000004`. Types de valeurs identifiés : `EMPTY_VALUE`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `QUARANTINE`
- règles : `isoler les valeurs non interprétables en quarantaine`
- flags : `NON_NUMERIC_QUARANTINE`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_119_bilan_ionique.sql`

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
