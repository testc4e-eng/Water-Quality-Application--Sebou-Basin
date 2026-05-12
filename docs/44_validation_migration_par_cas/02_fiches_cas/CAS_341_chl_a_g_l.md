# CAS-341 Chl.A(µg/l)

## Identification
- parametre_observe : `Chl.A(µg/l)`
- nom_standard : `Chla`
- type_cas : `PARAMETER_MAPPING`
- unité source : `µg/l`
- criticité : `Moyenne`

## Données
- tables sources : `suivi_qualite_brg_garde_hebdo`
- volumes : `182` lignes, `180` non nulles, `2` nulles
- exemples : `29.7 | 14.4 | 6.48`

## Problème
Le rattachement de `Chl.A(µg/l)` vers `Chla` existe, mais il reste des préconditions documentaires avant migration contrôlée.

## Analyse
Mapping observé : `Chla`. Unité source observée : `µg/l` ; unité métier dominante : `µg/L`. Volume agrégé du cas : `182` lignes, dont `180` non nulles, `2` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0.1` / max `68.400000000000006`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `charger uniquement après validation humaine du cas`
- flags : `VALID`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_341_chl_a_g_l.sql`

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
