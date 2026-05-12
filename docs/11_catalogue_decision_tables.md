# Catalogue de Décisions de Convergence : abh_sebou_070426 -> abh_sad

Le présent catalogue dresse l'état qualitatif et l'arbitrage organisationnel défini pour chaque table auditée de la base de consolidation. Ce registre trace les décisions stratégiques associées à chaque objet.

| Famille / Domaine | Table Source (Sandbox) | Statut / Volumétrie | Qualité / Anomalies | Décision Cible (abh_sad) | Priorité (Lot) | Action Technique Recommandée |
|---|---|---|---|---|---|---|
| ADMINISTRATIF | `adm_cercles_abhs` | Sain (61 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| ADMINISTRATIF | `adm_communes_abhs` | Sain (346 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| ADMINISTRATIF | `adm_douars_abhs` | Sain (6013 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| ADMINISTRATIF | `adm_provinces_abhs` | Sain (21 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| ADMINISTRATIF | `adm_regions_abhs` | Sain (6 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| ADMINISTRATIF | `adm_villes_abhs` | Sain (33 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| GEO | `geo_bassin_sebou` | Sain (1 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| GEO | `geo_nappes_abhs` | Sain (17 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| GEO | `geo_points_eau_abhs` | Semi-traitée (Sale) (46 L.) | Doublons (28) | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| GEO | `geo_reseau_hydro_abhs` | Sain (28 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| GEO | `geo_sources_abhs` | Sain (135 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| GEO | `geo_sous_bassin_sebou` | Sain (15 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| GEO | `spatial_ref_sys` | Sain (8500 L.) | Sain / Sans doublons | **MIGRER** | LOT 1 | Synchronisation de référentiel géographique spatial pur. |
| INFRASTRUCTURE | `infra_barrages_abhs` | Sain (34 L.) | Doublons (1) | **MIGRER / ENRICHIR** | LOT 1 | Mapping et Enrichment de `infra.stations_mesure` et `infra.barrages` |
| INFRASTRUCTURE | `infra_profils_stations` | Semi-traitée (Sale) (1980 L.) | Doublons (1943) | **MIGRER / ENRICHIR** | LOT 1 | Mapping et Enrichment de `infra.stations_mesure` et `infra.barrages` |
| INFRASTRUCTURE | `infra_stations_abhs` | Sain (390 L.) | Sain / Sans doublons | **MIGRER / ENRICHIR** | LOT 1 | Mapping et Enrichment de `infra.stations_mesure` et `infra.barrages` |
| INVENTAIRE | `inv_decharges_abhs` | Semi-traitée (Sale) (233 L.) | Doublons (196) | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_fosses_septiques_abhs` | Sain (20 L.) | Sain / Sans doublons | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_huileries_abhs` | Sain (612 L.) | Sain / Sans doublons | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_mines_abhs` | Sain (42 L.) | Sain / Sans doublons | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_rejets_abattoirs_abhs` | Sain (61 L.) | Sain / Sans doublons | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_rejets_domestiques_abhs` | Sain (362 L.) | Sain / Sans doublons | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_rejets_ind_abhs` | Sain (11 L.) | Sain / Sans doublons | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_step_abhs` | Semi-traitée (Sale) (41 L.) | Doublons (21) | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_step_ind_abhs` | Sain (15 L.) | Sain / Sans doublons | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| INVENTAIRE | `inv_stm_abhs` | Sain (18 L.) | Sain / Sans doublons | **NORMALISER / MIGRER** | LOT 3 | Standardisation spatiale vers schéma d'Inventaires Sources Polluantes |
| MESURES | `mesures_bathymetries_barrages_abhs` | Semi-traitée (Sale) (62359 L.) | Doublons (62349) | **ARCHIVER / DEPRECIER** | LOT 5 | Potentiel rejet ou archivage legacy car domaine obscur. |
| MESURES | `mesures_debit_jr` | Brute (521433 L.) | Sain / Sans doublons | **MIGRER** | LOT 2 | Insertion en table hydro.* / meteo.* native (Mapping station id_station) |
| MESURES | `mesures_debit_m` | Semi-traitée (Sale) (19316 L.) | Doublons (18836) | **MIGRER** | LOT 2 | Insertion en table hydro.* / meteo.* native (Mapping station id_station) |
| MESURES | `mesures_debit_sources` | Brute (2816 L.) | Sain / Sans doublons | **MIGRER** | LOT 2 | Insertion en table hydro.* / meteo.* native (Mapping station id_station) |
| MESURES | `mesures_evaporation_jr` | Brute (48900 L.) | Sain / Sans doublons | **MIGRER** | LOT 2 | Insertion en table hydro.* / meteo.* native (Mapping station id_station) |
| MESURES | `mesures_idp_2024_qualite_globale` | Semi-traitée (Sale) (4894 L.) | Doublons (3067) | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| MESURES | `mesures_idp_2024_qualite_marche_cadre` | Semi-traitée (Sale) (3614 L.) | Doublons (2297) | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| MESURES | `mesures_idp_2024_src_pollution_globale` | Semi-traitée (Sale) (243 L.) | Doublons (139) | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| MESURES | `mesures_idp_2024_src_pollution_marche_cadre` | Semi-traitée (Sale) (148 L.) | Doublons (115) | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| MESURES | `mesures_niv_eau_barrages` | Normalisée (?) (85166 L.) | Doublons (334) | **MIGRER** | LOT 2 | Insertion en table hydro.* / meteo.* native (Mapping station id_station) |
| MESURES | `mesures_precipitations_jr` | Brute (669880 L.) | Sain / Sans doublons | **MIGRER** | LOT 2 | Insertion en table hydro.* / meteo.* native (Mapping station id_station) |
| MESURES | `mesures_precipitations_jr_max` | Brute (2085 L.) | Sain / Sans doublons | **MIGRER** | LOT 2 | Insertion en table hydro.* / meteo.* native (Mapping station id_station) |
| MESURES | `mesures_precipitations_jr_traitees` | Brute (546007 L.) | Sain / Sans doublons | **MIGRER** | LOT 2 | Insertion en table hydro.* / meteo.* native (Mapping station id_station) |
| MESURES | `mesures_qualite_barrages` | Semi-traitée (Sale) (8714 L.) | Doublons (884) | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| MESURES | `mesures_qualite_nappes` | Normalisée (?) (63088 L.) | Doublons (5) | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| MESURES | `mesures_qualite_rivieres` | Normalisée (?) (60097 L.) | Doublons (22) | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| MESURES | `mesures_suivi_qualite_brg_garde_hebdo` | Semi-traitée (Sale) (7094 L.) | Doublons (3467) | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| MESURES | `mesures_suivi_qualite_sebou_jr_6stations` | Brute (59436 L.) | Sain / Sans doublons | **NORMALISER** | LOT 4 | Mashing complexe vers `qualite.mesure_qualite_unifiee` + Ref_Params |
| REFERENTIEL | `ref_types_mesures` | Sain (64 L.) | Doublons (3) | **ARCHIVER / DEPRECIER** | LOT 5 | Potentiel rejet ou archivage legacy car domaine obscur. |
