# CAS-369 superficie_km2

## Identification
- parametre_observe : `superficie_km2`
- nom_standard : `Superficie_km2`
- type_cas : `PARAMETER_MAPPING`
- unité source : `km2`
- criticité : `Moyenne`

## Données
- tables sources : `bassin_sebou, nappes_abhs`
- volumes : `18` lignes, `18` non nulles, `0` nulles
- exemples : `40960.94362070001 | 57.69991260038 | 3236.13000929105 | 31.04676319505`

## Problème
Le rattachement de `superficie_km2` vers `Superficie_km2` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Superficie_km2`. Unité source observée : `km2` ; unité métier dominante : `km²`. Volume agrégé du cas : `18` lignes, dont `18` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `40960.943620700011` / max `40960.943620700011`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_369_superficie_km2.sql`

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
