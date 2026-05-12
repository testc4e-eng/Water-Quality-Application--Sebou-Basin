# Plan d'exécution du nettoyage contrôlé abh_sad

## Principe
Aucune étape ne doit être exécutée tant que le périmètre n'est pas validé humainement. Le nettoyage proposé conserve les structures SQL et prépare la reconstruction depuis `abh_sebou_ismail`.

## Préconditions bloquantes
- Validation écrite de la liste des tables `TO_BACKUP_AND_EMPTY`.
- Dump complet `abh_sad` disponible et hashé.
- Export CSV par table critique disponible et hashé.
- Validation DBA de l'ordre FK si une contrainte bloque le vidage.
- Confirmation que les schémas `security`, `admin`, `geo` et `public.spatial_ref_sys` ne sont pas touchés.

## Synthèse des lots

| Lot | Tables | Volume | Statut |
|---|---|---|---|
| Lot 0 - staging historique | 35 | 2249330 | PENDING |
| Lot 1 - tables qualité | 8 | 204937 | PENDING |
| Lot 2 - tables hydro | 7 | 691164 | PENDING |
| Lot 3 - tables météo | 4 | 597382 | PENDING |
| Lot 4 - metadata instable | 31 | 4453 | PENDING |
| Lot 5 - pollution et référentiels instables | 15 | 2554 | PENDING |
| Lot 6 - modèles SWAT/WASP | 17 | 4285728 | PENDING |

## Lot 0 — staging historique

Objectif : archiver le staging historique avant de créer un staging propre issu de `abh_sebou_ismail`.

| Ordre | Table | Volume | Risque | Rollback possible | Validation |
|---|---|---|---|---|---|
| 1 | `staging._legacy_qualite_riviere` | 60097 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 2 | `staging.decharges` | 139 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 3 | `staging.decharges_Abondonees` | 11 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 4 | `staging.huileries` | 606 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 5 | `staging.mesure_precipitation_old_model` | 507930 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 6 | `staging.mesures_debit_jr` | 173251 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 7 | `staging.mesures_debit_m` | 19316 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 8 | `staging.mesures_debit_sources` | 2816 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 9 | `staging.mesures_evaporation_jr` | 48900 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 10 | `staging.mesures_niv_eau_barrages` | 85166 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 11 | `staging.mesures_precip` | 669880 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 12 | `staging.mesures_precipitations_jr_max` | 2085 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 13 | `staging.mesures_precipitations_jr_traitees` | 546007 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 14 | `staging.mesures_qualite_barrages` | 8714 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 15 | `staging.mesures_qualite_nappes` | 63088 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 16 | `staging.mines` | 39 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 17 | `staging.points_eau_abhs` | 46 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 18 | `staging.profils_stations` | 1980 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 19 | `staging.rejet_abattoir` | 56 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 20 | `staging.rejets_brutes` | 277 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 21 | `staging.sources_polution_mesure` | 141 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 22 | `staging.sous_bassin_swat_bas_sebou_new` | 29 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 23 | `staging.sous_bassin_swat_bassin_cotier_new` | 23 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 24 | `staging.sous_bassin_swat_beht_new` | 27 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 25 | `staging.sous_bassin_swat_haut_sebou_new` | 22 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 26 | `staging.sous_bassin_swat_leben_innaouen_new` | 18 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 27 | `staging.sous_bassin_swat_moyen_sebou_new` | 16 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 28 | `staging.sous_bassin_swat_ouergha_new` | 39 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 29 | `staging.step_ind_abhs` | 15 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 30 | `staging.steps` | 49 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 31 | `staging.steps_industrielles` | 14 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 32 | `staging.stm_abhs` | 18 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 33 | `staging.stms` | 19 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 34 | `staging.suivi_qualite_brg_garde_hebdo` | 7094 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |
| 35 | `staging.suivi_qualite_sebou` | 51402 | Élevé - brut/staging historique à sauvegarder puis remplacer | Restaurer depuis dump complet ou CSV table | PENDING |

Rollback : restaurer la table depuis l'export CSV ou restaurer la base depuis le dump complet si l'intégrité globale est compromise.

## Lot 1 — tables qualité

Objectif : vider les anciennes mesures qualité après sauvegarde pour permettre une reconstruction contrôlée.

| Ordre | Table | Volume | Risque | Rollback possible | Validation |
|---|---|---|---|---|---|
| 1 | `qualite.mesure_qualite_barrage` | 15808 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 2 | `qualite.mesure_qualite_nappe` | 63088 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 3 | `qualite.mesure_qualite_riviere` | 60097 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 4 | `qualite.mesure_qualite_sebou` | 51402 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 5 | `qualite.source_pollution_mesure_param` | 7191 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 6 | `qualite.source_pollution_prelevement` | 141 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 7 | `qualite.source_pollution_prelevement_lien` | 116 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 8 | `qualite.suivi_qualite_barrage_garde_hebdo` | 7094 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |

Rollback : restaurer la table depuis l'export CSV ou restaurer la base depuis le dump complet si l'intégrité globale est compromise.

## Lot 2 — tables hydro

Objectif : vider les anciennes mesures hydrologiques après sauvegarde et recharger depuis la source officielle validée.

| Ordre | Table | Volume | Risque | Rollback possible | Validation |
|---|---|---|---|---|---|
| 1 | `hydro.barrage_bathymetrie` | 62359 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 2 | `hydro.mesure_barrage` | 84831 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 3 | `hydro.mesure_debit` | 521433 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 4 | `hydro.mesure_debit_mensuel` | 19316 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 5 | `hydro.mesure_debit_source` | 2816 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 6 | `hydro.regle_qualite_debit_source` | 19 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 7 | `hydro.regle_qualite_debit_station` | 390 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |

Rollback : restaurer la table depuis l'export CSV ou restaurer la base depuis le dump complet si l'intégrité globale est compromise.

## Lot 3 — tables météo

Objectif : vider les anciennes mesures météo après sauvegarde, en conservant la stratégie température à valider.

| Ordre | Table | Volume | Risque | Rollback possible | Validation |
|---|---|---|---|---|---|
| 1 | `meteo.mesure_evaporation` | 48900 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 2 | `meteo.mesure_precipitation` | 546007 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 3 | `meteo.mesure_precipitation_annuelle_max` | 2085 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |
| 4 | `meteo.regle_qualite_evaporation_station` | 390 | Élevé - anciennes mesures à sauvegarder avant reconstruction | Restaurer depuis dump complet ou CSV table | PENDING |

Rollback : restaurer la table depuis l'export CSV ou restaurer la base depuis le dump complet si l'intégrité globale est compromise.

## Lot 4 — metadata instable

Objectif : neutraliser les mappings et référentiels instables après backup, puis reconstruire depuis le référentiel validé.

| Ordre | Table | Volume | Risque | Rollback possible | Validation |
|---|---|---|---|---|---|
| 1 | `metadata.mapping_abreviation_colonne_inventaire` | 13 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 2 | `metadata.mapping_abreviation_unresolved_sources` | 5 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 3 | `metadata.mapping_barrage` | 11 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 4 | `metadata.mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo` | 0 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 5 | `metadata.mapping_nappe_unresolved_qualite_nappes` | 292 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 6 | `metadata.mapping_parametre_source` | 184 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 7 | `metadata.mapping_parametre_source_orphans_audit` | 5 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 8 | `metadata.mapping_parametre_unresolved_legacy_qualite_riviere` | 39 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 9 | `metadata.mapping_parametre_unresolved_suivi_qualite_sebou` | 7 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 10 | `metadata.mapping_point_eau` | 46 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 11 | `metadata.mapping_point_eau_unresolved_nappe` | 22 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 12 | `metadata.mapping_point_eau_unresolved_station` | 46 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 13 | `metadata.mapping_profil_station` | 1980 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 14 | `metadata.mapping_profil_unresolved_nappe` | 1204 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 15 | `metadata.mapping_profil_unresolved_station` | 0 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 16 | `metadata.mapping_source` | 19 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 17 | `metadata.mapping_station` | 390 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 18 | `metadata.mapping_station_unresolved_precip_ann_max` | 0 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 19 | `metadata.mapping_station_unresolved_qualite_barrages` | 0 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 20 | `metadata.mapping_station_unresolved_qualite_nappes` | 0 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 21 | `metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo` | 0 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 22 | `metadata.mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i` | 1 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 23 | `metadata.mapping_step_ind` | 15 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 24 | `metadata.mapping_step_ind_unresolved_commune` | 0 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 25 | `metadata.mapping_stm` | 18 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 26 | `metadata.mapping_stm_unresolved_commune` | 0 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 27 | `metadata.obs_parametre_coverage` | 16 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 28 | `metadata.obs_parametre_entite_compat` | 18 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 29 | `metadata.obs_referentiel_parametre` | 18 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 30 | `metadata.referentiel_abreviation_inventaire` | 13 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |
| 31 | `metadata.referentiel_parametre` | 91 | Critique - mapping/référentiel instable impactant toute migration | Restaurer depuis dump complet ou CSV table | PENDING |

Rollback : restaurer la table depuis l'export CSV ou restaurer la base depuis le dump complet si l'intégrité globale est compromise.

## Lot 5 — pollution et référentiels instables

Objectif : archiver les référentiels pollution instables avant arbitrage métier.

| Ordre | Table | Volume | Risque | Rollback possible | Validation |
|---|---|---|---|---|---|
| 1 | `infra.decharge` | 233 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 2 | `infra.decharge_inventaire_pollution` | 11 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 3 | `infra.decharge_inventaire_pollution_general` | 139 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 4 | `infra.huilerie` | 612 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 5 | `infra.huilerie_inventaire_pollution` | 606 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 6 | `infra.mine` | 42 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 7 | `infra.mine_inventaire_pollution` | 39 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 8 | `infra.rejet_abattoir` | 61 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 9 | `infra.rejet_abattoir_inventaire_pollution` | 56 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 10 | `infra.rejet_domestique` | 362 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 11 | `infra.rejet_industriel` | 11 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 12 | `infra.rejet_inventaire_pollution` | 277 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 13 | `infra.step` | 41 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 14 | `infra.step_industrielle` | 15 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |
| 15 | `infra.step_inventaire_pollution` | 49 | Élevé - référentiel pollution potentiellement instable | Restaurer depuis dump complet ou CSV table | PENDING |

Rollback : restaurer la table depuis l'export CSV ou restaurer la base depuis le dump complet si l'intégrité globale est compromise.

## Lot 6 — modèles SWAT/WASP

Objectif : archiver les sorties modèles existantes avant décision d'intégration SWAT/WASP.

| Ordre | Table | Volume | Risque | Rollback possible | Validation |
|---|---|---|---|---|---|
| 1 | `swat_output.mesure_qualite_subbasin_ts` | 745110 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 2 | `swat_output.ref_bassin` | 1 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 3 | `swat_output.ref_parametre_qualite` | 5 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 4 | `swat_output.ref_run_modele` | 1 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 5 | `swat_output.ref_scenario` | 1 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 6 | `swat_output.ref_subbasin` | 18 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 7 | `swat_output.stg_swat_qualite_long` | 745110 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 8 | `swat_output.stg_swat_qualite_meta` | 123 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 9 | `swat_sebou.swat_scenarios` | 1 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 10 | `wasp_output.mesure_qualite_segment_ts` | 931770 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 11 | `wasp_output.ref_parametre_qualite` | 12 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 12 | `wasp_output.ref_run_modele` | 1 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 13 | `wasp_output.ref_segment_modele` | 22 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 14 | `wasp_output.stg_wasp_qualite_long` | 931770 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 15 | `wasp_sebou.wasp_results` | 931770 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 16 | `wasp_sebou.wasp_scenarios` | 1 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |
| 17 | `wasp_sebou.wasp_variables` | 12 | Moyen - données modèle à arbitrer avant réimport | Restaurer depuis dump complet ou CSV table | PENDING |

Rollback : restaurer la table depuis l'export CSV ou restaurer la base depuis le dump complet si l'intégrité globale est compromise.

## Tables à ne pas toucher

| Table | Volume | Justification |
|---|---|---|
| `admin.cercle` | 61 | Critique - sécurité/administration à préserver |
| `admin.communes` | 346 | Critique - sécurité/administration à préserver |
| `admin.localite` | 6013 | Critique - sécurité/administration à préserver |
| `admin.provinces` | 21 | Critique - sécurité/administration à préserver |
| `admin.regions` | 6 | Critique - sécurité/administration à préserver |
| `audit.ingestion_audit_logs` | 14 | Élevé - composant applicatif ou log à préserver |
| `geo._bak_sous_bassin_swat_leben_innaouen_20260403` | 18 | Critique - géométrie/PostGIS à préserver |
| `geo.bassin_versant` | 1 | Critique - géométrie/PostGIS à préserver |
| `geo.nappe` | 17 | Critique - géométrie/PostGIS à préserver |
| `geo.reseau_hydrographique` | 697 | Critique - géométrie/PostGIS à préserver |
| `geo.source` | 135 | Critique - géométrie/PostGIS à préserver |
| `geo.sous_bassin_abh` | 15 | Critique - géométrie/PostGIS à préserver |
| `geo.sous_bassin_swat_bas_sebou` | 29 | Critique - géométrie/PostGIS à préserver |
| `geo.sous_bassin_swat_bassin_cotier` | 23 | Critique - géométrie/PostGIS à préserver |
| `geo.sous_bassin_swat_beht` | 27 | Critique - géométrie/PostGIS à préserver |
| `geo.sous_bassin_swat_haut_sebou` | 22 | Critique - géométrie/PostGIS à préserver |
| `geo.sous_bassin_swat_leben_innaouen` | 18 | Critique - géométrie/PostGIS à préserver |
| `geo.sous_bassin_swat_moyen_sebou` | 16 | Critique - géométrie/PostGIS à préserver |
| `geo.sous_bassin_swat_ouergha` | 39 | Critique - géométrie/PostGIS à préserver |
| `monitoring.alerte_seuil` | 0 | Élevé - composant applicatif ou log à préserver |
| `monitoring.flux_iot_brut` | 0 | Élevé - composant applicatif ou log à préserver |
| `monitoring.statut_capteur` | 0 | Élevé - composant applicatif ou log à préserver |
| `public.spatial_ref_sys` | 8500 | Critique - géométrie/PostGIS à préserver |
| `security.activity_logs` | 75413 | Critique - sécurité/administration à préserver |
| `security.auth_logs` | 98 | Critique - sécurité/administration à préserver |
| `security.log_audit` | 391 | Critique - sécurité/administration à préserver |
| `security.password_history` | 7 | Critique - sécurité/administration à préserver |
| `security.password_reset_requests` | 2 | Critique - sécurité/administration à préserver |
| `security.password_reset_tokens` | 0 | Critique - sécurité/administration à préserver |
| `security.permissions` | 10 | Critique - sécurité/administration à préserver |
| `security.refresh_tokens` | 61 | Critique - sécurité/administration à préserver |
| `security.role_permissions` | 16 | Critique - sécurité/administration à préserver |
| `security.roles` | 3 | Critique - sécurité/administration à préserver |
| `security.users` | 3 | Critique - sécurité/administration à préserver |