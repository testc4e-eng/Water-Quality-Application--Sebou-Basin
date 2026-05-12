# Mini-lot — meteo.mesure_evaporation

## Contexte

- table cible : `meteo.mesure_evaporation`
- table(s) source(s) : `raw_mesures_evaporation_jr`
- run_id source : `f0f2a858-1c90-4b15-a6af-cc172bece071`

## Metriques

- volume actuel table cible : `48900`
- volume candidat dans `qa_dry_run.e0_mesures_preparees` : `38592`
- volume en quarantaine `E0` a exclure : `10308`
- volume source métier distinct détecté : `38592`
- volume déjà présent selon clé métier : `38592`
- volume potentiellement insérable : `0`
- doublons métier actuels dans la cible : `0`
- doublons métier dans la source préparée : `0`
- lignes avec `geo_ref` null dans la source préparée métier : `38592`
- lignes avec paramètre null : `0`
- lignes avec valeur null : `0`

## Clés et stabilité

- clé métier disponible : `(temps, station_id)`
- clé métier cible SQL : `temps::text || '|' || station_id::text`
- `source_row_id` stable : `oui`
- lignes `source_row_id` au format `ctid` : `0`

## Stratégie recommandée

- stratégie : `NE_RIEN_FAIRE`
- justification : la cible couvre déjà le périmètre métier détecté
- risque : `faible`
- décision attendue : `validée`

## Décision actée

- statut : `VALIDE_HORS_PERIMETRE`
- action : aucune écriture autorisée
- effet : mini-lot sorti du périmètre actif `E1.1`

## Lecture opérationnelle

- si la stratégie est `NE_RIEN_FAIRE`, la table doit être sortie du périmètre d'exécution `E1.1`
- si la stratégie est `UPSERT_METIER`, l'insertion doit filtrer sur la clé métier avant toute écriture
- si la stratégie est `RESET_AND_RELOAD`, un backup ciblé et un audit hash sont obligatoires
- si la stratégie est `BLOQUE`, aucune exécution sans nouvelle décision métier/technique
