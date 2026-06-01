# Catalogue campagnes

## Matrice métier

| Campagne | Objectif | Sources | Support | Période | Fréquence | Paramètres | Usage métier | Niveau décisionnel |
|---|---|---|---|---|---|---|---|---|
| Historique qualité | Consolider les séries qualité multi-supports | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_sebou` | `RIVIERE`, `NAPPE`, `SEBOU` | historique + récent | campagne / séries | physico, chimie, métaux, pollution, microbio, biologique | analyse métier, comparaison, historique | P1 à P2 |
| Qualité barrage | Suivre transparence et qualité barrage | `qualite.mesure_qualite_barrage`, `qualite.suivi_qualite_barrage_garde_hebdo` | `BARRAGE` | récent + historique | suivi hebdomadaire + historique | `DISQUE_SECCHI`, qualité barrage | suivi ouvrage, lecture barrage | P1 |
| Inventaire pollution | Cartographier constats et sources | `qualite.source_pollution_prelevement` | `SOURCE_POLLUTION`, `POINT_PRELEVEMENT` | campagne ponctuelle | événementiel | constats, nature, géométrie, contexte | carte points, instruction métier | P1 |
| Analyses finales pollution | Restituer mesures labo après inventaire | `qualite.source_pollution_prelevement`, `qualite.source_pollution_mesure_param` | `POINT_PRELEVEMENT` | campagne ponctuelle | événementiel | paramètres pollution / labo | tableau + graphique + validation finale | P1 |
| Bathymétrie | Consulter profils et données barrage | backlog métier, non branché dans sources observées | `BARRAGE` | historique / campagnes | ponctuel | profils, profondeur, bathymétrie | consultation technique | P3 |
| Météo | Restituer pluie, évaporation, température | `meteo.mesure_precipitation`, `meteo.mesure_evaporation`, `meteo.mesure_temperature` | `STATION_METEO` | récent + historique + futur | série temporelle | `PRECIP`, `EVAPO`, `TEMP_*` | surveillance hydro-climatique | P1 |
| Hydrologie | Restituer débit, niveau et flux barrage | `hydro.mesure_debit`, `hydro.mesure_barrage_param` | `RIVIERE`, `BARRAGE` | récent + historique | série temporelle / journalier | `DEBIT`, `NIVEAU_EAU`, `VOLUME`, `LACHER`, `APPORT`, `TRANSFERT` | décision ouvrage, analyse quotidienne | P0 à P1 |
| Télémesure future | Préparer la surveillance quasi temps réel | pipeline futur | `STATION_METEO`, `RIVIERE`, `BARRAGE` | temps réel futur | quasi temps réel | mesures capteurs futures | alerte et surveillance | P0 |
| SWAT | Consulter résultats de modélisation bassin | `swat_output.*`, `swat_sebou.*` | `SOUS_BASSIN`, `SEGMENT_MODELE` | scénario | run / version | variables de simulation | aide prospective | P3 |
| WASP | Consulter résultats de modélisation qualité | `wasp_output.*`, `wasp_sebou.*` | `SEGMENT_MODELE` | scénario | run / version | variables de simulation | prospective qualité | P3 |

## Règles structurantes

- Une campagne n'est pas une famille analytique ; c'est une porte d'entrée métier.
- Les campagnes pollution et les analyses qualité courante doivent rester séparées.
- Les campagnes futures télémesure, SWAT et WASP sont `PIPELINE_FUTUR` ou `LEGACY_MODELING_TO_REPLACE` selon le cas.
