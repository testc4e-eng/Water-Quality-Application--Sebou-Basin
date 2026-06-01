# Classification des types de mesures

| Type mesure | Description | Tables sources | Support spatial | Usage frontend | Niveau fiabilite |
|---|---|---|---|---|---|
| `STATION_AUTOMATIQUE` | Series reguliere de station instrumentee ou station meteo | `meteo.*`, `hydro.mesure_debit` | station | graphes temporels | eleve si QA OK |
| `HISTORIQUE_RIVIERE` | Mesures labo/terrain historiques en riviere | `qualite.mesure_qualite_riviere` | station riviere | historique station / bassin | bon avec backlog QA ponctuel |
| `HISTORIQUE_NAPPE` | Mesures labo/terrain historiques en nappe | `qualite.mesure_qualite_nappe` | station + nappe | historique nappe | bon avec backlog GEO |
| `HISTORIQUE_BARRAGE` | Mesures historiques barrage | `qualite.mesure_qualite_barrage` si utilise | barrage | consultation patrimoine | variable / a confirmer |
| `SUIVI_SEBOU` | Suivi specifique qualite Sebou | `qualite.mesure_qualite_sebou` | station | vues de campagne / suivi | bon apres mapping |
| `GARDE_HEBDO_BARRAGE` | Suivi hebdomadaire qualite barrage | `qualite.suivi_qualite_barrage_garde_hebdo` | barrage + station | dashboard barrage qualite | bon |
| `INVENTAIRE_POLLUTION_CONSTAT_PREALABLE` | Donnees de reperage et constat | sources pollution / IDP | point ou zone | carte + table | depend validation client |
| `INVENTAIRE_POLLUTION_ANALYSE_FINALE` | Mesures analytiques finales pollution | `qualite.source_pollution_mesure_param` | point pollution | dashboard pollution | moyen a bon selon QA valeur |
| `IDP_GEO_POINT` | Point X/Y resolu ou non resolu | `qualite.source_pollution_prelevement`, `geo.points_non_resolus_idp` proposee | point | carte | variable selon `geo_status` |
| `MODEL_OUTPUT` | Resultat de modele | `swat_output.*`, `wasp_output.*` | subbasin / segment | consultation modeling | legacy a remplacer |
