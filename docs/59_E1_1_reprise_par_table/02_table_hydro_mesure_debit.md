# Mini-lot — hydro.mesure_debit

## Contexte

- table cible : `hydro.mesure_debit`
- table(s) source(s) : `raw_mesures_debit_jr`
- run_id source : `f0f2a858-1c90-4b15-a6af-cc172bece071`

## Metriques

- volume actuel table cible : `521433`
- volume candidat dans `qa_dry_run.e0_mesures_preparees` : `515978`
- volume en quarantaine `E0` a exclure : `5455`
- volume source métier distinct détecté : `515978`
- volume déjà présent selon clé métier : `384965`
- volume potentiellement insérable : `131013`
- doublons métier actuels dans la cible : `0`
- doublons métier dans la source préparée : `0`
- lignes avec `geo_ref` null dans la source préparée métier : `515978`
- lignes avec paramètre null : `515978`
- lignes avec valeur null : `0`

## Clés et stabilité

- clé métier disponible : `(temps, station_id)`
- clé métier cible SQL : `temps::text || '|' || station_id::text`
- `source_row_id` stable : `non`
- lignes `source_row_id` au format `ctid` : `515978`

## Stratégie recommandée

- stratégie : `BLOQUE`
- justification : reprise impossible sans clé source stable
- risque : `élevé`
- décision attendue : `validation humaine`

## Lecture opérationnelle

- si la stratégie est `NE_RIEN_FAIRE`, la table doit être sortie du périmètre d'exécution `E1.1`
- si la stratégie est `UPSERT_METIER`, l'insertion doit filtrer sur la clé métier avant toute écriture
- si la stratégie est `RESET_AND_RELOAD`, un backup ciblé et un audit hash sont obligatoires
- si la stratégie est `BLOQUE`, aucune exécution sans nouvelle décision métier/technique
