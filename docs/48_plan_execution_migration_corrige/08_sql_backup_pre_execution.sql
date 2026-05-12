-- ATTENTION : SCRIPT PROPOSÉ, NON EXÉCUTÉ
-- EXÉCUTION INTERDITE SANS VALIDATION HUMAINE
-- Toutes les lignes SQL ou commandes ci-dessous sont commentées volontairement.

-- Backup global recommandé :
-- pg_dump --host 127.0.0.1 --port 5432 --username postgres --format custom --file backups/abh_sad_full_YYYYMMDD_HHMM.dump abh_sad
-- certutil -hashfile backups/abh_sad_full_YYYYMMDD_HHMM.dump SHA256

-- Contrôles de volumes avant toute exécution :
-- Table : hydro.barrage_bathymetrie | volume documentaire : 62359 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'hydro.barrage_bathymetrie' AS table_name, COUNT(*) AS volume_lignes FROM "hydro"."barrage_bathymetrie";
-- SELECT 'hydro.barrage_bathymetrie' AS table_name, pg_size_pretty(pg_total_relation_size('hydro.barrage_bathymetrie'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "hydro"."barrage_bathymetrie") TO 'backups/abh_sad_csv/hydro_barrage_bathymetrie_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/hydro_barrage_bathymetrie_YYYYMMDD_HHMM.csv SHA256

-- Table : hydro.mesure_barrage | volume documentaire : 84831 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'hydro.mesure_barrage' AS table_name, COUNT(*) AS volume_lignes FROM "hydro"."mesure_barrage";
-- SELECT 'hydro.mesure_barrage' AS table_name, pg_size_pretty(pg_total_relation_size('hydro.mesure_barrage'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "hydro"."mesure_barrage") TO 'backups/abh_sad_csv/hydro_mesure_barrage_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/hydro_mesure_barrage_YYYYMMDD_HHMM.csv SHA256

-- Table : hydro.mesure_debit | volume documentaire : 521433 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'hydro.mesure_debit' AS table_name, COUNT(*) AS volume_lignes FROM "hydro"."mesure_debit";
-- SELECT 'hydro.mesure_debit' AS table_name, pg_size_pretty(pg_total_relation_size('hydro.mesure_debit'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "hydro"."mesure_debit") TO 'backups/abh_sad_csv/hydro_mesure_debit_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/hydro_mesure_debit_YYYYMMDD_HHMM.csv SHA256

-- Table : hydro.mesure_debit_mensuel | volume documentaire : 19316 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'hydro.mesure_debit_mensuel' AS table_name, COUNT(*) AS volume_lignes FROM "hydro"."mesure_debit_mensuel";
-- SELECT 'hydro.mesure_debit_mensuel' AS table_name, pg_size_pretty(pg_total_relation_size('hydro.mesure_debit_mensuel'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "hydro"."mesure_debit_mensuel") TO 'backups/abh_sad_csv/hydro_mesure_debit_mensuel_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/hydro_mesure_debit_mensuel_YYYYMMDD_HHMM.csv SHA256

-- Table : hydro.mesure_debit_source | volume documentaire : 2816 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'hydro.mesure_debit_source' AS table_name, COUNT(*) AS volume_lignes FROM "hydro"."mesure_debit_source";
-- SELECT 'hydro.mesure_debit_source' AS table_name, pg_size_pretty(pg_total_relation_size('hydro.mesure_debit_source'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "hydro"."mesure_debit_source") TO 'backups/abh_sad_csv/hydro_mesure_debit_source_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/hydro_mesure_debit_source_YYYYMMDD_HHMM.csv SHA256

-- Table : hydro.regle_qualite_debit_source | volume documentaire : 19 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'hydro.regle_qualite_debit_source' AS table_name, COUNT(*) AS volume_lignes FROM "hydro"."regle_qualite_debit_source";
-- SELECT 'hydro.regle_qualite_debit_source' AS table_name, pg_size_pretty(pg_total_relation_size('hydro.regle_qualite_debit_source'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "hydro"."regle_qualite_debit_source") TO 'backups/abh_sad_csv/hydro_regle_qualite_debit_source_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/hydro_regle_qualite_debit_source_YYYYMMDD_HHMM.csv SHA256

-- Table : hydro.regle_qualite_debit_station | volume documentaire : 390 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'hydro.regle_qualite_debit_station' AS table_name, COUNT(*) AS volume_lignes FROM "hydro"."regle_qualite_debit_station";
-- SELECT 'hydro.regle_qualite_debit_station' AS table_name, pg_size_pretty(pg_total_relation_size('hydro.regle_qualite_debit_station'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "hydro"."regle_qualite_debit_station") TO 'backups/abh_sad_csv/hydro_regle_qualite_debit_station_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/hydro_regle_qualite_debit_station_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.barrages | volume documentaire : 34 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'infra.barrages' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."barrages";
-- SELECT 'infra.barrages' AS table_name, pg_size_pretty(pg_total_relation_size('infra.barrages'::regclass)) AS taille_totale;

-- Table : infra.decharge | volume documentaire : 233 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.decharge' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."decharge";
-- SELECT 'infra.decharge' AS table_name, pg_size_pretty(pg_total_relation_size('infra.decharge'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."decharge") TO 'backups/abh_sad_csv/infra_decharge_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_decharge_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.decharge_inventaire_pollution | volume documentaire : 11 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.decharge_inventaire_pollution' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."decharge_inventaire_pollution";
-- SELECT 'infra.decharge_inventaire_pollution' AS table_name, pg_size_pretty(pg_total_relation_size('infra.decharge_inventaire_pollution'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."decharge_inventaire_pollution") TO 'backups/abh_sad_csv/infra_decharge_inventaire_pollution_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_decharge_inventaire_pollution_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.decharge_inventaire_pollution_general | volume documentaire : 139 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.decharge_inventaire_pollution_general' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."decharge_inventaire_pollution_general";
-- SELECT 'infra.decharge_inventaire_pollution_general' AS table_name, pg_size_pretty(pg_total_relation_size('infra.decharge_inventaire_pollution_general'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."decharge_inventaire_pollution_general") TO 'backups/abh_sad_csv/infra_decharge_inventaire_pollution_general_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_decharge_inventaire_pollution_general_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.fosses_septiques_abhs | volume documentaire : 20 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'infra.fosses_septiques_abhs' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."fosses_septiques_abhs";
-- SELECT 'infra.fosses_septiques_abhs' AS table_name, pg_size_pretty(pg_total_relation_size('infra.fosses_septiques_abhs'::regclass)) AS taille_totale;

-- Table : infra.huilerie | volume documentaire : 612 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.huilerie' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."huilerie";
-- SELECT 'infra.huilerie' AS table_name, pg_size_pretty(pg_total_relation_size('infra.huilerie'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."huilerie") TO 'backups/abh_sad_csv/infra_huilerie_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_huilerie_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.huilerie_inventaire_pollution | volume documentaire : 606 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.huilerie_inventaire_pollution' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."huilerie_inventaire_pollution";
-- SELECT 'infra.huilerie_inventaire_pollution' AS table_name, pg_size_pretty(pg_total_relation_size('infra.huilerie_inventaire_pollution'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."huilerie_inventaire_pollution") TO 'backups/abh_sad_csv/infra_huilerie_inventaire_pollution_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_huilerie_inventaire_pollution_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.mine | volume documentaire : 42 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.mine' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."mine";
-- SELECT 'infra.mine' AS table_name, pg_size_pretty(pg_total_relation_size('infra.mine'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."mine") TO 'backups/abh_sad_csv/infra_mine_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_mine_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.mine_inventaire_pollution | volume documentaire : 39 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.mine_inventaire_pollution' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."mine_inventaire_pollution";
-- SELECT 'infra.mine_inventaire_pollution' AS table_name, pg_size_pretty(pg_total_relation_size('infra.mine_inventaire_pollution'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."mine_inventaire_pollution") TO 'backups/abh_sad_csv/infra_mine_inventaire_pollution_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_mine_inventaire_pollution_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.point_eau | volume documentaire : 46 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'infra.point_eau' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."point_eau";
-- SELECT 'infra.point_eau' AS table_name, pg_size_pretty(pg_total_relation_size('infra.point_eau'::regclass)) AS taille_totale;

-- Table : infra.profil_station | volume documentaire : 1980 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'infra.profil_station' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."profil_station";
-- SELECT 'infra.profil_station' AS table_name, pg_size_pretty(pg_total_relation_size('infra.profil_station'::regclass)) AS taille_totale;

-- Table : infra.rejet_abattoir | volume documentaire : 61 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.rejet_abattoir' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."rejet_abattoir";
-- SELECT 'infra.rejet_abattoir' AS table_name, pg_size_pretty(pg_total_relation_size('infra.rejet_abattoir'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."rejet_abattoir") TO 'backups/abh_sad_csv/infra_rejet_abattoir_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_rejet_abattoir_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.rejet_abattoir_inventaire_pollution | volume documentaire : 56 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.rejet_abattoir_inventaire_pollution' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."rejet_abattoir_inventaire_pollution";
-- SELECT 'infra.rejet_abattoir_inventaire_pollution' AS table_name, pg_size_pretty(pg_total_relation_size('infra.rejet_abattoir_inventaire_pollution'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."rejet_abattoir_inventaire_pollution") TO 'backups/abh_sad_csv/infra_rejet_abattoir_inventaire_pollution_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_rejet_abattoir_inventaire_pollution_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.rejet_domestique | volume documentaire : 362 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.rejet_domestique' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."rejet_domestique";
-- SELECT 'infra.rejet_domestique' AS table_name, pg_size_pretty(pg_total_relation_size('infra.rejet_domestique'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."rejet_domestique") TO 'backups/abh_sad_csv/infra_rejet_domestique_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_rejet_domestique_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.rejet_industriel | volume documentaire : 11 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.rejet_industriel' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."rejet_industriel";
-- SELECT 'infra.rejet_industriel' AS table_name, pg_size_pretty(pg_total_relation_size('infra.rejet_industriel'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."rejet_industriel") TO 'backups/abh_sad_csv/infra_rejet_industriel_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_rejet_industriel_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.rejet_inventaire_pollution | volume documentaire : 277 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.rejet_inventaire_pollution' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."rejet_inventaire_pollution";
-- SELECT 'infra.rejet_inventaire_pollution' AS table_name, pg_size_pretty(pg_total_relation_size('infra.rejet_inventaire_pollution'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."rejet_inventaire_pollution") TO 'backups/abh_sad_csv/infra_rejet_inventaire_pollution_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_rejet_inventaire_pollution_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.stations | volume documentaire : 390 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'infra.stations' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."stations";
-- SELECT 'infra.stations' AS table_name, pg_size_pretty(pg_total_relation_size('infra.stations'::regclass)) AS taille_totale;

-- Table : infra.stations_mesure | volume documentaire : 390 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'infra.stations_mesure' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."stations_mesure";
-- SELECT 'infra.stations_mesure' AS table_name, pg_size_pretty(pg_total_relation_size('infra.stations_mesure'::regclass)) AS taille_totale;

-- Table : infra.step | volume documentaire : 41 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.step' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."step";
-- SELECT 'infra.step' AS table_name, pg_size_pretty(pg_total_relation_size('infra.step'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."step") TO 'backups/abh_sad_csv/infra_step_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_step_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.step_industrielle | volume documentaire : 15 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.step_industrielle' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."step_industrielle";
-- SELECT 'infra.step_industrielle' AS table_name, pg_size_pretty(pg_total_relation_size('infra.step_industrielle'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."step_industrielle") TO 'backups/abh_sad_csv/infra_step_industrielle_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_step_industrielle_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.step_inventaire_pollution | volume documentaire : 49 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'infra.step_inventaire_pollution' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."step_inventaire_pollution";
-- SELECT 'infra.step_inventaire_pollution' AS table_name, pg_size_pretty(pg_total_relation_size('infra.step_inventaire_pollution'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "infra"."step_inventaire_pollution") TO 'backups/abh_sad_csv/infra_step_inventaire_pollution_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/infra_step_inventaire_pollution_YYYYMMDD_HHMM.csv SHA256

-- Table : infra.stm | volume documentaire : 18 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'infra.stm' AS table_name, COUNT(*) AS volume_lignes FROM "infra"."stm";
-- SELECT 'infra.stm' AS table_name, pg_size_pretty(pg_total_relation_size('infra.stm'::regclass)) AS taille_totale;

-- Table : metadata.api_view_catalog | volume documentaire : 57 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'metadata.api_view_catalog' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."api_view_catalog";
-- SELECT 'metadata.api_view_catalog' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.api_view_catalog'::regclass)) AS taille_totale;

-- Table : metadata.api_view_column_catalog | volume documentaire : 1101 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'metadata.api_view_column_catalog' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."api_view_column_catalog";
-- SELECT 'metadata.api_view_column_catalog' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.api_view_column_catalog'::regclass)) AS taille_totale;

-- Table : metadata.catalogue_type_mesure | volume documentaire : 64 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'metadata.catalogue_type_mesure' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."catalogue_type_mesure";
-- SELECT 'metadata.catalogue_type_mesure' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.catalogue_type_mesure'::regclass)) AS taille_totale;

-- Table : metadata.dictionnaire_donnees | volume documentaire : 0 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'metadata.dictionnaire_donnees' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."dictionnaire_donnees";
-- SELECT 'metadata.dictionnaire_donnees' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.dictionnaire_donnees'::regclass)) AS taille_totale;

-- Table : metadata.mapping_abreviation_colonne_inventaire | volume documentaire : 13 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_abreviation_colonne_inventaire' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_abreviation_colonne_inventaire";
-- SELECT 'metadata.mapping_abreviation_colonne_inventaire' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_abreviation_colonne_inventaire'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_abreviation_colonne_inventaire") TO 'backups/abh_sad_csv/metadata_mapping_abreviation_colonne_inventaire_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_abreviation_colonne_inventaire_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_abreviation_unresolved_sources | volume documentaire : 5 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_abreviation_unresolved_sources' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_abreviation_unresolved_sources";
-- SELECT 'metadata.mapping_abreviation_unresolved_sources' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_abreviation_unresolved_sources'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_abreviation_unresolved_sources") TO 'backups/abh_sad_csv/metadata_mapping_abreviation_unresolved_sources_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_abreviation_unresolved_sources_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_barrage | volume documentaire : 11 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_barrage' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_barrage";
-- SELECT 'metadata.mapping_barrage' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_barrage'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_barrage") TO 'backups/abh_sad_csv/metadata_mapping_barrage_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_barrage_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo | volume documentaire : 0 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo";
-- SELECT 'metadata.mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo") TO 'backups/abh_sad_csv/metadata_mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_nappe_unresolved_qualite_nappes | volume documentaire : 292 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_nappe_unresolved_qualite_nappes' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_nappe_unresolved_qualite_nappes";
-- SELECT 'metadata.mapping_nappe_unresolved_qualite_nappes' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_nappe_unresolved_qualite_nappes'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_nappe_unresolved_qualite_nappes") TO 'backups/abh_sad_csv/metadata_mapping_nappe_unresolved_qualite_nappes_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_nappe_unresolved_qualite_nappes_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_parametre_source | volume documentaire : 184 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_parametre_source' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_parametre_source";
-- SELECT 'metadata.mapping_parametre_source' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_parametre_source'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_parametre_source") TO 'backups/abh_sad_csv/metadata_mapping_parametre_source_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_parametre_source_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_parametre_source_orphans_audit | volume documentaire : 5 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_parametre_source_orphans_audit' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_parametre_source_orphans_audit";
-- SELECT 'metadata.mapping_parametre_source_orphans_audit' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_parametre_source_orphans_audit'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_parametre_source_orphans_audit") TO 'backups/abh_sad_csv/metadata_mapping_parametre_source_orphans_audit_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_parametre_source_orphans_audit_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_parametre_unresolved_legacy_qualite_riviere | volume documentaire : 39 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_parametre_unresolved_legacy_qualite_riviere' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_parametre_unresolved_legacy_qualite_riviere";
-- SELECT 'metadata.mapping_parametre_unresolved_legacy_qualite_riviere' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_parametre_unresolved_legacy_qualite_riviere'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_parametre_unresolved_legacy_qualite_riviere") TO 'backups/abh_sad_csv/metadata_mapping_parametre_unresolved_legacy_qualite_riviere_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_parametre_unresolved_legacy_qualite_riviere_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_parametre_unresolved_suivi_qualite_sebou | volume documentaire : 7 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_parametre_unresolved_suivi_qualite_sebou' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_parametre_unresolved_suivi_qualite_sebou";
-- SELECT 'metadata.mapping_parametre_unresolved_suivi_qualite_sebou' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_parametre_unresolved_suivi_qualite_sebou'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_parametre_unresolved_suivi_qualite_sebou") TO 'backups/abh_sad_csv/metadata_mapping_parametre_unresolved_suivi_qualite_sebou_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_parametre_unresolved_suivi_qualite_sebou_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_point_eau | volume documentaire : 46 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_point_eau' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_point_eau";
-- SELECT 'metadata.mapping_point_eau' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_point_eau'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_point_eau") TO 'backups/abh_sad_csv/metadata_mapping_point_eau_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_point_eau_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_point_eau_unresolved_nappe | volume documentaire : 22 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_point_eau_unresolved_nappe' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_point_eau_unresolved_nappe";
-- SELECT 'metadata.mapping_point_eau_unresolved_nappe' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_point_eau_unresolved_nappe'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_point_eau_unresolved_nappe") TO 'backups/abh_sad_csv/metadata_mapping_point_eau_unresolved_nappe_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_point_eau_unresolved_nappe_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_point_eau_unresolved_station | volume documentaire : 46 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_point_eau_unresolved_station' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_point_eau_unresolved_station";
-- SELECT 'metadata.mapping_point_eau_unresolved_station' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_point_eau_unresolved_station'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_point_eau_unresolved_station") TO 'backups/abh_sad_csv/metadata_mapping_point_eau_unresolved_station_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_point_eau_unresolved_station_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_profil_station | volume documentaire : 1980 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_profil_station' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_profil_station";
-- SELECT 'metadata.mapping_profil_station' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_profil_station'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_profil_station") TO 'backups/abh_sad_csv/metadata_mapping_profil_station_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_profil_station_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_profil_unresolved_nappe | volume documentaire : 1204 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_profil_unresolved_nappe' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_profil_unresolved_nappe";
-- SELECT 'metadata.mapping_profil_unresolved_nappe' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_profil_unresolved_nappe'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_profil_unresolved_nappe") TO 'backups/abh_sad_csv/metadata_mapping_profil_unresolved_nappe_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_profil_unresolved_nappe_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_profil_unresolved_station | volume documentaire : 0 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_profil_unresolved_station' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_profil_unresolved_station";
-- SELECT 'metadata.mapping_profil_unresolved_station' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_profil_unresolved_station'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_profil_unresolved_station") TO 'backups/abh_sad_csv/metadata_mapping_profil_unresolved_station_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_profil_unresolved_station_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_source | volume documentaire : 19 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_source' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_source";
-- SELECT 'metadata.mapping_source' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_source'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_source") TO 'backups/abh_sad_csv/metadata_mapping_source_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_source_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_station | volume documentaire : 390 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_station' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_station";
-- SELECT 'metadata.mapping_station' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_station'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_station") TO 'backups/abh_sad_csv/metadata_mapping_station_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_station_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_station_unresolved_precip_ann_max | volume documentaire : 0 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_station_unresolved_precip_ann_max' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_station_unresolved_precip_ann_max";
-- SELECT 'metadata.mapping_station_unresolved_precip_ann_max' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_station_unresolved_precip_ann_max'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_station_unresolved_precip_ann_max") TO 'backups/abh_sad_csv/metadata_mapping_station_unresolved_precip_ann_max_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_station_unresolved_precip_ann_max_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_station_unresolved_qualite_barrages | volume documentaire : 0 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_station_unresolved_qualite_barrages' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_station_unresolved_qualite_barrages";
-- SELECT 'metadata.mapping_station_unresolved_qualite_barrages' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_station_unresolved_qualite_barrages'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_station_unresolved_qualite_barrages") TO 'backups/abh_sad_csv/metadata_mapping_station_unresolved_qualite_barrages_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_station_unresolved_qualite_barrages_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_station_unresolved_qualite_nappes | volume documentaire : 0 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_station_unresolved_qualite_nappes' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_station_unresolved_qualite_nappes";
-- SELECT 'metadata.mapping_station_unresolved_qualite_nappes' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_station_unresolved_qualite_nappes'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_station_unresolved_qualite_nappes") TO 'backups/abh_sad_csv/metadata_mapping_station_unresolved_qualite_nappes_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_station_unresolved_qualite_nappes_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo | volume documentaire : 0 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_station_unresolved_suivi_qualite_brg_garde_hebdo";
-- SELECT 'metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_station_unresolved_suivi_qualite_brg_garde_hebdo") TO 'backups/abh_sad_csv/metadata_mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i | volume documentaire : 1 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i";
-- SELECT 'metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i") TO 'backups/abh_sad_csv/metadata_mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_step_ind | volume documentaire : 15 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_step_ind' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_step_ind";
-- SELECT 'metadata.mapping_step_ind' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_step_ind'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_step_ind") TO 'backups/abh_sad_csv/metadata_mapping_step_ind_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_step_ind_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_step_ind_unresolved_commune | volume documentaire : 0 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_step_ind_unresolved_commune' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_step_ind_unresolved_commune";
-- SELECT 'metadata.mapping_step_ind_unresolved_commune' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_step_ind_unresolved_commune'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_step_ind_unresolved_commune") TO 'backups/abh_sad_csv/metadata_mapping_step_ind_unresolved_commune_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_step_ind_unresolved_commune_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_stm | volume documentaire : 18 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_stm' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_stm";
-- SELECT 'metadata.mapping_stm' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_stm'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_stm") TO 'backups/abh_sad_csv/metadata_mapping_stm_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_stm_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mapping_stm_unresolved_commune | volume documentaire : 0 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.mapping_stm_unresolved_commune' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mapping_stm_unresolved_commune";
-- SELECT 'metadata.mapping_stm_unresolved_commune' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mapping_stm_unresolved_commune'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."mapping_stm_unresolved_commune") TO 'backups/abh_sad_csv/metadata_mapping_stm_unresolved_commune_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_mapping_stm_unresolved_commune_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.mv_refresh_status | volume documentaire : 13 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'metadata.mv_refresh_status' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."mv_refresh_status";
-- SELECT 'metadata.mv_refresh_status' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.mv_refresh_status'::regclass)) AS taille_totale;

-- Table : metadata.obs_parametre_coverage | volume documentaire : 16 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.obs_parametre_coverage' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."obs_parametre_coverage";
-- SELECT 'metadata.obs_parametre_coverage' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.obs_parametre_coverage'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."obs_parametre_coverage") TO 'backups/abh_sad_csv/metadata_obs_parametre_coverage_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_obs_parametre_coverage_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.obs_parametre_entite_compat | volume documentaire : 18 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.obs_parametre_entite_compat' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."obs_parametre_entite_compat";
-- SELECT 'metadata.obs_parametre_entite_compat' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.obs_parametre_entite_compat'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."obs_parametre_entite_compat") TO 'backups/abh_sad_csv/metadata_obs_parametre_entite_compat_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_obs_parametre_entite_compat_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.obs_referentiel_parametre | volume documentaire : 18 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.obs_referentiel_parametre' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."obs_referentiel_parametre";
-- SELECT 'metadata.obs_referentiel_parametre' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.obs_referentiel_parametre'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."obs_referentiel_parametre") TO 'backups/abh_sad_csv/metadata_obs_referentiel_parametre_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_obs_referentiel_parametre_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.popup_rules_config | volume documentaire : 11 | catégorie : KEEP_STRUCTURE_AND_DATA
-- SELECT 'metadata.popup_rules_config' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."popup_rules_config";
-- SELECT 'metadata.popup_rules_config' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.popup_rules_config'::regclass)) AS taille_totale;

-- Table : metadata.referentiel_abreviation_inventaire | volume documentaire : 13 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.referentiel_abreviation_inventaire' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."referentiel_abreviation_inventaire";
-- SELECT 'metadata.referentiel_abreviation_inventaire' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.referentiel_abreviation_inventaire'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."referentiel_abreviation_inventaire") TO 'backups/abh_sad_csv/metadata_referentiel_abreviation_inventaire_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_referentiel_abreviation_inventaire_YYYYMMDD_HHMM.csv SHA256

-- Table : metadata.referentiel_parametre | volume documentaire : 91 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'metadata.referentiel_parametre' AS table_name, COUNT(*) AS volume_lignes FROM "metadata"."referentiel_parametre";
-- SELECT 'metadata.referentiel_parametre' AS table_name, pg_size_pretty(pg_total_relation_size('metadata.referentiel_parametre'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "metadata"."referentiel_parametre") TO 'backups/abh_sad_csv/metadata_referentiel_parametre_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/metadata_referentiel_parametre_YYYYMMDD_HHMM.csv SHA256

-- Table : meteo.mesure_evaporation | volume documentaire : 48900 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'meteo.mesure_evaporation' AS table_name, COUNT(*) AS volume_lignes FROM "meteo"."mesure_evaporation";
-- SELECT 'meteo.mesure_evaporation' AS table_name, pg_size_pretty(pg_total_relation_size('meteo.mesure_evaporation'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "meteo"."mesure_evaporation") TO 'backups/abh_sad_csv/meteo_mesure_evaporation_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/meteo_mesure_evaporation_YYYYMMDD_HHMM.csv SHA256

-- Table : meteo.mesure_precipitation | volume documentaire : 546007 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'meteo.mesure_precipitation' AS table_name, COUNT(*) AS volume_lignes FROM "meteo"."mesure_precipitation";
-- SELECT 'meteo.mesure_precipitation' AS table_name, pg_size_pretty(pg_total_relation_size('meteo.mesure_precipitation'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "meteo"."mesure_precipitation") TO 'backups/abh_sad_csv/meteo_mesure_precipitation_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/meteo_mesure_precipitation_YYYYMMDD_HHMM.csv SHA256

-- Table : meteo.mesure_precipitation_annuelle_max | volume documentaire : 2085 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'meteo.mesure_precipitation_annuelle_max' AS table_name, COUNT(*) AS volume_lignes FROM "meteo"."mesure_precipitation_annuelle_max";
-- SELECT 'meteo.mesure_precipitation_annuelle_max' AS table_name, pg_size_pretty(pg_total_relation_size('meteo.mesure_precipitation_annuelle_max'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "meteo"."mesure_precipitation_annuelle_max") TO 'backups/abh_sad_csv/meteo_mesure_precipitation_annuelle_max_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/meteo_mesure_precipitation_annuelle_max_YYYYMMDD_HHMM.csv SHA256

-- Table : meteo.mesure_temperature | volume documentaire : 0 | catégorie : KEEP_STRUCTURE_ONLY
-- SELECT 'meteo.mesure_temperature' AS table_name, COUNT(*) AS volume_lignes FROM "meteo"."mesure_temperature";
-- SELECT 'meteo.mesure_temperature' AS table_name, pg_size_pretty(pg_total_relation_size('meteo.mesure_temperature'::regclass)) AS taille_totale;

-- Table : meteo.regle_qualite_evaporation_station | volume documentaire : 390 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'meteo.regle_qualite_evaporation_station' AS table_name, COUNT(*) AS volume_lignes FROM "meteo"."regle_qualite_evaporation_station";
-- SELECT 'meteo.regle_qualite_evaporation_station' AS table_name, pg_size_pretty(pg_total_relation_size('meteo.regle_qualite_evaporation_station'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "meteo"."regle_qualite_evaporation_station") TO 'backups/abh_sad_csv/meteo_regle_qualite_evaporation_station_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/meteo_regle_qualite_evaporation_station_YYYYMMDD_HHMM.csv SHA256

-- Table : modeles.resultat_swat | volume documentaire : 0 | catégorie : KEEP_STRUCTURE_ONLY
-- SELECT 'modeles.resultat_swat' AS table_name, COUNT(*) AS volume_lignes FROM "modeles"."resultat_swat";
-- SELECT 'modeles.resultat_swat' AS table_name, pg_size_pretty(pg_total_relation_size('modeles.resultat_swat'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "modeles"."resultat_swat") TO 'backups/abh_sad_csv/modeles_resultat_swat_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/modeles_resultat_swat_YYYYMMDD_HHMM.csv SHA256

-- Table : modeles.resultat_wasp | volume documentaire : 0 | catégorie : KEEP_STRUCTURE_ONLY
-- SELECT 'modeles.resultat_wasp' AS table_name, COUNT(*) AS volume_lignes FROM "modeles"."resultat_wasp";
-- SELECT 'modeles.resultat_wasp' AS table_name, pg_size_pretty(pg_total_relation_size('modeles.resultat_wasp'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "modeles"."resultat_wasp") TO 'backups/abh_sad_csv/modeles_resultat_wasp_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/modeles_resultat_wasp_YYYYMMDD_HHMM.csv SHA256

-- Table : modeles.scenario_simulation | volume documentaire : 0 | catégorie : KEEP_STRUCTURE_ONLY
-- SELECT 'modeles.scenario_simulation' AS table_name, COUNT(*) AS volume_lignes FROM "modeles"."scenario_simulation";
-- SELECT 'modeles.scenario_simulation' AS table_name, pg_size_pretty(pg_total_relation_size('modeles.scenario_simulation'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "modeles"."scenario_simulation") TO 'backups/abh_sad_csv/modeles_scenario_simulation_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/modeles_scenario_simulation_YYYYMMDD_HHMM.csv SHA256

-- Table : qualite.mesure_qualite_barrage | volume documentaire : 15808 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'qualite.mesure_qualite_barrage' AS table_name, COUNT(*) AS volume_lignes FROM "qualite"."mesure_qualite_barrage";
-- SELECT 'qualite.mesure_qualite_barrage' AS table_name, pg_size_pretty(pg_total_relation_size('qualite.mesure_qualite_barrage'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "qualite"."mesure_qualite_barrage") TO 'backups/abh_sad_csv/qualite_mesure_qualite_barrage_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/qualite_mesure_qualite_barrage_YYYYMMDD_HHMM.csv SHA256

-- Table : qualite.mesure_qualite_nappe | volume documentaire : 63088 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'qualite.mesure_qualite_nappe' AS table_name, COUNT(*) AS volume_lignes FROM "qualite"."mesure_qualite_nappe";
-- SELECT 'qualite.mesure_qualite_nappe' AS table_name, pg_size_pretty(pg_total_relation_size('qualite.mesure_qualite_nappe'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "qualite"."mesure_qualite_nappe") TO 'backups/abh_sad_csv/qualite_mesure_qualite_nappe_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/qualite_mesure_qualite_nappe_YYYYMMDD_HHMM.csv SHA256

-- Table : qualite.mesure_qualite_riviere | volume documentaire : 60097 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'qualite.mesure_qualite_riviere' AS table_name, COUNT(*) AS volume_lignes FROM "qualite"."mesure_qualite_riviere";
-- SELECT 'qualite.mesure_qualite_riviere' AS table_name, pg_size_pretty(pg_total_relation_size('qualite.mesure_qualite_riviere'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "qualite"."mesure_qualite_riviere") TO 'backups/abh_sad_csv/qualite_mesure_qualite_riviere_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/qualite_mesure_qualite_riviere_YYYYMMDD_HHMM.csv SHA256

-- Table : qualite.mesure_qualite_sebou | volume documentaire : 51402 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'qualite.mesure_qualite_sebou' AS table_name, COUNT(*) AS volume_lignes FROM "qualite"."mesure_qualite_sebou";
-- SELECT 'qualite.mesure_qualite_sebou' AS table_name, pg_size_pretty(pg_total_relation_size('qualite.mesure_qualite_sebou'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "qualite"."mesure_qualite_sebou") TO 'backups/abh_sad_csv/qualite_mesure_qualite_sebou_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/qualite_mesure_qualite_sebou_YYYYMMDD_HHMM.csv SHA256

-- Table : qualite.source_pollution_mesure_param | volume documentaire : 7191 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'qualite.source_pollution_mesure_param' AS table_name, COUNT(*) AS volume_lignes FROM "qualite"."source_pollution_mesure_param";
-- SELECT 'qualite.source_pollution_mesure_param' AS table_name, pg_size_pretty(pg_total_relation_size('qualite.source_pollution_mesure_param'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "qualite"."source_pollution_mesure_param") TO 'backups/abh_sad_csv/qualite_source_pollution_mesure_param_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/qualite_source_pollution_mesure_param_YYYYMMDD_HHMM.csv SHA256

-- Table : qualite.source_pollution_prelevement | volume documentaire : 141 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'qualite.source_pollution_prelevement' AS table_name, COUNT(*) AS volume_lignes FROM "qualite"."source_pollution_prelevement";
-- SELECT 'qualite.source_pollution_prelevement' AS table_name, pg_size_pretty(pg_total_relation_size('qualite.source_pollution_prelevement'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "qualite"."source_pollution_prelevement") TO 'backups/abh_sad_csv/qualite_source_pollution_prelevement_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/qualite_source_pollution_prelevement_YYYYMMDD_HHMM.csv SHA256

-- Table : qualite.source_pollution_prelevement_lien | volume documentaire : 116 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'qualite.source_pollution_prelevement_lien' AS table_name, COUNT(*) AS volume_lignes FROM "qualite"."source_pollution_prelevement_lien";
-- SELECT 'qualite.source_pollution_prelevement_lien' AS table_name, pg_size_pretty(pg_total_relation_size('qualite.source_pollution_prelevement_lien'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "qualite"."source_pollution_prelevement_lien") TO 'backups/abh_sad_csv/qualite_source_pollution_prelevement_lien_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/qualite_source_pollution_prelevement_lien_YYYYMMDD_HHMM.csv SHA256

-- Table : qualite.suivi_qualite_barrage_garde_hebdo | volume documentaire : 7094 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'qualite.suivi_qualite_barrage_garde_hebdo' AS table_name, COUNT(*) AS volume_lignes FROM "qualite"."suivi_qualite_barrage_garde_hebdo";
-- SELECT 'qualite.suivi_qualite_barrage_garde_hebdo' AS table_name, pg_size_pretty(pg_total_relation_size('qualite.suivi_qualite_barrage_garde_hebdo'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "qualite"."suivi_qualite_barrage_garde_hebdo") TO 'backups/abh_sad_csv/qualite_suivi_qualite_barrage_garde_hebdo_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/qualite_suivi_qualite_barrage_garde_hebdo_YYYYMMDD_HHMM.csv SHA256

-- Table : staging._legacy_qualite_riviere | volume documentaire : 60097 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging._legacy_qualite_riviere' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."_legacy_qualite_riviere";
-- SELECT 'staging._legacy_qualite_riviere' AS table_name, pg_size_pretty(pg_total_relation_size('staging._legacy_qualite_riviere'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."_legacy_qualite_riviere") TO 'backups/abh_sad_csv/staging__legacy_qualite_riviere_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging__legacy_qualite_riviere_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.decharges | volume documentaire : 139 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.decharges' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."decharges";
-- SELECT 'staging.decharges' AS table_name, pg_size_pretty(pg_total_relation_size('staging.decharges'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."decharges") TO 'backups/abh_sad_csv/staging_decharges_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_decharges_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.decharges_Abondonees | volume documentaire : 11 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.decharges_Abondonees' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."decharges_Abondonees";
-- SELECT 'staging.decharges_Abondonees' AS table_name, pg_size_pretty(pg_total_relation_size('staging.decharges_Abondonees'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."decharges_Abondonees") TO 'backups/abh_sad_csv/staging_decharges_Abondonees_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_decharges_Abondonees_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.huileries | volume documentaire : 606 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.huileries' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."huileries";
-- SELECT 'staging.huileries' AS table_name, pg_size_pretty(pg_total_relation_size('staging.huileries'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."huileries") TO 'backups/abh_sad_csv/staging_huileries_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_huileries_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesure_precipitation_old_model | volume documentaire : 507930 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesure_precipitation_old_model' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesure_precipitation_old_model";
-- SELECT 'staging.mesure_precipitation_old_model' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesure_precipitation_old_model'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesure_precipitation_old_model") TO 'backups/abh_sad_csv/staging_mesure_precipitation_old_model_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesure_precipitation_old_model_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_debit_jr | volume documentaire : 173251 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_debit_jr' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_debit_jr";
-- SELECT 'staging.mesures_debit_jr' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_debit_jr'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_debit_jr") TO 'backups/abh_sad_csv/staging_mesures_debit_jr_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_debit_jr_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_debit_m | volume documentaire : 19316 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_debit_m' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_debit_m";
-- SELECT 'staging.mesures_debit_m' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_debit_m'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_debit_m") TO 'backups/abh_sad_csv/staging_mesures_debit_m_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_debit_m_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_debit_sources | volume documentaire : 2816 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_debit_sources' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_debit_sources";
-- SELECT 'staging.mesures_debit_sources' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_debit_sources'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_debit_sources") TO 'backups/abh_sad_csv/staging_mesures_debit_sources_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_debit_sources_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_evaporation_jr | volume documentaire : 48900 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_evaporation_jr' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_evaporation_jr";
-- SELECT 'staging.mesures_evaporation_jr' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_evaporation_jr'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_evaporation_jr") TO 'backups/abh_sad_csv/staging_mesures_evaporation_jr_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_evaporation_jr_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_niv_eau_barrages | volume documentaire : 85166 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_niv_eau_barrages' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_niv_eau_barrages";
-- SELECT 'staging.mesures_niv_eau_barrages' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_niv_eau_barrages'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_niv_eau_barrages") TO 'backups/abh_sad_csv/staging_mesures_niv_eau_barrages_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_niv_eau_barrages_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_precip | volume documentaire : 669880 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_precip' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_precip";
-- SELECT 'staging.mesures_precip' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_precip'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_precip") TO 'backups/abh_sad_csv/staging_mesures_precip_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_precip_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_precipitations_jr_max | volume documentaire : 2085 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_precipitations_jr_max' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_precipitations_jr_max";
-- SELECT 'staging.mesures_precipitations_jr_max' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_precipitations_jr_max'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_precipitations_jr_max") TO 'backups/abh_sad_csv/staging_mesures_precipitations_jr_max_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_precipitations_jr_max_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_precipitations_jr_traitees | volume documentaire : 546007 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_precipitations_jr_traitees' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_precipitations_jr_traitees";
-- SELECT 'staging.mesures_precipitations_jr_traitees' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_precipitations_jr_traitees'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_precipitations_jr_traitees") TO 'backups/abh_sad_csv/staging_mesures_precipitations_jr_traitees_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_precipitations_jr_traitees_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_qualite_barrages | volume documentaire : 8714 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_qualite_barrages' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_qualite_barrages";
-- SELECT 'staging.mesures_qualite_barrages' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_qualite_barrages'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_qualite_barrages") TO 'backups/abh_sad_csv/staging_mesures_qualite_barrages_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_qualite_barrages_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mesures_qualite_nappes | volume documentaire : 63088 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mesures_qualite_nappes' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mesures_qualite_nappes";
-- SELECT 'staging.mesures_qualite_nappes' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mesures_qualite_nappes'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mesures_qualite_nappes") TO 'backups/abh_sad_csv/staging_mesures_qualite_nappes_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mesures_qualite_nappes_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.mines | volume documentaire : 39 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.mines' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."mines";
-- SELECT 'staging.mines' AS table_name, pg_size_pretty(pg_total_relation_size('staging.mines'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."mines") TO 'backups/abh_sad_csv/staging_mines_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_mines_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.points_eau_abhs | volume documentaire : 46 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.points_eau_abhs' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."points_eau_abhs";
-- SELECT 'staging.points_eau_abhs' AS table_name, pg_size_pretty(pg_total_relation_size('staging.points_eau_abhs'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."points_eau_abhs") TO 'backups/abh_sad_csv/staging_points_eau_abhs_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_points_eau_abhs_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.profils_stations | volume documentaire : 1980 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.profils_stations' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."profils_stations";
-- SELECT 'staging.profils_stations' AS table_name, pg_size_pretty(pg_total_relation_size('staging.profils_stations'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."profils_stations") TO 'backups/abh_sad_csv/staging_profils_stations_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_profils_stations_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.rejet_abattoir | volume documentaire : 56 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.rejet_abattoir' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."rejet_abattoir";
-- SELECT 'staging.rejet_abattoir' AS table_name, pg_size_pretty(pg_total_relation_size('staging.rejet_abattoir'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."rejet_abattoir") TO 'backups/abh_sad_csv/staging_rejet_abattoir_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_rejet_abattoir_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.rejets_brutes | volume documentaire : 277 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.rejets_brutes' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."rejets_brutes";
-- SELECT 'staging.rejets_brutes' AS table_name, pg_size_pretty(pg_total_relation_size('staging.rejets_brutes'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."rejets_brutes") TO 'backups/abh_sad_csv/staging_rejets_brutes_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_rejets_brutes_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.sources_polution_mesure | volume documentaire : 141 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.sources_polution_mesure' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."sources_polution_mesure";
-- SELECT 'staging.sources_polution_mesure' AS table_name, pg_size_pretty(pg_total_relation_size('staging.sources_polution_mesure'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."sources_polution_mesure") TO 'backups/abh_sad_csv/staging_sources_polution_mesure_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_sources_polution_mesure_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.sous_bassin_swat_bas_sebou_new | volume documentaire : 29 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.sous_bassin_swat_bas_sebou_new' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."sous_bassin_swat_bas_sebou_new";
-- SELECT 'staging.sous_bassin_swat_bas_sebou_new' AS table_name, pg_size_pretty(pg_total_relation_size('staging.sous_bassin_swat_bas_sebou_new'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."sous_bassin_swat_bas_sebou_new") TO 'backups/abh_sad_csv/staging_sous_bassin_swat_bas_sebou_new_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_sous_bassin_swat_bas_sebou_new_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.sous_bassin_swat_bassin_cotier_new | volume documentaire : 23 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.sous_bassin_swat_bassin_cotier_new' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."sous_bassin_swat_bassin_cotier_new";
-- SELECT 'staging.sous_bassin_swat_bassin_cotier_new' AS table_name, pg_size_pretty(pg_total_relation_size('staging.sous_bassin_swat_bassin_cotier_new'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."sous_bassin_swat_bassin_cotier_new") TO 'backups/abh_sad_csv/staging_sous_bassin_swat_bassin_cotier_new_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_sous_bassin_swat_bassin_cotier_new_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.sous_bassin_swat_beht_new | volume documentaire : 27 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.sous_bassin_swat_beht_new' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."sous_bassin_swat_beht_new";
-- SELECT 'staging.sous_bassin_swat_beht_new' AS table_name, pg_size_pretty(pg_total_relation_size('staging.sous_bassin_swat_beht_new'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."sous_bassin_swat_beht_new") TO 'backups/abh_sad_csv/staging_sous_bassin_swat_beht_new_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_sous_bassin_swat_beht_new_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.sous_bassin_swat_haut_sebou_new | volume documentaire : 22 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.sous_bassin_swat_haut_sebou_new' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."sous_bassin_swat_haut_sebou_new";
-- SELECT 'staging.sous_bassin_swat_haut_sebou_new' AS table_name, pg_size_pretty(pg_total_relation_size('staging.sous_bassin_swat_haut_sebou_new'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."sous_bassin_swat_haut_sebou_new") TO 'backups/abh_sad_csv/staging_sous_bassin_swat_haut_sebou_new_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_sous_bassin_swat_haut_sebou_new_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.sous_bassin_swat_leben_innaouen_new | volume documentaire : 18 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.sous_bassin_swat_leben_innaouen_new' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."sous_bassin_swat_leben_innaouen_new";
-- SELECT 'staging.sous_bassin_swat_leben_innaouen_new' AS table_name, pg_size_pretty(pg_total_relation_size('staging.sous_bassin_swat_leben_innaouen_new'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."sous_bassin_swat_leben_innaouen_new") TO 'backups/abh_sad_csv/staging_sous_bassin_swat_leben_innaouen_new_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_sous_bassin_swat_leben_innaouen_new_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.sous_bassin_swat_moyen_sebou_new | volume documentaire : 16 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.sous_bassin_swat_moyen_sebou_new' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."sous_bassin_swat_moyen_sebou_new";
-- SELECT 'staging.sous_bassin_swat_moyen_sebou_new' AS table_name, pg_size_pretty(pg_total_relation_size('staging.sous_bassin_swat_moyen_sebou_new'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."sous_bassin_swat_moyen_sebou_new") TO 'backups/abh_sad_csv/staging_sous_bassin_swat_moyen_sebou_new_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_sous_bassin_swat_moyen_sebou_new_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.sous_bassin_swat_ouergha_new | volume documentaire : 39 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.sous_bassin_swat_ouergha_new' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."sous_bassin_swat_ouergha_new";
-- SELECT 'staging.sous_bassin_swat_ouergha_new' AS table_name, pg_size_pretty(pg_total_relation_size('staging.sous_bassin_swat_ouergha_new'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."sous_bassin_swat_ouergha_new") TO 'backups/abh_sad_csv/staging_sous_bassin_swat_ouergha_new_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_sous_bassin_swat_ouergha_new_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.step_ind_abhs | volume documentaire : 15 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.step_ind_abhs' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."step_ind_abhs";
-- SELECT 'staging.step_ind_abhs' AS table_name, pg_size_pretty(pg_total_relation_size('staging.step_ind_abhs'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."step_ind_abhs") TO 'backups/abh_sad_csv/staging_step_ind_abhs_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_step_ind_abhs_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.steps | volume documentaire : 49 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.steps' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."steps";
-- SELECT 'staging.steps' AS table_name, pg_size_pretty(pg_total_relation_size('staging.steps'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."steps") TO 'backups/abh_sad_csv/staging_steps_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_steps_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.steps_industrielles | volume documentaire : 14 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.steps_industrielles' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."steps_industrielles";
-- SELECT 'staging.steps_industrielles' AS table_name, pg_size_pretty(pg_total_relation_size('staging.steps_industrielles'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."steps_industrielles") TO 'backups/abh_sad_csv/staging_steps_industrielles_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_steps_industrielles_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.stm_abhs | volume documentaire : 18 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.stm_abhs' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."stm_abhs";
-- SELECT 'staging.stm_abhs' AS table_name, pg_size_pretty(pg_total_relation_size('staging.stm_abhs'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."stm_abhs") TO 'backups/abh_sad_csv/staging_stm_abhs_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_stm_abhs_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.stms | volume documentaire : 19 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.stms' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."stms";
-- SELECT 'staging.stms' AS table_name, pg_size_pretty(pg_total_relation_size('staging.stms'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."stms") TO 'backups/abh_sad_csv/staging_stms_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_stms_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.suivi_qualite_brg_garde_hebdo | volume documentaire : 7094 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.suivi_qualite_brg_garde_hebdo' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."suivi_qualite_brg_garde_hebdo";
-- SELECT 'staging.suivi_qualite_brg_garde_hebdo' AS table_name, pg_size_pretty(pg_total_relation_size('staging.suivi_qualite_brg_garde_hebdo'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."suivi_qualite_brg_garde_hebdo") TO 'backups/abh_sad_csv/staging_suivi_qualite_brg_garde_hebdo_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_suivi_qualite_brg_garde_hebdo_YYYYMMDD_HHMM.csv SHA256

-- Table : staging.suivi_qualite_sebou | volume documentaire : 51402 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'staging.suivi_qualite_sebou' AS table_name, COUNT(*) AS volume_lignes FROM "staging"."suivi_qualite_sebou";
-- SELECT 'staging.suivi_qualite_sebou' AS table_name, pg_size_pretty(pg_total_relation_size('staging.suivi_qualite_sebou'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "staging"."suivi_qualite_sebou") TO 'backups/abh_sad_csv/staging_suivi_qualite_sebou_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/staging_suivi_qualite_sebou_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_output.mesure_qualite_subbasin_ts | volume documentaire : 745110 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_output.mesure_qualite_subbasin_ts' AS table_name, COUNT(*) AS volume_lignes FROM "swat_output"."mesure_qualite_subbasin_ts";
-- SELECT 'swat_output.mesure_qualite_subbasin_ts' AS table_name, pg_size_pretty(pg_total_relation_size('swat_output.mesure_qualite_subbasin_ts'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_output"."mesure_qualite_subbasin_ts") TO 'backups/abh_sad_csv/swat_output_mesure_qualite_subbasin_ts_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_output_mesure_qualite_subbasin_ts_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_output.ref_bassin | volume documentaire : 1 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_output.ref_bassin' AS table_name, COUNT(*) AS volume_lignes FROM "swat_output"."ref_bassin";
-- SELECT 'swat_output.ref_bassin' AS table_name, pg_size_pretty(pg_total_relation_size('swat_output.ref_bassin'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_output"."ref_bassin") TO 'backups/abh_sad_csv/swat_output_ref_bassin_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_output_ref_bassin_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_output.ref_parametre_qualite | volume documentaire : 5 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_output.ref_parametre_qualite' AS table_name, COUNT(*) AS volume_lignes FROM "swat_output"."ref_parametre_qualite";
-- SELECT 'swat_output.ref_parametre_qualite' AS table_name, pg_size_pretty(pg_total_relation_size('swat_output.ref_parametre_qualite'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_output"."ref_parametre_qualite") TO 'backups/abh_sad_csv/swat_output_ref_parametre_qualite_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_output_ref_parametre_qualite_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_output.ref_run_modele | volume documentaire : 1 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_output.ref_run_modele' AS table_name, COUNT(*) AS volume_lignes FROM "swat_output"."ref_run_modele";
-- SELECT 'swat_output.ref_run_modele' AS table_name, pg_size_pretty(pg_total_relation_size('swat_output.ref_run_modele'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_output"."ref_run_modele") TO 'backups/abh_sad_csv/swat_output_ref_run_modele_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_output_ref_run_modele_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_output.ref_scenario | volume documentaire : 1 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_output.ref_scenario' AS table_name, COUNT(*) AS volume_lignes FROM "swat_output"."ref_scenario";
-- SELECT 'swat_output.ref_scenario' AS table_name, pg_size_pretty(pg_total_relation_size('swat_output.ref_scenario'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_output"."ref_scenario") TO 'backups/abh_sad_csv/swat_output_ref_scenario_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_output_ref_scenario_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_output.ref_subbasin | volume documentaire : 18 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_output.ref_subbasin' AS table_name, COUNT(*) AS volume_lignes FROM "swat_output"."ref_subbasin";
-- SELECT 'swat_output.ref_subbasin' AS table_name, pg_size_pretty(pg_total_relation_size('swat_output.ref_subbasin'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_output"."ref_subbasin") TO 'backups/abh_sad_csv/swat_output_ref_subbasin_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_output_ref_subbasin_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_output.stg_swat_qualite_long | volume documentaire : 745110 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_output.stg_swat_qualite_long' AS table_name, COUNT(*) AS volume_lignes FROM "swat_output"."stg_swat_qualite_long";
-- SELECT 'swat_output.stg_swat_qualite_long' AS table_name, pg_size_pretty(pg_total_relation_size('swat_output.stg_swat_qualite_long'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_output"."stg_swat_qualite_long") TO 'backups/abh_sad_csv/swat_output_stg_swat_qualite_long_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_output_stg_swat_qualite_long_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_output.stg_swat_qualite_meta | volume documentaire : 123 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_output.stg_swat_qualite_meta' AS table_name, COUNT(*) AS volume_lignes FROM "swat_output"."stg_swat_qualite_meta";
-- SELECT 'swat_output.stg_swat_qualite_meta' AS table_name, pg_size_pretty(pg_total_relation_size('swat_output.stg_swat_qualite_meta'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_output"."stg_swat_qualite_meta") TO 'backups/abh_sad_csv/swat_output_stg_swat_qualite_meta_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_output_stg_swat_qualite_meta_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_sebou.swat_models | volume documentaire : 0 | catégorie : KEEP_STRUCTURE_ONLY
-- SELECT 'swat_sebou.swat_models' AS table_name, COUNT(*) AS volume_lignes FROM "swat_sebou"."swat_models";
-- SELECT 'swat_sebou.swat_models' AS table_name, pg_size_pretty(pg_total_relation_size('swat_sebou.swat_models'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_sebou"."swat_models") TO 'backups/abh_sad_csv/swat_sebou_swat_models_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_sebou_swat_models_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_sebou.swat_reach_results | volume documentaire : 0 | catégorie : KEEP_STRUCTURE_ONLY
-- SELECT 'swat_sebou.swat_reach_results' AS table_name, COUNT(*) AS volume_lignes FROM "swat_sebou"."swat_reach_results";
-- SELECT 'swat_sebou.swat_reach_results' AS table_name, pg_size_pretty(pg_total_relation_size('swat_sebou.swat_reach_results'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_sebou"."swat_reach_results") TO 'backups/abh_sad_csv/swat_sebou_swat_reach_results_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_sebou_swat_reach_results_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_sebou.swat_scenarios | volume documentaire : 1 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'swat_sebou.swat_scenarios' AS table_name, COUNT(*) AS volume_lignes FROM "swat_sebou"."swat_scenarios";
-- SELECT 'swat_sebou.swat_scenarios' AS table_name, pg_size_pretty(pg_total_relation_size('swat_sebou.swat_scenarios'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_sebou"."swat_scenarios") TO 'backups/abh_sad_csv/swat_sebou_swat_scenarios_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_sebou_swat_scenarios_YYYYMMDD_HHMM.csv SHA256

-- Table : swat_sebou.swat_subbasin_results | volume documentaire : 0 | catégorie : KEEP_STRUCTURE_ONLY
-- SELECT 'swat_sebou.swat_subbasin_results' AS table_name, COUNT(*) AS volume_lignes FROM "swat_sebou"."swat_subbasin_results";
-- SELECT 'swat_sebou.swat_subbasin_results' AS table_name, pg_size_pretty(pg_total_relation_size('swat_sebou.swat_subbasin_results'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "swat_sebou"."swat_subbasin_results") TO 'backups/abh_sad_csv/swat_sebou_swat_subbasin_results_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/swat_sebou_swat_subbasin_results_YYYYMMDD_HHMM.csv SHA256

-- Table : wasp_output.mesure_qualite_segment_ts | volume documentaire : 931770 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'wasp_output.mesure_qualite_segment_ts' AS table_name, COUNT(*) AS volume_lignes FROM "wasp_output"."mesure_qualite_segment_ts";
-- SELECT 'wasp_output.mesure_qualite_segment_ts' AS table_name, pg_size_pretty(pg_total_relation_size('wasp_output.mesure_qualite_segment_ts'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "wasp_output"."mesure_qualite_segment_ts") TO 'backups/abh_sad_csv/wasp_output_mesure_qualite_segment_ts_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/wasp_output_mesure_qualite_segment_ts_YYYYMMDD_HHMM.csv SHA256

-- Table : wasp_output.ref_parametre_qualite | volume documentaire : 12 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'wasp_output.ref_parametre_qualite' AS table_name, COUNT(*) AS volume_lignes FROM "wasp_output"."ref_parametre_qualite";
-- SELECT 'wasp_output.ref_parametre_qualite' AS table_name, pg_size_pretty(pg_total_relation_size('wasp_output.ref_parametre_qualite'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "wasp_output"."ref_parametre_qualite") TO 'backups/abh_sad_csv/wasp_output_ref_parametre_qualite_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/wasp_output_ref_parametre_qualite_YYYYMMDD_HHMM.csv SHA256

-- Table : wasp_output.ref_run_modele | volume documentaire : 1 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'wasp_output.ref_run_modele' AS table_name, COUNT(*) AS volume_lignes FROM "wasp_output"."ref_run_modele";
-- SELECT 'wasp_output.ref_run_modele' AS table_name, pg_size_pretty(pg_total_relation_size('wasp_output.ref_run_modele'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "wasp_output"."ref_run_modele") TO 'backups/abh_sad_csv/wasp_output_ref_run_modele_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/wasp_output_ref_run_modele_YYYYMMDD_HHMM.csv SHA256

-- Table : wasp_output.ref_segment_modele | volume documentaire : 22 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'wasp_output.ref_segment_modele' AS table_name, COUNT(*) AS volume_lignes FROM "wasp_output"."ref_segment_modele";
-- SELECT 'wasp_output.ref_segment_modele' AS table_name, pg_size_pretty(pg_total_relation_size('wasp_output.ref_segment_modele'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "wasp_output"."ref_segment_modele") TO 'backups/abh_sad_csv/wasp_output_ref_segment_modele_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/wasp_output_ref_segment_modele_YYYYMMDD_HHMM.csv SHA256

-- Table : wasp_output.stg_wasp_qualite_long | volume documentaire : 931770 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'wasp_output.stg_wasp_qualite_long' AS table_name, COUNT(*) AS volume_lignes FROM "wasp_output"."stg_wasp_qualite_long";
-- SELECT 'wasp_output.stg_wasp_qualite_long' AS table_name, pg_size_pretty(pg_total_relation_size('wasp_output.stg_wasp_qualite_long'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "wasp_output"."stg_wasp_qualite_long") TO 'backups/abh_sad_csv/wasp_output_stg_wasp_qualite_long_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/wasp_output_stg_wasp_qualite_long_YYYYMMDD_HHMM.csv SHA256

-- Table : wasp_sebou.wasp_results | volume documentaire : 931770 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'wasp_sebou.wasp_results' AS table_name, COUNT(*) AS volume_lignes FROM "wasp_sebou"."wasp_results";
-- SELECT 'wasp_sebou.wasp_results' AS table_name, pg_size_pretty(pg_total_relation_size('wasp_sebou.wasp_results'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "wasp_sebou"."wasp_results") TO 'backups/abh_sad_csv/wasp_sebou_wasp_results_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/wasp_sebou_wasp_results_YYYYMMDD_HHMM.csv SHA256

-- Table : wasp_sebou.wasp_scenarios | volume documentaire : 1 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'wasp_sebou.wasp_scenarios' AS table_name, COUNT(*) AS volume_lignes FROM "wasp_sebou"."wasp_scenarios";
-- SELECT 'wasp_sebou.wasp_scenarios' AS table_name, pg_size_pretty(pg_total_relation_size('wasp_sebou.wasp_scenarios'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "wasp_sebou"."wasp_scenarios") TO 'backups/abh_sad_csv/wasp_sebou_wasp_scenarios_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/wasp_sebou_wasp_scenarios_YYYYMMDD_HHMM.csv SHA256

-- Table : wasp_sebou.wasp_variables | volume documentaire : 12 | catégorie : TO_BACKUP_AND_EMPTY
-- SELECT 'wasp_sebou.wasp_variables' AS table_name, COUNT(*) AS volume_lignes FROM "wasp_sebou"."wasp_variables";
-- SELECT 'wasp_sebou.wasp_variables' AS table_name, pg_size_pretty(pg_total_relation_size('wasp_sebou.wasp_variables'::regclass)) AS taille_totale;
-- \copy (SELECT * FROM "wasp_sebou"."wasp_variables") TO 'backups/abh_sad_csv/wasp_sebou_wasp_variables_YYYYMMDD_HHMM.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- certutil -hashfile backups/abh_sad_csv/wasp_sebou_wasp_variables_YYYYMMDD_HHMM.csv SHA256
