# Profiling des candidats d'arbitrage

Nombre total de candidats analysés : `12187`.

## Par type d'anomalie

| anomaly_type | count |
| --- | --- |
| DUPLICATE_EXACT | 5000 |
| INVENTORY_TO_MEASURE_MATCH | 5000 |
| DUPLICATE_NEAR | 2187 |

## Par méthode de matching

| match_method | count |
| --- | --- |
| DUPLICATE_EXACT | 5000 |
| ID_EXACT+COORD_EXACT+NOM_COMMUNE | 3615 |
| DUPLICATE_NEAR | 2187 |
| COORD_EXACT+NOM_COMMUNE | 916 |
| ID_EXACT | 396 |
| COORD_EXACT | 70 |
| ID_EXACT+NOM_COMMUNE | 3 |

## Par statut recommandé source

| recommended_status | count |
| --- | --- |
| PENDING_REVIEW | 7187 |
| AUTO_CANDIDATE | 5000 |

## Par paire de couches

| layer_pair | count |
| --- | --- |
| idp_mesures_qualité_globale_2024 -> idp_mesures_qualité_globale_2024 | 6625 |
| idp_src_pollution_marche_cadre -> idp_mesures_qualité_marche_cadre_2024 | 3614 |
| idp_src_pollution_globale -> idp_mesures_qualité_globale_2024 | 1576 |
| idp_src_pollution_marche_cadre -> idp_mesures_qualité_globale_2024 | 275 |
| idp_src_pollution_globale -> idp_mesures_qualité_marche_cadre_2024 | 93 |
| idp_src_pollution_globale -> idp_src_pollution_globale | 4 |

## Distribution des distances

| distance_bucket | count |
| --- | --- |
| 0 m | 9601 |
| ]0,5] m | 2187 |
| VIDE | 394 |
| >25 m | 5 |

- min : `0.0`
- médiane : `0.0`
- max : `11284.749`

## Distribution des scores

| score_bucket | count |
| --- | --- |
| VIDE | 7187 |
| >=0.95 | 5000 |

- min : `0.98`
- médiane : `1.0`
- max : `1.0`

## Top communes concernées

| commune | count |
| --- | --- |
| Kariat Ba Mhamed | 2187 |
| Rhouazi | 2187 |
| Ain Karma | 1234 |
| Moulay Driss Zarhoun | 1198 |
| Boufekrane | 581 |
| Echebanate | 418 |
| Arbaoua | 377 |
| Ait Bouyahya Lahjama | 310 |
| Taza | 264 |
| Sidi Slimane | 252 |
| Ait Siberne | 252 |
| Ben Mansour | 235 |
| Kenitra | 220 |
| Bel Ksiri | 211 |
| Sidi Kacem | 209 |
| Sidi Ameur Al Hadi | 209 |
| Ain Dfali | 209 |
| Nzalat Beni Amar | 209 |
| Bouhouda | 105 |
| Bouknadel | 103 |
| Sidi Mokhfi | 103 |
| Bab Marzouka | 91 |
| Laouamra | 91 |
| Tigrigra | 82 |
| Meknes | 82 |

## Top cas de conflit

| conflict_type | count |
| --- | --- |
| COMMUNE+NAME | 2187 |
| NAME | 486 |

## Lots générés

| batch | count |
| --- | --- |
| batch_01_auto_high_confidence.csv | 4534 |
| batch_02_geometry_conflicts.csv | 2277 |
| batch_03_geometry_missing.csv | 0 |
| batch_04_marche_cadre_inventory_measurement.csv | 3614 |
| batch_05_global_inventory_measurement.csv | 8573 |
| batch_99_to_review.csv | 0 |