# Catalogue supports

| Support | Description métier | Géométrie | Source principale | Usage carte | Usage dashboard | Niveau détail |
|---|---|---|---|---|---|---|
| `RIVIERE` | Station ou point de mesure en cours d'eau | point | `infra.stations_mesure`, tables qualité rivière | carte qualité, hydro, biologie | forte | analytique détaillé |
| `NAPPE` | Mesure liée à nappe / station nappe | point | `infra.stations_mesure`, `qualite.mesure_qualite_nappe` | carte qualité nappe | forte | analytique détaillé |
| `BARRAGE` | Ouvrage, qualité barrage, niveau et flux | point / ouvrage | `infra.barrages`, `hydro.mesure_barrage_param`, qualité barrage | carte barrage | très forte | analytique + décisionnel |
| `SEBOU` | Suivi spécifique Sebou | point / station | `qualite.mesure_qualite_sebou` | carte thématique | moyenne | analytique |
| `STATION_METEO` | Station climatique ou évaporation / pluie / température | point | tables `meteo.*` | carte météo | moyenne | série temporelle |
| `SOURCE_POLLUTION` | Source ou constat pollution localisé | point | `qualite.source_pollution_prelevement` | carte pollution / IDP | moyenne | enquête / instruction |
| `POINT_PRELEVEMENT` | Point de prélèvement analyses finales pollution | point | `qualite.source_pollution_prelevement`, `qualite.source_pollution_mesure_param` | carte IDP | moyenne | analytique ponctuel |
| `SOUS_BASSIN` | Unité spatiale de modélisation bassin | polygone | `swat_output.*`, couches géo | carte scénario | faible | consultation |
| `SEGMENT_MODELE` | Segment de modélisation qualité / écoulement | ligne / segment | `wasp_output.*` | carte simulation | faible | consultation |

## Règles métier

- Le support doit toujours être explicite dans les vues multi-supports.
- Le support pilote la lecture carte et les règles de densité.
- `DISQUE_SECCHI` et `T_AIR` dépendent fortement du support et/ou de la source.
