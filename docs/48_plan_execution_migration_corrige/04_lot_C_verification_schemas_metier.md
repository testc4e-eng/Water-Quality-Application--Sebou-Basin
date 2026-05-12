# Lot C — Vérification des schémas métier

## Objectif
Valider progressivement les schémas métier avant toute migration finale. Cette étape décide ce qui est conservé, vidé après backup, restructuré ou reconstruit depuis la source officielle.

## Schémas analysés
- `qualite`
- `hydro`
- `meteo`
- `infra`
- `metadata`

## Tableau de vérification

| Schéma | Table | Volume | Action proposée | Justification | Validation |
|---|---|---|---|---|---|
| `hydro` | `barrage_bathymetrie` | 62359 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `mesure_barrage` | 84831 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `mesure_debit` | 521433 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `mesure_debit_mensuel` | 19316 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `mesure_debit_source` | 2816 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `regle_qualite_debit_source` | 19 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `hydro` | `regle_qualite_debit_station` | 390 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `infra` | `barrages` | 34 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `decharge` | 233 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `decharge_inventaire_pollution` | 11 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `decharge_inventaire_pollution_general` | 139 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `fosses_septiques_abhs` | 20 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `huilerie` | 612 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `huilerie_inventaire_pollution` | 606 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `mine` | 42 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `mine_inventaire_pollution` | 39 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `point_eau` | 46 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `profil_station` | 1980 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `rejet_abattoir` | 61 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `rejet_abattoir_inventaire_pollution` | 56 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `rejet_domestique` | 362 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `rejet_industriel` | 11 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `rejet_inventaire_pollution` | 277 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `stations` | 390 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `stations_mesure` | 390 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `infra` | `step` | 41 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `step_industrielle` | 15 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `step_inventaire_pollution` | 49 | vider après backup | Élevé - référentiel pollution potentiellement instable | PENDING |
| `infra` | `stm` | 18 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `api_view_catalog` | 57 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `api_view_column_catalog` | 1101 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `catalogue_type_mesure` | 64 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `dictionnaire_donnees` | 0 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `mapping_abreviation_colonne_inventaire` | 13 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_abreviation_unresolved_sources` | 5 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_barrage` | 11 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_barrage_unresolved_suivi_qualite_brg_garde_hebdo` | 0 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_nappe_unresolved_qualite_nappes` | 292 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_parametre_source` | 184 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_parametre_source_orphans_audit` | 5 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_parametre_unresolved_legacy_qualite_riviere` | 39 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_parametre_unresolved_suivi_qualite_sebou` | 7 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_point_eau` | 46 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_point_eau_unresolved_nappe` | 22 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_point_eau_unresolved_station` | 46 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_profil_station` | 1980 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_profil_unresolved_nappe` | 1204 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_profil_unresolved_station` | 0 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_source` | 19 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station` | 390 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_precip_ann_max` | 0 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_qualite_barrages` | 0 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_qualite_nappes` | 0 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_suivi_qualite_brg_garde_hebdo` | 0 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_station_unresolved_suivi_qualite_brg_garde_hebdo_null_i` | 1 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_step_ind` | 15 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_step_ind_unresolved_commune` | 0 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_stm` | 18 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mapping_stm_unresolved_commune` | 0 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `mv_refresh_status` | 13 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `obs_parametre_coverage` | 16 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `obs_parametre_entite_compat` | 18 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `obs_referentiel_parametre` | 18 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `popup_rules_config` | 11 | conserver | Élevé - référentiel applicatif à conserver jusqu'à arbitrage | PENDING |
| `metadata` | `referentiel_abreviation_inventaire` | 13 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `metadata` | `referentiel_parametre` | 91 | restructurer | Critique - mapping/référentiel instable impactant toute migration | PENDING |
| `meteo` | `mesure_evaporation` | 48900 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `meteo` | `mesure_precipitation` | 546007 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `meteo` | `mesure_precipitation_annuelle_max` | 2085 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `meteo` | `mesure_temperature` | 0 | reconstruire depuis source | Moyen - structure utile, données absentes ou à reconstruire | PENDING |
| `meteo` | `regle_qualite_evaporation_station` | 390 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `mesure_qualite_barrage` | 15808 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `mesure_qualite_nappe` | 63088 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `mesure_qualite_riviere` | 60097 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `mesure_qualite_sebou` | 51402 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `source_pollution_mesure_param` | 7191 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `source_pollution_prelevement` | 141 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `source_pollution_prelevement_lien` | 116 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |
| `qualite` | `suivi_qualite_barrage_garde_hebdo` | 7094 | vider après backup | Élevé - anciennes mesures à sauvegarder avant reconstruction | PENDING |

## Points de vigilance

- Les tables `qualite`, `hydro` et `meteo` ne doivent recevoir que des données validées après QA.
- Les référentiels `infra` doivent être arbitrés avant rattachement pollution/stations.
- Les mappings `metadata` instables doivent être reconstruits depuis le référentiel paramètres validé.
