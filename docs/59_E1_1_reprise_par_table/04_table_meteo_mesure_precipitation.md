# Mini-lot — meteo.mesure_precipitation

## Contexte

- table cible : `meteo.mesure_precipitation`
- table(s) source(s) : `raw_mesures_precipitations_jr_traitees, raw_mesures_precipitations_jr`
- run_id source : `f0f2a858-1c90-4b15-a6af-cc172bece071`

## Metriques

- volume actuel table cible : `546007`
- volume candidat dans `qa_dry_run.e0_mesures_preparees` : `2099557`
- volume en quarantaine `E0` a exclure : `208344`
- volume source métier distinct détecté : `2099557`
- volume déjà présent selon clé métier : `2099192`
- volume potentiellement insérable : `365`
- doublons métier actuels dans la cible : `0`
- doublons métier dans la source préparée : `1553185`
- lignes avec `geo_ref` null dans la source préparée métier : `2099557`
- lignes avec paramètre null : `0`
- lignes avec valeur null : `0`

## Clés et stabilité

- clé métier disponible : `(temps, station_id)`
- clé métier cible SQL : `temps::text || '|' || station_id::text`
- `source_row_id` stable : `non`
- lignes `source_row_id` au format `ctid` : `507930`

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
