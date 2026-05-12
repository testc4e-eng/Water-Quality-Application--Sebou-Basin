# Plan d'exécution migration corrigé

## Décision de référence
- Source officielle : `abh_sebou_ismail`.
- Base cible : `abh_sad`.
- `abh_sad.staging` doit être vidé puis reconstruit depuis `abh_sebou_ismail`.
- Les données SWAT/WASP présentes dans `abh_sad` seront remplacées ou mises à jour après backup.
- Les référentiels paramètres seront reconstruits depuis les fichiers validés métier.
- Aucune commande de modification ne doit être exécutée sans validation humaine explicite.

## Synthèse

| Indicateur | Valeur |
|---|---|
| Tables staging cible à vider/reconstruire | 35 |
| Tables source métier à importer vers staging.raw_* | 46 |
| Tables source techniques exclues du Lot A | 1 (`public.spatial_ref_sys`) |
| Tables SWAT/WASP/modèles concernées | 23 |
| Tables métier à revoir | 79 |
| Fichiers de gouvernance paramètres mobilisés | 7 |
| Statut global | Lot A exécuté/validé ; Lot D3.1 produit, en attente validation/exécution metadata |

## Lots officiels

| Lot | Objectif | Statut |
|---|---|---|
| Lot A | Vidage `abh_sad.staging` puis import brut métier depuis `abh_sebou_ismail` vers `staging.raw_*`, hors `public.spatial_ref_sys` | EXECUTED - VALIDÉ |
| Lot B | Backup puis vidage des anciennes données SWAT/WASP/modèles | PENDING |
| Lot C | Vérification progressive des schémas métier `qualite`, `hydro`, `meteo`, `infra`, `metadata` | PENDING |
| Lot D | Reconstruction des référentiels paramètres depuis fichiers validés métier | D3.1 PENDING VALIDATION |
| Lot E | Migration contrôlée de `staging.raw_*` vers tables finales avec mapping, parsing, QA et quarantaine | PENDING |

## Fichiers produits

| Fichier | Contenu | Statut |
|---|---|---|
| 00_index.md | Vue globale du workflow corrigé | créé |
| 01_decisions_metier_integrees.md | Décisions métier intégrées au plan | créé |
| 02_lot_A_vidage_staging_et_import_source.md | Plan Lot A | créé |
| 03_lot_B_vidage_swat_wasp.md | Plan Lot B | créé |
| 04_lot_C_verification_schemas_metier.md | Plan Lot C | créé |
| 05_lot_D_reconstruction_referentiel_parametres.md | Plan Lot D | créé |
| 06_lot_E_migration_staging_vers_tables_finales.md | Plan Lot E | créé |
| 07_plan_validation_humaine_par_lot.md | Validation bloquante par lot | créé |
| 08_sql_backup_pre_execution.sql | SQL/commandes backup proposés et commentés | créé |
| 09_sql_vidage_staging_propose.sql | TRUNCATE staging proposés et commentés | créé |
| 10_sql_vidage_swat_wasp_propose.sql | TRUNCATE SWAT/WASP proposés et commentés | créé |
| 11_sql_import_staging_depuis_abh_sebou_ismail_propose.sql | Import staging proposé et commenté | créé |
| 12_journal_decisions.md | Journal décisions PENDING | créé |
| 13_log_pre_execution.md | Log de pré-exécution | créé |
| 14_checklist_avant_execution.md | Checklist bloquante | créé |
| 15_rapport_execution_lot_A1.md | Rapport de preuves Lot A1 backup + exports staging | créé |
| 16_rapport_execution_lot_A2.md | Rapport de preuves Lot A2 vidage staging + import raw | créé |
| 17_log_execution_lot_A.md | Log d'exécution consolidé du Lot A | créé |
| 18_lot_D_phase_D1_structure_metadata.md | Proposition de structure référentiel paramètres metadata | créé |
| 19_sql_lot_D_D1_structure_metadata_propose.sql | SQL DDL proposé et commenté pour validation D1 | créé |
| 20_lot_D_phase_D2_echantillon_parametres.md | Échantillon de 30 paramètres consolidés avec mapping réel | créé, VALIDÉ UTILISATEUR |
| 21_lot_D_phase_D2_echantillon_parametres.csv | CSV exploitable de l'échantillon D2 | créé, VALIDÉ UTILISATEUR |
| 22_sql_lot_D_D2_insert_sample_propose.sql | SQL d'insertion proposé/commenté pour l'échantillon D2 | créé, non exécuté |
| 23_lot_D_phase_D3_referentiel_complet.md | Synthèse du référentiel paramètres complet D3 | créé, PENDING VALIDATION |
| 24_lot_D_phase_D3_parametre_master_complet.csv | Référentiel canonique complet proposé | créé, PENDING VALIDATION |
| 25_lot_D_phase_D3_mapping_source_complet.csv | Mapping source complet proposé | créé, PENDING VALIDATION |
| 26_lot_D_phase_D3_parametres_quarantaine.md | Paramètres et mappings en quarantaine | créé |
| 27_lot_D_phase_D3_parametres_ambigus.md | Ambiguïtés restantes | créé |
| 28_lot_D_phase_D3_unites_et_attributs.md | Unités et attributs obligatoires | créé |
| 29_lot_D_phase_D3_regles_parsing_QA.md | Règles parsing et QA | créé |
| 30_sql_lot_D_D3_metadata_full_propose.sql | SQL metadata complet proposé/commenté | créé, non exécuté |
| 31_rapport_controle_D3.md | Rapport de contrôle D3 | créé |
| 32_lot_D_phase_D3_1_corrections_ciblees.md | Corrections ciblées D3.1 | créé, PENDING VALIDATION |
| 33_lot_D_phase_D3_1_parametre_master_corrige.csv | Référentiel canonique corrigé D3.1 | créé, PENDING VALIDATION |
| 34_lot_D_phase_D3_1_mapping_source_corrige.csv | Mapping source corrigé D3.1 | créé, PENDING VALIDATION |
| 35_lot_D_phase_D3_1_reste_a_valider_metier.md | Tableau réduit des arbitrages métier restants | créé |
| 36_rapport_controle_D3_1.md | Rapport de contrôle D3.1 | créé |
| 37_sql_lot_D_D3_1_metadata_corrige_propose.sql | SQL metadata corrigé proposé/commenté | créé, non exécuté |
