# Mini-lot — hydro.barrage_bathymetrie

## Contexte

- table cible : `hydro.barrage_bathymetrie`
- table(s) source(s) : `raw_bathymetries_barrages_abhs`
- run_id source : `f0f2a858-1c90-4b15-a6af-cc172bece071`

## Metriques

- volume actuel table cible : `62359`
- volume candidat dans `qa_dry_run.e0_mesures_preparees` : `186797`
- volume en quarantaine `E0` a exclure : `280`
- volume source métier distinct détecté : `186797`
- volume déjà présent selon clé métier : `0`
- volume potentiellement insérable : `0`
- doublons métier actuels dans la cible : `0`
- doublons métier dans la source préparée : `124438`
- lignes avec `geo_ref` null dans la source préparée métier : `186797`
- lignes avec paramètre null : `0`
- lignes avec valeur null : `0`

## Clés et stabilité

- clé métier disponible : `(ire_barrage, hauteur_m, volume_mm3)`
- clé métier cible SQL : `coalesce(ire_barrage,'') || '|' || coalesce(hauteur_m::text,'') || '|' || coalesce(volume_mm3::text,'')`
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
