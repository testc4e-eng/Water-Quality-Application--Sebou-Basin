# CAS-311 apports_mm3

## Identification
- parametre_observe : `apports_mm3`
- nom_standard : `Apports_hm3`
- type_cas : `PARAMETER_MAPPING`
- unité source : `Mm3`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_niv_eau_barrages`
- volumes : `85166` lignes, `85155` non nulles, `11` nulles
- exemples : `0.0187744 | 0.088093511 | 0.534500801`

## Problème
Le rattachement de `apports_mm3` vers `Apports_hm3` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Apports_hm3`. Unité source observée : `Mm3` ; unité métier dominante : `Mm³`. Volume agrégé du cas : `85166` lignes, dont `85155` non nulles, `11` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `290.4521378`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_311_apports_mm3.sql`

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
