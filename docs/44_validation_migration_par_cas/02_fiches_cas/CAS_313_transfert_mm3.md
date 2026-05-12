# CAS-313 transfert_mm3

## Identification
- parametre_observe : `transfert_mm3`
- nom_standard : `Transfert`
- type_cas : `PARAMETER_MAPPING`
- unité source : `Mm3`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_niv_eau_barrages`
- volumes : `85166` lignes, `8278` non nulles, `76888` nulles
- exemples : `1.965 | 0.647 | 2.146`

## Problème
Le rattachement de `transfert_mm3` vers `Transfert` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Transfert`. Unité source observée : `Mm3` ; unité métier dominante : `Mm³`. Volume agrégé du cas : `85166` lignes, dont `8278` non nulles, `76888` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `4.2160000000000002`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_313_transfert_mm3.sql`

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
