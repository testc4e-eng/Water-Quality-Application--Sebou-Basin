# Mini-lot — hydro.mesure_barrage

## Contexte

- table cible : `hydro.mesure_barrage`
- table(s) source(s) : `raw_mesures_niv_eau_barrages`
- run_id source : `f0f2a858-1c90-4b15-a6af-cc172bece071`

## Metriques

- volume actuel table cible : `84831`
- volume candidat dans `qa_dry_run.e0_mesures_preparees` : `264723`
- volume en quarantaine `E0` a exclure : `161107`
- volume source métier distinct détecté : `264447`
- volume déjà présent selon clé métier : `264447`
- volume potentiellement insérable : `0`
- doublons métier actuels dans la cible : `0`
- doublons métier dans la source préparée : `972`
- lignes avec `geo_ref` null dans la source préparée métier : `264447`
- lignes avec paramètre null : `0`
- lignes avec valeur null : `0`

## Clés et stabilité

- clé métier disponible : `(temps, barrage_id)`
- clé métier cible SQL : `temps::text || '|' || barrage_id::text`
- `source_row_id` stable : `oui`
- lignes `source_row_id` au format `ctid` : `0`

## Stratégie recommandée

- stratégie : `BLOQUE`
- justification : schema source/cible ou sémantique non stabilisée
- risque : `élevé`
- décision attendue : `validation humaine`

## Lecture opérationnelle

- si la stratégie est `NE_RIEN_FAIRE`, la table doit être sortie du périmètre d'exécution `E1.1`
- si la stratégie est `UPSERT_METIER`, l'insertion doit filtrer sur la clé métier avant toute écriture
- si la stratégie est `RESET_AND_RELOAD`, un backup ciblé et un audit hash sont obligatoires
- si la stratégie est `BLOQUE`, aucune exécution sans nouvelle décision métier/technique
