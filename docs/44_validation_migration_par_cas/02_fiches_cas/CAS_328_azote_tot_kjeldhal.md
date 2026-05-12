# CAS-328 Azote_tot_kjeldhal

## Identification
- parametre_observe : `Azote_tot_kjeldhal`
- nom_standard : `NTK`
- type_cas : `PARAMETER_MAPPING`
- unité source : `mg/L`
- criticité : `Moyenne`

## Données
- tables sources : `mesures_qualite_barrages, mesures_qualite_nappes, mesures_qualite_rivieres, types_mesures`
- volumes : `1934` lignes, `1933` non nulles, `0` nulles
- exemples : `0.06 | 0.338 | 1.506 | 0.01 | 0.018 | 0.02`

## Problème
Le rattachement de `Azote_tot_kjeldhal` vers `NTK` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `NTK`. Unité source observée : `mg/L` ; unité métier dominante : `mg/L`. Volume agrégé du cas : `1934` lignes, dont `1933` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `1.7999999999999999E-2` / max `12.95`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_328_azote_tot_kjeldhal.sql`

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
