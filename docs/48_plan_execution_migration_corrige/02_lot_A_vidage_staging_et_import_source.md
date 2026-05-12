# Lot A — Vidage staging et import source officielle

## Objectif
Vider toutes les anciennes tables du schéma `staging` de `abh_sad` après backup, puis reconstruire le brut métier depuis `abh_sebou_ismail` dans des tables `staging.raw_*`.

`public.spatial_ref_sys` est exclue du Lot A : c’est une table technique PostGIS, pas une donnée client métier.

## Sous-validations Lot A

| Sous-lot | Décision | Périmètre | Preuve attendue | Statut |
|---|---|---|---|---|
| A1 | Autoriser backup complet + exports CSV staging | base `abh_sad` complète + 35 tables `staging` | dump complet, exports CSV, checksums, volumes avant traitement | EXECUTED - PREUVES PRODUITES, VALIDATION HUMAINE REQUISE |
| A2 | Autoriser vidage staging + import brut métier | 35 tables `staging` vidées + 46 tables source métier importées | validation A1, contrôles source/raw delta 0 | EXECUTED - CONTRÔLES OK, VALIDATION HUMAINE POST-A2 REQUISE |

## Étapes

| Étape | Action | Tables concernées | Risque | Validation | Statut |
|---|---|---|---|---|---|
| A0 | Valider périmètre staging à vider | 35 tables `abh_sad.staging` | Critique - perte staging historique si backup incomplet | Validation métier + DBA | PENDING |
| A1.1 | Backup complet `abh_sad` | Base complète | Critique | Validation backup + hash | EXECUTED - PREUVES PRODUITES, VALIDATION HUMAINE REQUISE |
| A1.2 | Export CSV tables staging | 35 tables staging | Élevé | Validation volumes + checksums | EXECUTED - PREUVES PRODUITES, VALIDATION HUMAINE REQUISE |
| A2.1 | Vidage staging exécuté | 35 tables staging | Élevé | Vérification COUNT après vidage = 0 | EXECUTED - CONTRÔLES OK, VALIDATION HUMAINE POST-A2 REQUISE |
| A2.2 | Import source brute métier vers `staging.raw_*` exécuté | 46 tables métier depuis `abh_sebou_ismail` | Élevé - mapping source/cible à confirmer | Contrôle source/raw delta 0 | EXECUTED - CONTRÔLES OK, VALIDATION HUMAINE POST-A2 REQUISE |
| A2.3 | Contrôler volumes post-import | 46 tables raw contrôlées | Élevé | Delta global source/raw = 0 | EXECUTED - CONTRÔLES OK, VALIDATION HUMAINE POST-A2 REQUISE |

## Tables staging cible concernées

| Table | Volume | Action proposée | Statut |
|---|---|---|---|
| `staging._legacy_qualite_riviere` | 60097 | vider après backup | PENDING |
| `staging.decharges` | 139 | vider après backup | PENDING |
| `staging.decharges_Abondonees` | 11 | vider après backup | PENDING |
| `staging.huileries` | 606 | vider après backup | PENDING |
| `staging.mesure_precipitation_old_model` | 507930 | vider après backup | PENDING |
| `staging.mesures_debit_jr` | 173251 | vider après backup | PENDING |
| `staging.mesures_debit_m` | 19316 | vider après backup | PENDING |
| `staging.mesures_debit_sources` | 2816 | vider après backup | PENDING |
| `staging.mesures_evaporation_jr` | 48900 | vider après backup | PENDING |
| `staging.mesures_niv_eau_barrages` | 85166 | vider après backup | PENDING |
| `staging.mesures_precip` | 669880 | vider après backup | PENDING |
| `staging.mesures_precipitations_jr_max` | 2085 | vider après backup | PENDING |
| `staging.mesures_precipitations_jr_traitees` | 546007 | vider après backup | PENDING |
| `staging.mesures_qualite_barrages` | 8714 | vider après backup | PENDING |
| `staging.mesures_qualite_nappes` | 63088 | vider après backup | PENDING |
| `staging.mines` | 39 | vider après backup | PENDING |
| `staging.points_eau_abhs` | 46 | vider après backup | PENDING |
| `staging.profils_stations` | 1980 | vider après backup | PENDING |
| `staging.rejet_abattoir` | 56 | vider après backup | PENDING |
| `staging.rejets_brutes` | 277 | vider après backup | PENDING |
| `staging.sources_polution_mesure` | 141 | vider après backup | PENDING |
| `staging.sous_bassin_swat_bas_sebou_new` | 29 | vider après backup | PENDING |
| `staging.sous_bassin_swat_bassin_cotier_new` | 23 | vider après backup | PENDING |
| `staging.sous_bassin_swat_beht_new` | 27 | vider après backup | PENDING |
| `staging.sous_bassin_swat_haut_sebou_new` | 22 | vider après backup | PENDING |
| `staging.sous_bassin_swat_leben_innaouen_new` | 18 | vider après backup | PENDING |
| `staging.sous_bassin_swat_moyen_sebou_new` | 16 | vider après backup | PENDING |
| `staging.sous_bassin_swat_ouergha_new` | 39 | vider après backup | PENDING |
| `staging.step_ind_abhs` | 15 | vider après backup | PENDING |
| `staging.steps` | 49 | vider après backup | PENDING |
| `staging.steps_industrielles` | 14 | vider après backup | PENDING |
| `staging.stm_abhs` | 18 | vider après backup | PENDING |
| `staging.stms` | 19 | vider après backup | PENDING |
| `staging.suivi_qualite_brg_garde_hebdo` | 7094 | vider après backup | PENDING |
| `staging.suivi_qualite_sebou` | 51402 | vider après backup | PENDING |

## Tables source métier à importer vers staging.raw_*

| Source | Volume source | Table raw cible proposée | Priorité | Statut |
|---|---|---|---|---|
| `public.adm_cercles_abhs` | 61 | `staging.raw_adm_cercles_abhs` | Moyenne | PENDING |
| `public.adm_communes_abhs` | 346 | `staging.raw_adm_communes_abhs` | Moyenne | PENDING |
| `public.adm_douars_abhs` | 6013 | `staging.raw_adm_douars_abhs` | Moyenne | PENDING |
| `public.adm_provinces_abhs` | 21 | `staging.raw_adm_provinces_abhs` | Moyenne | PENDING |
| `public.adm_regions_abhs` | 6 | `staging.raw_adm_regions_abhs` | Moyenne | PENDING |
| `public.adm_villes_abhs` | 33 | `staging.raw_adm_villes_abhs` | Moyenne | PENDING |
| `public.barrages_abhs` | 34 | `staging.raw_barrages_abhs` | Élevée | PENDING |
| `public.bassin_sebou` | 1 | `staging.raw_bassin_sebou` | Moyenne | PENDING |
| `public.bathymetries_barrages_abhs` | 62359 | `staging.raw_bathymetries_barrages_abhs` | Élevée | PENDING |
| `public.capteurs_abhs` | 0 | `staging.raw_capteurs_abhs` | Critique | PENDING |
| `public.decharges_abhs` | 233 | `staging.raw_decharges_abhs` | Critique | PENDING |
| `public.fosses_septiques_abhs` | 20 | `staging.raw_fosses_septiques_abhs` | Moyenne | PENDING |
| `public.huileries_abhs` | 612 | `staging.raw_huileries_abhs` | Critique | PENDING |
| `public.idp_2024_mesures_qualite_globale` | 4894 | `staging.raw_idp_2024_mesures_qualite_globale` | Critique | PENDING |
| `public.idp_2024_mesures_qualite_marche_cadre` | 3614 | `staging.raw_idp_2024_mesures_qualite_marche_cadre` | Critique | PENDING |
| `public.idp_2024_src_pollution_globale` | 243 | `staging.raw_idp_2024_src_pollution_globale` | Critique | PENDING |
| `public.idp_2024_src_pollution_marche_cadre` | 148 | `staging.raw_idp_2024_src_pollution_marche_cadre` | Critique | PENDING |
| `public.mesures_debit_jr` | 521433 | `staging.raw_mesures_debit_jr` | Élevée | PENDING |
| `public.mesures_debit_m` | 19316 | `staging.raw_mesures_debit_m` | Élevée | PENDING |
| `public.mesures_debit_sources` | 2816 | `staging.raw_mesures_debit_sources` | Élevée | PENDING |
| `public.mesures_evaporation_jr` | 48900 | `staging.raw_mesures_evaporation_jr` | Élevée | PENDING |
| `public.mesures_niv_eau_barrages` | 85166 | `staging.raw_mesures_niv_eau_barrages` | Élevée | PENDING |
| `public.mesures_precipitations_jr` | 669880 | `staging.raw_mesures_precipitations_jr` | Élevée | PENDING |
| `public.mesures_precipitations_jr_max` | 2085 | `staging.raw_mesures_precipitations_jr_max` | Élevée | PENDING |
| `public.mesures_precipitations_jr_traitees` | 546007 | `staging.raw_mesures_precipitations_jr_traitees` | Élevée | PENDING |
| `public.mesures_qualite_barrages` | 8714 | `staging.raw_mesures_qualite_barrages` | Critique | PENDING |
| `public.mesures_qualite_nappes` | 63088 | `staging.raw_mesures_qualite_nappes` | Critique | PENDING |
| `public.mesures_qualite_rivieres` | 60097 | `staging.raw_mesures_qualite_rivieres` | Critique | PENDING |
| `public.mesures_temperatures_jr` | 0 | `staging.raw_mesures_temperatures_jr` | Élevée | PENDING |
| `public.mines_abhs` | 42 | `staging.raw_mines_abhs` | Critique | PENDING |
| `public.nappes_abhs` | 17 | `staging.raw_nappes_abhs` | Moyenne | PENDING |
| `public.points_eau_abhs` | 46 | `staging.raw_points_eau_abhs` | Critique | PENDING |
| `public.profils_stations` | 1980 | `staging.raw_profils_stations` | Moyenne | PENDING |
| `public.rejets_abattoirs_abhs` | 61 | `staging.raw_rejets_abattoirs_abhs` | Critique | PENDING |
| `public.rejets_domestiques_abhs` | 362 | `staging.raw_rejets_domestiques_abhs` | Critique | PENDING |
| `public.rejets_ind_abhs` | 11 | `staging.raw_rejets_ind_abhs` | Critique | PENDING |
| `public.reseau_hydro_abhs` | 28 | `staging.raw_reseau_hydro_abhs` | Moyenne | PENDING |
| `public.sources_abhs` | 135 | `staging.raw_sources_abhs` | Moyenne | PENDING |
| `public.sous_bassin_sebou` | 15 | `staging.raw_sous_bassin_sebou` | Moyenne | PENDING |
| `public.stations_abhs` | 390 | `staging.raw_stations_abhs` | Élevée | PENDING |
| `public.step_abhs` | 41 | `staging.raw_step_abhs` | Critique | PENDING |
| `public.step_ind_abhs` | 15 | `staging.raw_step_ind_abhs` | Critique | PENDING |
| `public.stm_abhs` | 18 | `staging.raw_stm_abhs` | Moyenne | PENDING |
| `public.suivi_qualite_brg_garde_hebdo` | 7094 | `staging.raw_suivi_qualite_brg_garde_hebdo` | Critique | PENDING |
| `public.suivi_qualite_sebou_jr` | 59436 | `staging.raw_suivi_qualite_sebou_jr` | Critique | PENDING |
| `public.types_mesures` | 64 | `staging.raw_types_mesures` | Critique | PENDING |

## Règles de passage au lot suivant

- Tous les backups doivent être validés.
- Tous les checksums doivent être conservés.
- Les volumes source et raw doivent être comparés.
- Aucun chargement vers `qualite`, `hydro`, `meteo`, `infra` ou `metadata` avant validation Lot C/D.

## Exclusion explicite

| Source exclue | Motif | Décision | Statut |
|---|---|---|---|
| `public.spatial_ref_sys` | table technique PostGIS, non métier | ne pas importer en `staging.raw_*` | VALIDÉ métier, exécution PENDING |
