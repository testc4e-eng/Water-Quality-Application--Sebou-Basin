# CAS-067 p_annuelle

## Identification
- parametre_observe : `p_annuelle`
- nom_standard : `P_annuelle`
- type_cas : `UNIT_VALIDATION`
- unité source : `à confirmer`
- criticité : `Élevée`

## Données
- tables sources : `mesures_precipitations_jr_max`
- volumes : `2085` lignes, `1915` non nulles, `170` nulles
- exemples : `367.4 | 405.8 | 504.8`

## Problème
Le paramètre `p_annuelle` est rattaché à `P_annuelle`, mais l'unité source n'est pas suffisamment stabilisée pour migrer sans validation humaine.

## Analyse
Mapping observé : `P_annuelle`. Unité source observée : `à confirmer` ; unité métier dominante : `mm/an`. Volume agrégé du cas : `2085` lignes, dont `1915` non nulles, `170` nulles, `0` non numériques et `0` suspectes. Plage observée dans les audits existants : min `0` / max `2871`. Référence externe déjà associée dans l'audit précédent : `référence bibliographique non confirmée`.

## Proposition
- action : `STAGING_ONLY`
- règles : `valider l’unité de référence avant toute migration`
- flags : `UNIT_MISSING`
- SQL proposé (non exécuté) : `06_sql_en_attente/CAS_067_p_annuelle.sql`

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
