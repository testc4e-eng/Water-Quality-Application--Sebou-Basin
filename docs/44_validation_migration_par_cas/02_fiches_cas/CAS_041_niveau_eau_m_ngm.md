# CAS-041 niveau_eau_m_ngm

## Identification
- parametre_observe : `niveau_eau_m_ngm`
- nom_standard : `Niveau_eau`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_niv_eau_barrages`
- volumes : `85166` lignes, `85166` non nulles, `0` nulles
- exemples : `556.65 | 161.01 | 541.79`

## Problème
Le paramètre `niveau_eau_m_ngm` est rattaché à `Niveau_eau`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `Niveau_eau`. Unité source observée : `à confirmer` ; unité métier dominante : `m NGM`. Volume agrégé du cas : `85166` lignes, dont `85166` non nulles, `0` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `746.18`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_041_niveau_eau_m_ngm.sql`

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
