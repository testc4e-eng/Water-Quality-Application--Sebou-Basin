# CAS-333 Disque_secchi

## Identification
- parametre_observe : `Disque_secchi`
- nom_standard : `Disque_Secchi`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `368` lignes, `367` non nulles, `0` nulles
- exemples : `4.47 | 1.6 | 0.6 | 0.17 | 0 | 0.01`

## Problème
Le rattachement de `Disque_secchi` vers `Disque_Secchi` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Disque_Secchi`. Unité source observée : `m` ; unité métier dominante : `m`. Volume agrégé du cas : `368` lignes, dont `367` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.1` / max `380`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_333_disque_secchi.sql`

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
