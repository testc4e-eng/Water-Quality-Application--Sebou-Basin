# Synthèse de classification nettoyage abh_sad

## Objectif
Préparer la validation humaine table par table avant tout nettoyage de `abh_sad`.

Aucune commande SQL destructive n'a été exécutée. Cette synthèse normalise les catégories de `04_tables_abh_sad_a_vider_ou_conserver.md`.

## Synthèse par catégorie

| Catégorie | Nombre tables | Volume cumulé |
|---|---|---|
| TO_BACKUP_AND_EMPTY | 117 | 8035548 |
| KEEP_STRUCTURE_AND_DATA | 13 | 4124 |
| KEEP_STRUCTURE_ONLY | 8 | 0 |
| DO_NOT_TOUCH | 34 | 92022 |

## Contrôles métier appliqués

- `security` : classé `DO_NOT_TOUCH`.
- `admin` : classé `DO_NOT_TOUCH`.
- `geo` : classé `DO_NOT_TOUCH`.
- `public.spatial_ref_sys` : classé `DO_NOT_TOUCH`.
- Les tables finales `qualite`, `hydro`, `meteo` contenant l'ancienne migration sont classées `TO_BACKUP_AND_EMPTY`, sauf table vide à conserver structure uniquement.
- Les mappings et référentiels instables `metadata` sont classés `TO_BACKUP_AND_EMPTY` ou `KEEP_STRUCTURE_AND_DATA` selon leur rôle applicatif.

## Tableau synthèse tables

| schema | table | volume | catégorie | action proposée | risque | validation |
|---|---|---|---|---|---|---|
| `admin` | `cercle` | 61 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `admin` | `communes` | 346 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `admin` | `localite` | 6013 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `admin` | `provinces` | 21 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `admin` | `regions` | 6 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `audit` | `ingestion_audit_logs` | 14 | DO_NOT_TOUCH | Ne pas toucher | Élevé - composant applicatif ou log à préserver | PENDING |
| `geo` | `_bak_sous_bassin_swat_leben_innaouen_20260403` | 18 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `bassin_versant` | 1 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `nappe` | 17 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `reseau_hydrographique` | 697 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `source` | 135 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `sous_bassin_abh` | 15 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `sous_bassin_swat_bas_sebou` | 29 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `sous_bassin_swat_bassin_cotier` | 23 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `sous_bassin_swat_beht` | 27 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `sous_bassin_swat_haut_sebou` | 22 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `sous_bassin_swat_leben_innaouen` | 18 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `sous_bassin_swat_moyen_sebou` | 16 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `geo` | `sous_bassin_swat_ouergha` | 39 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `hydro` | `barrage_bathymetrie` | 62359 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `mesure_barrage` | 84831 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `mesure_debit` | 521433 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `mesure_debit_mensuel` | 19316 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `mesure_debit_source` | 2816 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `regle_qualite_debit_source` | 19 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `regle_qualite_debit_station` | 390 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `infra` | `barrages` | 34 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `decharge` | 233 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `decharge_inventaire_pollution` | 11 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `decharge_inventaire_pollution_general` | 139 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `fosses_septiques_abhs` | 20 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `huilerie` | 612 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `huilerie_inventaire_pollution` | 606 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `mine` | 42 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `mine_inventaire_pollution` | 39 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `point_eau` | 46 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `profil_station` | 1980 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `rejet_abattoir` | 61 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `rejet_abattoir_inventaire_pollution` | 56 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `rejet_domestique` | 362 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `rejet_industriel` | 11 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `rejet_inventaire_pollution` | 277 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `stations` | 390 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `stations_mesure` | 390 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `step` | 41 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `step_industrielle` | 15 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `step_inventaire_pollution` | 49 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `stm` | 18 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `api_view_catalog` | 57 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `api_view_column_catalog` | 1101 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `catalogue_type_mesure` | 64 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `dictionnaire_donnees` | 0 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `mapping_abreviation_colonne_inventaire` | 13 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_abreviation_unresolved_sources` | 5 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_barrage` | 11 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo` | 0 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_nappe_unresolved_qualite_nappes` | 292 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_parametre_source` | 184 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_parametre_source_orphans_audit` | 5 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_parametre_unresolved_legacy_qualite_riviere` | 39 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_parametre_unresolved_suivi_qualite_sebou` | 7 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_point_eau` | 46 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_point_eau_unresolved_nappe` | 22 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_point_eau_unresolved_station` | 46 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_profil_station` | 1980 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_profil_unresolved_nappe` | 1204 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_profil_unresolved_station` | 0 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_source` | 19 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station` | 390 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_precip_ann_max` | 0 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_qualite_barrages` | 0 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_qualite_nappes` | 0 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_suivi_qualite_brg_garde_hebdo` | 0 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i` | 1 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_step_ind` | 15 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_step_ind_unresolved_commune` | 0 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_stm` | 18 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_stm_unresolved_commune` | 0 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mv_refresh_status` | 13 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `obs_parametre_coverage` | 16 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `obs_parametre_entite_compat` | 18 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `obs_referentiel_parametre` | 18 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `popup_rules_config` | 11 | KEEP_STRUCTURE_AND_DATA | Conserver structure et données jusqu'à arbitrage | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `referentiel_abreviation_inventaire` | 13 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `referentiel_parametre` | 91 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `meteo` | `mesure_evaporation` | 48900 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `meteo` | `mesure_precipitation` | 546007 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `meteo` | `mesure_precipitation_annuelle_max` | 2085 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `meteo` | `mesure_temperature` | 0 | KEEP_STRUCTURE_ONLY | Conserver structure ; vider uniquement si volume confirmé non nul et validé | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `meteo` | `regle_qualite_evaporation_station` | 390 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `modeles` | `resultat_swat` | 0 | KEEP_STRUCTURE_ONLY | Conserver structure ; vider uniquement si volume confirmé non nul et validé | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `modeles` | `resultat_wasp` | 0 | KEEP_STRUCTURE_ONLY | Conserver structure ; vider uniquement si volume confirmé non nul et validé | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `modeles` | `scenario_simulation` | 0 | KEEP_STRUCTURE_ONLY | Conserver structure ; vider uniquement si volume confirmé non nul et validé | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `monitoring` | `alerte_seuil` | 0 | DO_NOT_TOUCH | Ne pas toucher | Élevé - composant applicatif ou log à préserver | PENDING |
| `monitoring` | `flux_iot_brut` | 0 | DO_NOT_TOUCH | Ne pas toucher | Élevé - composant applicatif ou log à préserver | PENDING |
| `monitoring` | `statut_capteur` | 0 | DO_NOT_TOUCH | Ne pas toucher | Élevé - composant applicatif ou log à préserver | PENDING |
| `public` | `spatial_ref_sys` | 8500 | DO_NOT_TOUCH | Ne pas toucher | Critique - géométrie/PostGIS à préserver | PENDING |
| `qa` | `variable_thresholds` | 0 | KEEP_STRUCTURE_ONLY | Conserver structure ; vider uniquement si volume confirmé non nul et validé | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `qualite` | `mesure_qualite_barrage` | 15808 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `mesure_qualite_nappe` | 63088 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `mesure_qualite_riviere` | 60097 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `mesure_qualite_sebou` | 51402 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `source_pollution_mesure_param` | 7191 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `source_pollution_prelevement` | 141 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `source_pollution_prelevement_lien` | 116 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `suivi_qualite_barrage_garde_hebdo` | 7094 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `security` | `activity_logs` | 75413 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `auth_logs` | 98 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `log_audit` | 391 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `password_history` | 7 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `password_reset_requests` | 2 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `password_reset_tokens` | 0 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `permissions` | 10 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `refresh_tokens` | 61 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `role_permissions` | 16 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `roles` | 3 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `security` | `users` | 3 | DO_NOT_TOUCH | Ne pas toucher | Critique - sécurité/administration à préserver | PENDING |
| `staging` | `_legacy_qualite_riviere` | 60097 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `decharges` | 139 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `decharges_Abondonees` | 11 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `huileries` | 606 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesure_precipitation_old_model` | 507930 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_debit_jr` | 173251 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_debit_m` | 19316 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_debit_sources` | 2816 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_evaporation_jr` | 48900 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_niv_eau_barrages` | 85166 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_precip` | 669880 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_precipitations_jr_max` | 2085 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_precipitations_jr_traitees` | 546007 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_qualite_barrages` | 8714 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mesures_qualite_nappes` | 63088 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `mines` | 39 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `points_eau_abhs` | 46 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `profils_stations` | 1980 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `rejet_abattoir` | 56 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `rejets_brutes` | 277 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `sources_polution_mesure` | 141 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `sous_bassin_swat_bas_sebou_new` | 29 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `sous_bassin_swat_bassin_cotier_new` | 23 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `sous_bassin_swat_beht_new` | 27 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `sous_bassin_swat_haut_sebou_new` | 22 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `sous_bassin_swat_leben_innaouen_new` | 18 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `sous_bassin_swat_moyen_sebou_new` | 16 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `sous_bassin_swat_ouergha_new` | 39 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `step_ind_abhs` | 15 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `steps` | 49 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `steps_industrielles` | 14 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `stm_abhs` | 18 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `stms` | 19 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `suivi_qualite_brg_garde_hebdo` | 7094 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `staging` | `suivi_qualite_sebou` | 51402 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Élevé - brut/staging historique à sauvegarder puis remplacer | PENDING |
| `swat_output` | `mesure_qualite_subbasin_ts` | 745110 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_output` | `ref_bassin` | 1 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_output` | `ref_parametre_qualite` | 5 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_output` | `ref_run_modele` | 1 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_output` | `ref_scenario` | 1 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_output` | `ref_subbasin` | 18 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_output` | `stg_swat_qualite_long` | 745110 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_output` | `stg_swat_qualite_meta` | 123 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_sebou` | `swat_models` | 0 | KEEP_STRUCTURE_ONLY | Conserver structure ; vider uniquement si volume confirmé non nul et validé | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `swat_sebou` | `swat_reach_results` | 0 | KEEP_STRUCTURE_ONLY | Conserver structure ; vider uniquement si volume confirmé non nul et validé | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `swat_sebou` | `swat_scenarios` | 1 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `swat_sebou` | `swat_subbasin_results` | 0 | KEEP_STRUCTURE_ONLY | Conserver structure ; vider uniquement si volume confirmé non nul et validé | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `wasp_output` | `mesure_qualite_segment_ts` | 931770 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `wasp_output` | `ref_parametre_qualite` | 12 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `wasp_output` | `ref_run_modele` | 1 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `wasp_output` | `ref_segment_modele` | 22 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `wasp_output` | `stg_wasp_qualite_long` | 931770 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `wasp_sebou` | `wasp_results` | 931770 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `wasp_sebou` | `wasp_scenarios` | 1 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |
| `wasp_sebou` | `wasp_variables` | 12 | TO_BACKUP_AND_EMPTY | Backup obligatoire puis vidage après validation humaine | Moyen - données modèle à arbitrer avant réimport | PENDING |

## Dépendances FK applicatives détectées

Statut extraction FK : OK - catalogue PostgreSQL lu en read-only, filtré sur les tables applicatives listées

| Table enfant | Table parent | Contrainte |
|---|---|---|
| `admin.cercle` | `admin.provinces` | fk_cercles_province |
| `admin.communes` | `admin.cercle` | fk_commune_cercle |
| `admin.provinces` | `admin.regions` | fk_province_region |
| `geo.sous_bassin_abh` | `geo.bassin_versant` | sous_bassin_bassin_versant_id_fkey |
| `hydro.mesure_debit` | `infra.stations_mesure` | mesure_debit_station_id_fkey |
| `hydro.mesure_debit_mensuel` | `infra.stations_mesure` | mesure_debit_mensuel_station_id_fkey |
| `hydro.mesure_debit_source` | `metadata.mapping_source` | mesure_debit_source_source_id_fkey |
| `hydro.regle_qualite_debit_source` | `metadata.mapping_source` | regle_qualite_debit_source_source_id_fkey |
| `hydro.regle_qualite_debit_station` | `infra.stations_mesure` | regle_qualite_debit_station_station_id_fkey |
| `infra.barrages` | `admin.communes` | fk_barrages_commune |
| `infra.decharge` | `admin.communes` | fk_decharges_jr_station |
| `infra.decharge_inventaire_pollution` | `infra.decharge` | decharge_inventaire_pollution_decharge_id_fkey |
| `infra.decharge_inventaire_pollution_general` | `infra.decharge` | decharge_inventaire_pollution_general_decharge_id_fkey |
| `infra.huilerie` | `admin.communes` | fk_huileries_commune |
| `infra.huilerie_inventaire_pollution` | `infra.huilerie` | huilerie_inventaire_pollution_huilerie_id_fkey |
| `infra.mine` | `admin.communes` | fk_mines_commune |
| `infra.mine_inventaire_pollution` | `infra.mine` | mine_inventaire_pollution_mine_id_fkey |
| `infra.rejet_abattoir` | `admin.communes` | fk_rejets_abattoirs_commune |
| `infra.rejet_abattoir_inventaire_pollution` | `infra.rejet_abattoir` | rejet_abattoir_inventaire_pollution_rejet_abattoir_id_fkey |
| `infra.rejet_domestique` | `admin.communes` | fk_rejets_domestiques_commune |
| `infra.rejet_industriel` | `admin.communes` | fk_rejets_ind_commune |
| `infra.rejet_inventaire_pollution` | `infra.rejet_domestique` | rejet_inventaire_pollution_rejet_domestique_id_fkey |
| `infra.stations` | `admin.communes` | fk_stations_commune |
| `infra.step` | `admin.communes` | fk_step_commune |
| `infra.step_inventaire_pollution` | `infra.step` | step_inventaire_pollution_step_id_fkey |
| `metadata.mapping_abreviation_colonne_inventaire` | `metadata.referentiel_abreviation_inventaire` | mapping_abreviation_colonne_inventaire_abreviation_ref_id_fkey |
| `metadata.mapping_parametre_source` | `metadata.referentiel_parametre` | mapping_parametre_source_parametre_ref_id_fkey |
| `metadata.obs_parametre_coverage` | `metadata.obs_referentiel_parametre` | obs_parametre_coverage_parametre_code_fkey |
| `metadata.obs_parametre_entite_compat` | `metadata.obs_referentiel_parametre` | obs_parametre_entite_compat_parametre_code_fkey |
| `meteo.mesure_evaporation` | `infra.stations_mesure` | mesure_evaporation_station_id_fkey |
| `meteo.mesure_precipitation` | `infra.stations_mesure` | mesure_precipitation_traitee_station_id_fkey |
| `meteo.mesure_temperature` | `infra.stations_mesure` | mesure_temperature_station_id_fkey |
| `meteo.regle_qualite_evaporation_station` | `infra.stations_mesure` | regle_qualite_evaporation_station_station_id_fkey |
| `modeles.resultat_swat` | `modeles.scenario_simulation` | resultat_swat_scenario_id_fkey |
| `modeles.resultat_swat` | `geo.sous_bassin_abh` | resultat_swat_sous_bassin_id_fkey |
| `modeles.resultat_wasp` | `modeles.scenario_simulation` | resultat_wasp_scenario_id_fkey |
| `monitoring.alerte_seuil` | `infra.stations_mesure` | alerte_seuil_station_id_fkey |
| `monitoring.flux_iot_brut` | `infra.stations_mesure` | flux_iot_brut_station_id_fkey |
| `monitoring.statut_capteur` | `infra.stations_mesure` | statut_capteur_station_id_fkey |
| `qualite.mesure_qualite_barrage` | `infra.stations_mesure` | mesure_qualite_barrage_station_id_fkey |
| `qualite.mesure_qualite_nappe` | `infra.stations_mesure` | mesure_qualite_nappe_station_id_fkey |
| `qualite.mesure_qualite_riviere` | `metadata.referentiel_parametre` | mesure_qualite_riviere_parametre_ref_id_fkey |
| `qualite.mesure_qualite_riviere` | `infra.stations_mesure` | mesure_qualite_riviere_station_id_fkey |
| `qualite.mesure_qualite_sebou` | `metadata.referentiel_parametre` | mesure_qualite_sebou_parametre_ref_id_fkey |
| `qualite.mesure_qualite_sebou` | `infra.stations_mesure` | mesure_qualite_sebou_station_id_fkey |
| `qualite.source_pollution_mesure_param` | `metadata.referentiel_parametre` | source_pollution_mesure_param_parametre_ref_id_fkey |
| `qualite.source_pollution_mesure_param` | `qualite.source_pollution_prelevement` | source_pollution_mesure_param_prelevement_id_fkey |
| `qualite.source_pollution_prelevement_lien` | `qualite.source_pollution_prelevement` | source_pollution_prelevement_lien_prelevement_id_fkey |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `infra.stations_mesure` | suivi_qualite_barrage_hebdo_station_id_fkey |
| `security.auth_logs` | `security.users` | auth_logs_user_id_fkey |
| `security.password_history` | `security.users` | password_history_user_id_fkey |
| `security.password_reset_requests` | `security.users` | password_reset_requests_user_id_fkey |
| `security.password_reset_tokens` | `security.users` | password_reset_tokens_user_id_fkey |
| `security.refresh_tokens` | `security.users` | refresh_tokens_user_id_fkey |
| `security.role_permissions` | `security.permissions` | role_permissions_permission_id_fkey |
| `security.role_permissions` | `security.roles` | role_permissions_role_id_fkey |
| `security.users` | `security.roles` | users_role_id_fkey |
| `swat_output.mesure_qualite_subbasin_ts` | `swat_output.ref_parametre_qualite` | mesure_qualite_subbasin_ts_param_code_fkey |
| `swat_output.mesure_qualite_subbasin_ts` | `swat_output.ref_run_modele` | mesure_qualite_subbasin_ts_run_id_fkey |
| `swat_output.mesure_qualite_subbasin_ts` | `swat_output.ref_subbasin` | mesure_qualite_subbasin_ts_subbasin_uid_fkey |
| `swat_output.ref_run_modele` | `swat_output.ref_bassin` | ref_run_modele_bassin_code_fkey |
| `swat_output.ref_run_modele` | `swat_output.ref_scenario` | ref_run_modele_scenario_code_fkey |
| `swat_output.ref_subbasin` | `swat_output.ref_bassin` | ref_subbasin_bassin_code_fkey |
| `swat_output.ref_subbasin` | `geo.sous_bassin_swat_leben_innaouen` | ref_subbasin_geo_sous_bassin_id_fkey |
| `swat_sebou.swat_reach_results` | `swat_sebou.swat_scenarios` | swat_reach_results_scenario_id_fkey |
| `swat_sebou.swat_scenarios` | `swat_sebou.swat_models` | swat_scenarios_model_id_fkey |
| `swat_sebou.swat_subbasin_results` | `swat_sebou.swat_scenarios` | swat_subbasin_results_scenario_id_fkey |
| `wasp_output.mesure_qualite_segment_ts` | `wasp_output.ref_segment_modele` | fk_wasp_mesure_segment |
| `wasp_output.mesure_qualite_segment_ts` | `wasp_output.ref_parametre_qualite` | mesure_qualite_segment_ts_code_parametre_fkey |
| `wasp_output.mesure_qualite_segment_ts` | `wasp_output.ref_run_modele` | mesure_qualite_segment_ts_run_id_fkey |
| `wasp_output.ref_run_modele` | `swat_output.ref_bassin` | fk_wasp_bassin_code |
| `wasp_output.ref_run_modele` | `swat_output.ref_scenario` | fk_wasp_scenario_code |
| `wasp_output.ref_segment_modele` | `geo.reseau_hydrographique` | fk_wasp_segment_reseau |
| `wasp_sebou.wasp_results` | `wasp_sebou.wasp_scenarios` | wasp_results_scenario_id_fkey |
| `wasp_sebou.wasp_results` | `wasp_sebou.wasp_variables` | wasp_results_variable_id_fkey |
