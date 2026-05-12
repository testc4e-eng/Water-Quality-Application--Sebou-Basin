# Mini-lot — qualite.suivi_qualite_barrage_garde_hebdo

## Contexte

- table cible : `qualite.suivi_qualite_barrage_garde_hebdo`
- table(s) source(s) : `raw_suivi_qualite_brg_garde_hebdo`
- run_id source : `f0f2a858-1c90-4b15-a6af-cc172bece071`

## Metriques

- volume actuel table cible : `7094`
- volume candidat dans `qa_dry_run.e0_mesures_preparees` : `3511`
- volume en quarantaine `E0` a exclure : `3583`
- volume source métier distinct détecté : `3511`
- volume déjà présent selon clé métier : `6956`
- volume potentiellement insérable : `0`
- doublons métier actuels dans la cible : `3467`
- doublons métier dans la source préparée : `1676`
- lignes avec `geo_ref` null dans la source préparée métier : `0`
- lignes avec paramètre null : `0`
- lignes avec valeur null : `0`

## Clés et stabilité

- clé métier disponible : `(temps, station_id, parametre_qualite)`
- clé métier cible SQL : `temps::text || '|' || station_id::text || '|' || parametre_qualite`
- `source_row_id` stable : `oui`
- lignes `source_row_id` au format `ctid` : `0`

## Stratégie recommandée

- stratégie : `RESET_AND_RELOAD`
- justification : doublons métier déjà présents dans la cible
- risque : `élevé`
- décision attendue : `validation humaine`

## Lecture opérationnelle

- si la stratégie est `NE_RIEN_FAIRE`, la table doit être sortie du périmètre d'exécution `E1.1`
- si la stratégie est `UPSERT_METIER`, l'insertion doit filtrer sur la clé métier avant toute écriture
- si la stratégie est `RESET_AND_RELOAD`, un backup ciblé et un audit hash sont obligatoires
- si la stratégie est `BLOQUE`, aucune exécution sans nouvelle décision métier/technique
