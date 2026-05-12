# Tables abh_sad à vider ou conserver

## Principe
`abh_sad` est traitée comme base cible à reconstruire. Les structures utiles peuvent être conservées, mais les données instables doivent être sauvegardées puis vidées uniquement après validation humaine.

## Synthèse
| Catégorie | Nombre |
|---|---:|
| À archiver avant vidage | 117 |
| À conserver structure + données | 13 |
| À conserver structure mais vider données | 8 |
| À ne pas toucher | 34 |

## Tableau de décision
| Schéma | Table | Volume | Catégorie | Action proposée | Justification | Validation |
|---|---|---:|---|---|---|---|
| `admin` | `cercle` | 61 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `admin` | `communes` | 346 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `admin` | `localite` | 6013 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `admin` | `provinces` | 21 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `admin` | `regions` | 6 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `audit` | `ingestion_audit_logs` | 14 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `_bak_sous_bassin_swat_leben_innaouen_20260403` | 18 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `bassin_versant` | 1 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `nappe` | 17 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `reseau_hydrographique` | 697 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `source` | 135 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `sous_bassin_abh` | 15 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `sous_bassin_swat_bas_sebou` | 29 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `sous_bassin_swat_bassin_cotier` | 23 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `sous_bassin_swat_beht` | 27 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `sous_bassin_swat_haut_sebou` | 22 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `sous_bassin_swat_leben_innaouen` | 18 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `sous_bassin_swat_moyen_sebou` | 16 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `geo` | `sous_bassin_swat_ouergha` | 39 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `hydro` | `barrage_bathymetrie` | 62359 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `hydro` | `mesure_barrage` | 84831 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `hydro` | `mesure_debit` | 521433 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `hydro` | `mesure_debit_mensuel` | 19316 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `hydro` | `mesure_debit_source` | 2816 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `hydro` | `regle_qualite_debit_source` | 19 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `hydro` | `regle_qualite_debit_station` | 390 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `infra` | `barrages` | 34 | À conserver structure + données | Conserver jusqu’à validation référentiel | Référentiels et géométries utilisés par l’application. | PENDING |
| `infra` | `decharge` | 233 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `decharge_inventaire_pollution` | 11 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `decharge_inventaire_pollution_general` | 139 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `fosses_septiques_abhs` | 20 | À conserver structure + données | Conserver jusqu’à validation référentiel | Référentiels et géométries utilisés par l’application. | PENDING |
| `infra` | `huilerie` | 612 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `huilerie_inventaire_pollution` | 606 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `mine` | 42 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `mine_inventaire_pollution` | 39 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `point_eau` | 46 | À conserver structure + données | Conserver jusqu’à validation référentiel | Référentiels et géométries utilisés par l’application. | PENDING |
| `infra` | `profil_station` | 1980 | À conserver structure + données | Conserver jusqu’à validation référentiel | Référentiels et géométries utilisés par l’application. | PENDING |
| `infra` | `rejet_abattoir` | 61 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `rejet_abattoir_inventaire_pollution` | 56 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `rejet_domestique` | 362 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `rejet_industriel` | 11 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `rejet_inventaire_pollution` | 277 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `stations` | 390 | À conserver structure + données | Conserver jusqu’à validation référentiel | Référentiels et géométries utilisés par l’application. | PENDING |
| `infra` | `stations_mesure` | 390 | À conserver structure + données | Conserver jusqu’à validation référentiel | Référentiels et géométries utilisés par l’application. | PENDING |
| `infra` | `step` | 41 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `step_industrielle` | 15 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `step_inventaire_pollution` | 49 | À archiver avant vidage | Backup puis validation référentiel pollution | Référentiel pollution potentiellement issu de migration précédente. | PENDING |
| `infra` | `stm` | 18 | À conserver structure + données | Conserver jusqu’à validation référentiel | Référentiels et géométries utilisés par l’application. | PENDING |
| `metadata` | `api_view_catalog` | 57 | À conserver structure + données | Conserver | Configuration technique ou catalogue applicatif à préserver. | PENDING |
| `metadata` | `api_view_column_catalog` | 1101 | À conserver structure + données | Conserver | Configuration technique ou catalogue applicatif à préserver. | PENDING |
| `metadata` | `catalogue_type_mesure` | 64 | À conserver structure + données | Conserver | Configuration technique ou catalogue applicatif à préserver. | PENDING |
| `metadata` | `dictionnaire_donnees` | 0 | À conserver structure + données | Conserver | Configuration technique ou catalogue applicatif à préserver. | PENDING |
| `metadata` | `mapping_abreviation_colonne_inventaire` | 13 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_abreviation_unresolved_sources` | 5 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_barrage` | 11 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo` | 0 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_nappe_unresolved_qualite_nappes` | 292 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_parametre_source` | 184 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_parametre_source_orphans_audit` | 5 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_parametre_unresolved_legacy_qualite_riviere` | 39 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_parametre_unresolved_suivi_qualite_sebou` | 7 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_point_eau` | 46 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_point_eau_unresolved_nappe` | 22 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_point_eau_unresolved_station` | 46 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_profil_station` | 1980 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_profil_unresolved_nappe` | 1204 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_profil_unresolved_station` | 0 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_source` | 19 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_station` | 390 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_station_unresolved_precip_ann_max` | 0 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_station_unresolved_qualite_barrages` | 0 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_station_unresolved_qualite_nappes` | 0 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_station_unresolved_suivi_qualite_brg_garde_hebdo` | 0 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i` | 1 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_step_ind` | 15 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_step_ind_unresolved_commune` | 0 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_stm` | 18 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mapping_stm_unresolved_commune` | 0 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `mv_refresh_status` | 13 | À conserver structure + données | Conserver | Configuration technique ou catalogue applicatif à préserver. | PENDING |
| `metadata` | `obs_parametre_coverage` | 16 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `obs_parametre_entite_compat` | 18 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `obs_referentiel_parametre` | 18 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `popup_rules_config` | 11 | À conserver structure + données | Conserver | Configuration technique ou catalogue applicatif à préserver. | PENDING |
| `metadata` | `referentiel_abreviation_inventaire` | 13 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `metadata` | `referentiel_parametre` | 91 | À archiver avant vidage | Backup puis réinitialisation après validation | Référentiel ou mapping paramètres instable avant validation métier. | PENDING |
| `meteo` | `mesure_evaporation` | 48900 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `meteo` | `mesure_precipitation` | 546007 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `meteo` | `mesure_precipitation_annuelle_max` | 2085 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `meteo` | `mesure_temperature` | 0 | À conserver structure mais vider données | Conserver structure, vérifier vide | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `meteo` | `regle_qualite_evaporation_station` | 390 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `modeles` | `resultat_swat` | 0 | À conserver structure mais vider données | Conserver structure | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `modeles` | `resultat_wasp` | 0 | À conserver structure mais vider données | Conserver structure | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `modeles` | `scenario_simulation` | 0 | À conserver structure mais vider données | Conserver structure | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `monitoring` | `alerte_seuil` | 0 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `monitoring` | `flux_iot_brut` | 0 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `monitoring` | `statut_capteur` | 0 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `public` | `spatial_ref_sys` | 8500 | À ne pas toucher | Conserver | Objets publics / extensions ; validation DBA requise. | PENDING |
| `qa` | `variable_thresholds` | 0 | À conserver structure mais vider données | Conserver structure, vérifier vide | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `qualite` | `mesure_qualite_barrage` | 15808 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `qualite` | `mesure_qualite_nappe` | 63088 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `qualite` | `mesure_qualite_riviere` | 60097 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `qualite` | `mesure_qualite_sebou` | 51402 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `qualite` | `source_pollution_mesure_param` | 7191 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `qualite` | `source_pollution_prelevement` | 141 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `qualite` | `source_pollution_prelevement_lien` | 116 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `qualite` | `suivi_qualite_barrage_garde_hebdo` | 7094 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `security` | `activity_logs` | 75413 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `auth_logs` | 98 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `log_audit` | 391 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `password_history` | 7 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `password_reset_requests` | 2 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `password_reset_tokens` | 0 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `permissions` | 10 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `refresh_tokens` | 61 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `role_permissions` | 16 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `roles` | 3 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `security` | `users` | 3 | À ne pas toucher | Conserver | Sécurité, administration, géométrie ou logs techniques utiles. | PENDING |
| `staging` | `_legacy_qualite_riviere` | 60097 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `decharges` | 139 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `decharges_Abondonees` | 11 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `huileries` | 606 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesure_precipitation_old_model` | 507930 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_debit_jr` | 173251 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_debit_m` | 19316 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_debit_sources` | 2816 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_evaporation_jr` | 48900 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_niv_eau_barrages` | 85166 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_precip` | 669880 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_precipitations_jr_max` | 2085 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_precipitations_jr_traitees` | 546007 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_qualite_barrages` | 8714 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mesures_qualite_nappes` | 63088 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `mines` | 39 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `points_eau_abhs` | 46 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `profils_stations` | 1980 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `rejet_abattoir` | 56 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `rejets_brutes` | 277 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `sources_polution_mesure` | 141 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `sous_bassin_swat_bas_sebou_new` | 29 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `sous_bassin_swat_bassin_cotier_new` | 23 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `sous_bassin_swat_beht_new` | 27 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `sous_bassin_swat_haut_sebou_new` | 22 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `sous_bassin_swat_leben_innaouen_new` | 18 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `sous_bassin_swat_moyen_sebou_new` | 16 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `sous_bassin_swat_ouergha_new` | 39 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `step_ind_abhs` | 15 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `steps` | 49 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `steps_industrielles` | 14 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `stm_abhs` | 18 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `stms` | 19 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `suivi_qualite_brg_garde_hebdo` | 7094 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `staging` | `suivi_qualite_sebou` | 51402 | À archiver avant vidage | Backup puis vidage après validation | Anciennes données migrées ou staging à reconstruire depuis la source officielle. | PENDING |
| `swat_output` | `mesure_qualite_subbasin_ts` | 745110 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_output` | `ref_bassin` | 1 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_output` | `ref_parametre_qualite` | 5 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_output` | `ref_run_modele` | 1 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_output` | `ref_scenario` | 1 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_output` | `ref_subbasin` | 18 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_output` | `stg_swat_qualite_long` | 745110 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_output` | `stg_swat_qualite_meta` | 123 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_sebou` | `swat_models` | 0 | À conserver structure mais vider données | Conserver structure | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_sebou` | `swat_reach_results` | 0 | À conserver structure mais vider données | Conserver structure | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_sebou` | `swat_scenarios` | 1 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `swat_sebou` | `swat_subbasin_results` | 0 | À conserver structure mais vider données | Conserver structure | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `wasp_output` | `mesure_qualite_segment_ts` | 931770 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `wasp_output` | `ref_parametre_qualite` | 12 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `wasp_output` | `ref_run_modele` | 1 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `wasp_output` | `ref_segment_modele` | 22 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `wasp_output` | `stg_wasp_qualite_long` | 931770 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `wasp_sebou` | `wasp_results` | 931770 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `wasp_sebou` | `wasp_scenarios` | 1 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
| `wasp_sebou` | `wasp_variables` | 12 | À archiver avant vidage | Backup puis vidage après validation modèle | Données modèles à reconstruire ou réimporter après arbitrage. | PENDING |
