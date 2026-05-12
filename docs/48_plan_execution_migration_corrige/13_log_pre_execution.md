# Log de pré-exécution — plan migration corrigé

## Statut
Lot A a été exécuté et validé séparément. Pour le Lot D, aucune création ou modification `metadata` n'a été exécutée.

## Actions documentaires réalisées

| Date | Action | Statut |
|---|---|---|
| 2026-04-29 | Création dossier `docs/48_plan_execution_migration_corrige/` | DONE |
| 2026-04-29 | Intégration décisions métier SWAT/WASP et staging | DONE |
| 2026-04-29 | Génération scripts SQL proposés/commentés | DONE |
| 2026-04-29 | Génération journal décisions PENDING | DONE |
| 2026-04-29 | Correction Lot A : exclusion `public.spatial_ref_sys` et découpage A1/A2 | DONE |
| 2026-04-29 | Phase 0 Lot A : vérification préconditions A1/C01/C02/C03 | BLOCKED - validations manquantes |
| 2026-04-30 | Lot D Phase D1 : proposition structure metadata | DONE - aucune modification BD |
| 2026-04-30 | Lot D Phase D2 : génération échantillon 30 paramètres + SQL proposé commenté | DONE - lecture seule raw, aucune modification metadata |
| 2026-05-04 | Lot D Phase D3 : génération référentiel complet + mapping source + SQL proposé commenté | DONE - lecture seule raw, aucune modification metadata |
| 2026-05-04 | Lot D Phase D3.1 : correction ciblée Fe/Mn, météo, conductivité et modèles | DONE - aucune modification metadata |

## Commandes BD exécutées

Lot A a exécuté les commandes validées et documentées dans `17_log_execution_lot_A.md`.

Pour Lot D1/D2/D3/D3.1 : uniquement des contrôles catalogue, lectures `SELECT` sur `staging.raw_*` ou corrections documentaires. Aucune création ou modification `metadata`.

## Blocage Phase 0 Lot A

| étape | action | résultat | statut |
|---|---|---|---|
| Phase 0 | Vérifier validation Lot A1 | `PENDING` dans `02_lot_A_vidage_staging_et_import_source.md` et `07_plan_validation_humaine_par_lot.md` | BLOCKED |
| Phase 0 | Vérifier C01 source officielle `abh_sebou_ismail` | `PENDING` dans `14_checklist_avant_execution.md` | BLOCKED |
| Phase 0 | Vérifier C02 backup complet `abh_sad` | `PENDING` dans `14_checklist_avant_execution.md` | BLOCKED |
| Phase 0 | Vérifier C03 exports CSV staging | `PENDING` dans `14_checklist_avant_execution.md` | BLOCKED |

## Statut exécution

Lots B, C, exécution metadata D3.1 et E restent `PENDING`.

Lot A : exécuté et validé.

Lot D1 : structure proposée dans `18_lot_D_phase_D1_structure_metadata.md` et `19_sql_lot_D_D1_structure_metadata_propose.sql`. Aucune table créée. Structure validée utilisateur pour produire D2.

Lot D2 : échantillon produit dans `20_lot_D_phase_D2_echantillon_parametres.md`, `21_lot_D_phase_D2_echantillon_parametres.csv` et `22_sql_lot_D_D2_insert_sample_propose.sql`. Aucune table créée, aucun `INSERT` exécuté. Validé utilisateur pour produire D3.

Lot D3 : référentiel complet produit dans `23` à `31`. SQL proposé entièrement commenté, 0 ligne SQL active. Aucune table créée, aucun `INSERT` exécuté. STOP avant exécution metadata ou Lot E.

Lot D3.1 : corrections ciblées produites dans `32` à `37`. SQL proposé entièrement commenté, 0 ligne SQL active. Aucune table créée, aucun `INSERT` exécuté. STOP avant validation C17.

## Exécution Lot A1 — Backup et exports staging

| étape | action | résultat | statut |
|---|---|---|---|
| A1.1 | Backup complet `abh_sad` via `pg_dump -Fc` | Dump `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\backup_abh_sad_20260429_150054.dump` ; taille 109.03 MB ; SHA256 `9916F7B19A4370A665557102B6F5BCC111CA9B66D8499698A37D3435EAD4E9DF` | OK |
| A1.1 | Vérification lisibilité dump | `pg_restore --list` OK ; 70329 lignes listées ; fichier `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\pg_restore_list.txt` | OK |
| A1.1 | Avertissements `pg_dump` | Avertissements non bloquants sur FK circulaires Timescale/PostgreSQL ; code retour OK ; dump lisible | OK_WITH_WARNING |
| A1.2 | Exports CSV des 35 tables staging | Dossier `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\staging_csv` ; taille totale 111875758 octets | OK |
| A1.2 | Contrôle volumes SQL vs CSV | COUNT SQL 2249330 ; lignes CSV 2249330 ; delta 0 | OK |
| STOP | Arrêt obligatoire avant A2 | Aucun vidage, aucun import, aucune modification BD exécutée | STOP - VALIDATION HUMAINE REQUISE |

### Manifest détaillé

- CSV : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\staging_exports_manifest.csv`
- Markdown : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\staging_exports_manifest.md`
- Résumé JSON : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A1_summary.json`

## Exécution Lot A2 — vidage staging et import raw

| étape | action | résultat | statut |
|---|---|---|---|
| A2.1 | Vidage contrôlé des 35 tables `staging` | total avant 2249330 ; total après 0 ; erreurs 0 | OK |
| A2.2 | Import 46 tables source métier vers `staging.raw_*` | source 2175895 ; raw 2175895 ; delta 0 ; erreurs 0 | OK |
| A2.3 | Contrôle global indépendant | 46 couples source/raw ; delta total 0 ; anciennes tables staging non-zéro 0 | OK |
| STOP | Arrêt obligatoire avant Lot B/C/D/E | Aucun autre schéma métier touché ; aucune migration finale exécutée | STOP - VALIDATION HUMAINE REQUISE |

### Fichiers preuves A2

- Vidage staging CSV : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_1_truncate_staging_results.csv`
- Vidage staging Markdown : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_1_truncate_staging_results.md`
- Import raw CSV : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_2_import_raw_results.csv`
- Import raw Markdown : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_2_import_raw_results.md`
- Contrôle global CSV : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_3_global_volume_control.csv`
- Contrôle global Markdown : `C:\dev\WQDSS\repo_git\backups\migration_lot_A1_20260429_150054\lot_A2_execution\a2_3_global_volume_control.md`

## Exécution Lot E1 — chargement final sans IDP

| étape | action | résultat | statut |
|---|---|---|---|
| E1 | hydro.mesure_debit <= raw_mesures_debit_jr | candidats 0 ; insérés 0 ; avant 521433 ; après 521433 | OK |
| E1 | hydro.mesure_debit_mensuel <= raw_mesures_debit_m | candidats 0 ; insérés 0 ; avant 19316 ; après 19316 | OK |
| E1 | hydro.mesure_debit_source <= raw_mesures_debit_sources | candidats 2816 ; insérés 1162 ; avant 2816 ; après 3978 | OK |
| E1 | hydro.mesure_barrage <= raw_mesures_niv_eau_barrages | candidats 85074 ; insérés 0 ; avant 84831 ; après 84831 | OK |
| E1 | hydro.barrage_bathymetrie <= raw_bathymetries_barrages_abhs | candidats 62359 ; insérés 0 ; avant 62359 ; après 62359 | OK |
| E1 | meteo.mesure_precipitation <= raw_mesures_precipitations_jr_traitees | candidats 546007 ; insérés 0 ; avant 546007 ; après 546007 | OK |
| E1 | meteo.mesure_precipitation <= raw_mesures_precipitations_jr | candidats 0 ; insérés 0 ; avant 546007 ; après 546007 | OK |
| E1 | meteo.mesure_precipitation_annuelle_max <= raw_mesures_precipitations_jr_max | candidats 1915 ; insérés 0 ; avant 2085 ; après 2085 | OK |
| E1 | meteo.mesure_evaporation <= raw_mesures_evaporation_jr | candidats 38592 ; insérés 0 ; avant 48900 ; après 48900 | OK |
| E1 | qualite.mesure_qualite_barrage <= raw_mesures_qualite_barrages | candidats 8708 ; insérés 0 ; avant 15808 ; après 15808 | OK |
| E1 | qualite.mesure_qualite_nappe <= raw_mesures_qualite_nappes | candidats 63076 ; insérés 0 ; avant 63088 ; après 63088 | OK |
| E1 | qualite.mesure_qualite_riviere <= raw_mesures_qualite_rivieres | candidats 60074 ; insérés 0 ; avant 60097 ; après 60097 | OK |
| E1 | qualite.mesure_qualite_sebou <= raw_suivi_qualite_sebou_jr | candidats 49954 ; insérés 49954 ; avant 51402 ; après 101356 | OK |
| E1 | qualite.suivi_qualite_barrage_garde_hebdo <= raw_suivi_qualite_brg_garde_hebdo | candidats 3511 ; insérés 0 ; avant 7094 ; après 7094 | OK |
