# CAS-362 niv_piezometrique_m

## Identification
- parametre_observe : `niv_piezometrique_m`
- nom_standard : `Niveau_piezom`
- type_cas : `PARAMETER_MAPPING`
- unité source : `m`
- criticité : `Moyenne`

## Données
- tables sources : `points_eau_abhs`
- volumes : `46` lignes, `22` non nulles, `24` nulles
- exemples : `80 | 11.8 | 8`

## Problème
Le rattachement de `niv_piezometrique_m` vers `Niveau_piezom` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Niveau_piezom`. Unité source observée : `m` ; unité métier dominante : `m`. Volume agrégé du cas : `46` lignes, dont `22` non nulles, `24` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `2` / max `110`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_362_niv_piezometrique_m.sql`

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
