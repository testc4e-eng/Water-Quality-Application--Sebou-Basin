# CAS-344 Conductivitéà20°C(µs/cm)

## Identification
- parametre_observe : `Conductivitéà20°C(µs/cm)`
- nom_standard : `Cond`
- type_cas : `PARAMETER_MAPPING`
- unité source : `µs/cm`
- criticité : `Moyenne`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `182` non nulles, `0` nulles
- exemples : `877 | 1675 | 780`

## Problème
Le rattachement de `Conductivitéà20°C(µs/cm)` vers `Cond` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Cond`. Unité source observée : `µs/cm` ; unité métier dominante : `µS/cm`. Volume agrégé du cas : `182` lignes, dont `182` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `676` / max `3160`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_344_conductivitea20c_s_cm.sql`

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
